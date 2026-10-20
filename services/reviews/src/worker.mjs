// Invite-only review intake (specs/next-reviews-intake, ADR-0010).
// A Cloudflare Worker using Web APIs only: no runtime dependencies, no cookies, no logging of personal data.
// Bindings: REVIEWS (KV namespace), ADMIN_TOKEN (secret), ALLOWED_ORIGIN (default https://www.naindev.com).

const CONSENT_VERSION = '2026-10-v1';
const RATE_LIMIT_PER_HOUR = 20;
const PENDING_TTL_SECONDS = 60 * 24 * 3600;
const MAX_BODY_CHARACTERS = 8192;
const FIELD_LIMITS = { name: 80, role: 120, company: 120, url: 300, quoteMin: 20, quoteMax: 1500 };
const SUBMISSION_FIELDS = new Set(['token', 'name', 'role', 'company', 'companyUrl', 'sourceUrl', 'quote', 'consent', 'website']);
const RELATIONSHIPS = new Set(['client', 'partner']);

const encoder = new TextEncoder();

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

// Compares digests so the comparison time does not depend on where two secrets differ.
async function secretsMatch(given, expected) {
  const [a, b] = await Promise.all([sha256Hex(given), sha256Hex(expected)]);
  let difference = 0;
  for (let i = 0; i < a.length; i += 1) difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return difference === 0;
}

function respond(request, env, status, body, extra = {}) {
  const headers = new Headers({
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    ...extra,
  });
  if (body !== undefined) headers.set('content-type', 'application/json');
  const origin = request.headers.get('origin');
  if (origin && origin === allowedOrigin(env)) {
    headers.set('access-control-allow-origin', origin);
    headers.set('vary', 'Origin');
  }
  return new Response(body === undefined ? null : JSON.stringify(body), { status, headers });
}

const allowedOrigin = (env) => env.ALLOWED_ORIGIN ?? 'https://www.naindev.com';
const now = (env) => (env.now ?? Date.now)();
const notFound = (request, env) => respond(request, env, 404, { ok: false, error: 'not_found' });
const invalidLink = (request, env) => respond(request, env, 404, { ok: false, error: 'invalid_link' });

async function isRateLimited(request, env) {
  const address = request.headers.get('cf-connecting-ip') ?? 'unknown';
  const bucket = Math.floor(now(env) / 3_600_000);
  const key = `rl:${(await sha256Hex(address)).slice(0, 24)}:${bucket}`;
  const count = Number((await env.REVIEWS.get(key)) ?? 0);
  if (count >= RATE_LIMIT_PER_HOUR) return true;
  await env.REVIEWS.put(key, String(count + 1), { expirationTtl: 7200 });
  return false;
}

async function isOwner(request, env) {
  if (!env.ADMIN_TOKEN) return false;
  const header = request.headers.get('authorization') ?? '';
  return header.startsWith('Bearer ') && secretsMatch(header.slice(7), env.ADMIN_TOKEN);
}

async function readJson(request, env) {
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return { error: respond(request, env, 415, { ok: false, error: 'unsupported_media_type' }) };
  }
  const text = await request.text();
  if (text.length > MAX_BODY_CHARACTERS) return { error: respond(request, env, 413, { ok: false, error: 'too_large' }) };
  try {
    const value = JSON.parse(text);
    if (value === null || typeof value !== 'object' || Array.isArray(value)) throw new Error('not an object');
    return { value };
  } catch {
    return { error: respond(request, env, 400, { ok: false, error: 'invalid_json' }) };
  }
}

const hasControlCharacters = (value, allowNewlines) => (allowNewlines ? /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/ : /[\u0000-\u001f\u007f]/).test(value);

function cleanText(value, { min = 1, max, multiline = false }) {
  if (typeof value !== 'string') return null;
  const text = value.normalize('NFC').trim();
  if (text.length < min || text.length > max || hasControlCharacters(text, multiline)) return null;
  return text;
}

function cleanUrl(value) {
  if (typeof value !== 'string' || value.length > FIELD_LIMITS.url) return null;
  try {
    return new URL(value).protocol === 'https:' ? value : null;
  } catch {
    return null;
  }
}

function validateSubmission(input) {
  const invalid = [];
  for (const field of Object.keys(input)) if (!SUBMISSION_FIELDS.has(field)) invalid.push(field);
  const clean = {
    name: cleanText(input.name, { max: FIELD_LIMITS.name }),
    role: cleanText(input.role, { max: FIELD_LIMITS.role }),
    company: cleanText(input.company, { max: FIELD_LIMITS.company }),
    quote: cleanText(input.quote, { min: FIELD_LIMITS.quoteMin, max: FIELD_LIMITS.quoteMax, multiline: true }),
  };
  for (const [field, value] of Object.entries(clean)) if (value === null) invalid.push(field);
  for (const field of ['companyUrl', 'sourceUrl']) {
    if (input[field] === undefined || input[field] === '') continue;
    const url = cleanUrl(input[field]);
    if (url === null) invalid.push(field);
    else clean[field] = url;
  }
  if (input.consent !== true) invalid.push('consent');
  if (typeof input.token !== 'string' || input.token.length < 20 || input.token.length > 128) invalid.push('token');
  return { invalid, clean };
}

async function findInvitation(env, token) {
  const hash = await sha256Hex(token);
  const key = `inv:${hash}`;
  const record = await env.REVIEWS.get(key, 'json');
  if (!record || record.used || record.expiresAt <= now(env)) return null;
  return { key, record };
}

async function createInvitation(request, env) {
  const parsed = await readJson(request, env);
  if (parsed.error) return parsed.error;
  const { label, relationship, ttlDays = 14 } = parsed.value;
  const cleanLabel = cleanText(label, { max: 80 });
  if (cleanLabel === null || !RELATIONSHIPS.has(relationship) || !Number.isInteger(ttlDays) || ttlDays < 1 || ttlDays > 60) {
    return respond(request, env, 422, { ok: false, error: 'invalid' });
  }
  const token = randomToken();
  const hash = await sha256Hex(token);
  const expiresAt = now(env) + ttlDays * 86_400_000;
  const record = { id: hash.slice(0, 12), label: cleanLabel, relationship, createdAt: new Date(now(env)).toISOString(), expiresAt, used: false };
  await env.REVIEWS.put(`inv:${hash}`, JSON.stringify(record), { expirationTtl: ttlDays * 86_400 });
  return respond(request, env, 201, { ok: true, id: record.id, token, expiresAt: new Date(expiresAt).toISOString() });
}

async function receiveSubmission(request, env) {
  if (request.headers.get('origin') !== allowedOrigin(env)) return respond(request, env, 403, { ok: false, error: 'forbidden' });
  const parsed = await readJson(request, env);
  if (parsed.error) return parsed.error;
  const input = parsed.value;
  // Bots fill hidden fields: look successful, store nothing and keep the invitation untouched.
  if (typeof input.website === 'string' && input.website !== '') return respond(request, env, 201, { ok: true });

  const { invalid, clean } = validateSubmission(input);
  if (invalid.length > 0) return respond(request, env, 422, { ok: false, error: 'invalid', fields: invalid });

  const invitation = await findInvitation(env, input.token);
  if (!invitation) return invalidLink(request, env);
  const remaining = Math.max(60, Math.ceil((invitation.record.expiresAt - now(env)) / 1000));
  await env.REVIEWS.put(invitation.key, JSON.stringify({ ...invitation.record, used: true }), { expirationTtl: remaining });

  const id = crypto.randomUUID();
  const submission = {
    id,
    invitationId: invitation.record.id,
    label: invitation.record.label,
    relationship: invitation.record.relationship,
    ...clean,
    consent: { granted: true, version: CONSENT_VERSION, at: new Date(now(env)).toISOString() },
    submittedAt: new Date(now(env)).toISOString(),
  };
  await env.REVIEWS.put(`sub:${id}`, JSON.stringify(submission), { expirationTtl: PENDING_TTL_SECONDS });
  return respond(request, env, 201, { ok: true });
}

async function listSubmissions(request, env) {
  const { keys } = await env.REVIEWS.list({ prefix: 'sub:' });
  const submissions = (await Promise.all(keys.map(({ name }) => env.REVIEWS.get(name, 'json')))).filter(Boolean);
  submissions.sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  return respond(request, env, 200, { ok: true, submissions });
}

export async function handle(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  const method = request.method;

  if (method === 'OPTIONS') {
    const headers = {};
    if (request.headers.get('origin') === allowedOrigin(env)) {
      headers['access-control-allow-methods'] = 'GET, POST, OPTIONS';
      headers['access-control-allow-headers'] = 'content-type';
      headers['access-control-max-age'] = '600';
    }
    return respond(request, env, 204, undefined, headers);
  }

  if (pathname === '/v1/health' && method === 'GET') return respond(request, env, 200, { ok: true });

  if (pathname.startsWith('/v1/admin/')) {
    if (!(await isOwner(request, env))) return notFound(request, env);
    if (pathname === '/v1/admin/invitations' && method === 'POST') return createInvitation(request, env);
    if (pathname === '/v1/admin/submissions' && method === 'GET') return listSubmissions(request, env);
    const match = pathname.match(/^\/v1\/admin\/submissions\/([0-9a-f-]{36})$/);
    if (match && method === 'DELETE') {
      await env.REVIEWS.delete(`sub:${match[1]}`);
      return respond(request, env, 204, undefined);
    }
    return notFound(request, env);
  }

  const publicRoute = (method === 'GET' && pathname.startsWith('/v1/invitations/')) || (method === 'POST' && pathname === '/v1/submissions');
  if (!publicRoute) return notFound(request, env);
  if (await isRateLimited(request, env)) return respond(request, env, 429, { ok: false, error: 'rate_limited' }, { 'retry-after': '3600' });

  if (method === 'POST') return receiveSubmission(request, env);
  const token = decodeURIComponent(pathname.slice('/v1/invitations/'.length));
  if (token.length < 1 || token.length > 128) return invalidLink(request, env);
  const invitation = await findInvitation(env, token);
  return invitation ? respond(request, env, 200, { ok: true, label: invitation.record.label }) : invalidLink(request, env);
}

export default { fetch: (request, env) => handle(request, env) };
