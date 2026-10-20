import test from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../src/worker.mjs';
import { MemoryKv } from './memory-kv.mjs';

// Invite-only review intake. See specs/next-reviews-intake and ADR-0010.
const ORIGIN = 'https://www.naindev.com';
const ENDPOINT = 'https://reviews.example.test';
const ADMIN = 'admin-secret-for-tests-only-0123456789';

function setup() {
  const state = { time: Date.UTC(2026, 9, 19, 12, 0, 0) };
  const clock = () => state.time;
  const env = { REVIEWS: new MemoryKv(clock), ADMIN_TOKEN: ADMIN, ALLOWED_ORIGIN: ORIGIN, now: clock };
  const call = (path, { method = 'GET', headers = {}, body, origin = ORIGIN, ip = '203.0.113.7', admin = false, raw } = {}) => {
    const init = { method, headers: { 'cf-connecting-ip': ip, ...headers } };
    if (origin) init.headers.origin = origin;
    if (admin) init.headers.authorization = `Bearer ${ADMIN}`;
    if (body !== undefined || raw !== undefined) {
      init.headers['content-type'] ??= 'application/json';
      init.body = raw ?? JSON.stringify(body);
    }
    return handle(new Request(`${ENDPOINT}${path}`, init), env);
  };
  const invite = async (overrides = {}) => {
    const response = await call('/v1/admin/invitations', { method: 'POST', admin: true, origin: null, body: { label: 'David (Contrast3D)', relationship: 'partner', ...overrides } });
    return response.json();
  };
  return { state, env, call, invite };
}

const submission = (token, overrides = {}) => ({
  token,
  name: 'David Example',
  role: 'Creative director',
  company: 'Contrast3D',
  companyUrl: 'https://www.contrast3d.com/',
  quote: 'Working together was clear, calm and well organised from the first call.',
  consent: true,
  website: '',
  ...overrides,
});

test('REV-001: an invitation returns the token once and stores only its hash', async () => {
  const { env, invite } = setup();
  const created = await invite();
  assert.match(created.token, /^[A-Za-z0-9_-]{40,}$/);
  assert.ok(created.expiresAt);
  for (const [key, item] of env.REVIEWS.map) {
    assert.ok(!key.includes(created.token), key);
    assert.ok(!item.value.includes(created.token), key);
  }
  const record = JSON.parse([...env.REVIEWS.map.entries()].find(([key]) => key.startsWith('inv:'))[1].value);
  assert.equal(record.relationship, 'partner');
  assert.equal(record.used, false);
});

test('REV-006: owner routes answer 404 without the exact bearer secret', async () => {
  const { call, env } = setup();
  for (const headers of [{}, { authorization: 'Bearer wrong' }, { authorization: `Bearer ${ADMIN}x` }]) {
    const response = await call('/v1/admin/submissions', { headers, origin: null });
    assert.equal(response.status, 404);
  }
  env.ADMIN_TOKEN = undefined;
  assert.equal((await call('/v1/admin/submissions', { admin: true, origin: null })).status, 404);
});

test('REV-002: unknown, expired and used links get the same generic answer', async () => {
  const { call, invite, state } = setup();
  const { token } = await invite({ ttlDays: 1 });
  const ok = await call(`/v1/invitations/${token}`);
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).label, 'David (Contrast3D)');

  const unknown = await call('/v1/invitations/not-a-real-token');
  state.time += 2 * 24 * 3600 * 1000;
  const expired = await call(`/v1/invitations/${token}`);
  assert.equal(unknown.status, 404);
  assert.equal(expired.status, 404);
  assert.deepEqual(await unknown.json(), await expired.json());
});

test('REV-003: a valid submission is stored as pending with the relationship from the invitation', async () => {
  const { call, invite, env } = setup();
  const { token } = await invite({ relationship: 'partner' });
  const response = await call('/v1/submissions', { method: 'POST', body: submission(token) });
  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), { ok: true });

  const list = await (await call('/v1/admin/submissions', { admin: true, origin: null })).json();
  assert.equal(list.submissions.length, 1);
  const [stored] = list.submissions;
  assert.equal(stored.relationship, 'partner');
  assert.equal(stored.name, 'David Example');
  assert.equal(stored.consent.granted, true);
  assert.match(stored.consent.version, /^\d{4}-\d{2}-v\d+$/);
  assert.ok(stored.invitationId);
  assert.equal('token' in stored, false);

  const again = await call('/v1/submissions', { method: 'POST', body: submission(token) });
  assert.equal(again.status, 404, 'the link is single use');
  assert.equal([...env.REVIEWS.map.keys()].filter((key) => key.startsWith('sub:')).length, 1);
});

test('REV-003: the submitter cannot choose the relationship or any other field', async () => {
  const { call, invite } = setup();
  const { token } = await invite({ relationship: 'partner' });
  const response = await call('/v1/submissions', { method: 'POST', body: submission(token, { relationship: 'client' }) });
  assert.equal(response.status, 422);
});

test('REV-004: field limits, consent, https links and unknown fields are enforced', async () => {
  const { call, invite } = setup();
  const bad = [
    { quote: 'Too short.' },
    { quote: 'x'.repeat(1501) },
    { name: 'n'.repeat(81) },
    { role: 'r'.repeat(121) },
    { company: '' },
    { companyUrl: 'http://insecure.example/' },
    { sourceUrl: `https://example.com/${'a'.repeat(300)}` },
    { consent: false },
    { consent: undefined },
    { surprise: 'field' },
  ];
  for (const overrides of bad) {
    const { token } = await invite();
    const response = await call('/v1/submissions', { method: 'POST', body: submission(token, overrides) });
    assert.equal(response.status, 422, JSON.stringify(overrides).slice(0, 60));
    assert.equal((await call(`/v1/invitations/${token}`)).status, 200, 'a rejected submission does not burn the link');
  }
});

test('REV-004: a filled honeypot looks successful, stores nothing and keeps the link unused', async () => {
  const { call, invite, env } = setup();
  const { token } = await invite();
  const response = await call('/v1/submissions', { method: 'POST', body: submission(token, { website: 'https://spam.example' }) });
  assert.equal(response.status, 201);
  assert.equal([...env.REVIEWS.map.keys()].filter((key) => key.startsWith('sub:')).length, 0);
  assert.equal((await call(`/v1/invitations/${token}`)).status, 200);
});

test('REV-004: only JSON from the allowed origin and of a sane size is accepted', async () => {
  const { call, invite } = setup();
  const { token } = await invite();
  const body = submission(token);
  assert.equal((await call('/v1/submissions', { method: 'POST', body, origin: 'https://evil.example' })).status, 403);
  assert.equal((await call('/v1/submissions', { method: 'POST', body, origin: null })).status, 403);
  assert.equal((await call('/v1/submissions', { method: 'POST', raw: 'a=b', headers: { 'content-type': 'text/plain' } })).status, 415);
  assert.equal((await call('/v1/submissions', { method: 'POST', raw: JSON.stringify({ pad: 'x'.repeat(9000) }) })).status, 413);
  assert.equal((await call('/v1/submissions', { method: 'POST', raw: '{not json' })).status, 400);

  const allowed = await call('/v1/submissions', { method: 'OPTIONS' });
  assert.equal(allowed.status, 204);
  assert.equal(allowed.headers.get('access-control-allow-origin'), ORIGIN);
  const other = await call('/v1/submissions', { method: 'OPTIONS', origin: 'https://evil.example' });
  assert.equal(other.headers.get('access-control-allow-origin'), null);
});

test('REV-005: requests from one address are limited per hour', async () => {
  const { call } = setup();
  let last;
  for (let i = 0; i < 21; i += 1) last = await call('/v1/invitations/unknown-token');
  assert.equal(last.status, 429);
  const other = await call('/v1/invitations/unknown-token', { ip: '198.51.100.9' });
  assert.equal(other.status, 404, 'another address is unaffected');
});

test('REV-007: pending data expires, the owner can delete it and nothing personal is logged', async () => {
  const { call, invite, env } = setup();
  const logged = [];
  const originals = { log: console.log, error: console.error, warn: console.warn, info: console.info };
  for (const name of Object.keys(originals)) console[name] = (...args) => logged.push(args.join(' '));
  try {
    const { token } = await invite();
    await call('/v1/submissions', { method: 'POST', body: submission(token) });
    const list = await (await call('/v1/admin/submissions', { admin: true, origin: null })).json();
    assert.equal((await call(`/v1/admin/submissions/${list.submissions[0].id}`, { method: 'DELETE', admin: true, origin: null })).status, 204);
    assert.equal((await (await call('/v1/admin/submissions', { admin: true, origin: null })).json()).submissions.length, 0);
  } finally {
    Object.assign(console, originals);
  }
  assert.deepEqual(logged.filter((line) => /David|Contrast3D|203\.0\.113/.test(line) || /[A-Za-z0-9_-]{40,}/.test(line)), []);

  const { call: call2, invite: invite2, env: env2 } = setup();
  const second = await invite2();
  await call2('/v1/submissions', { method: 'POST', body: submission(second.token) });
  const stored = [...env2.REVIEWS.map.entries()].find(([key]) => key.startsWith('sub:'))[1];
  assert.equal(stored.ttl, 60 * 24 * 3600);
  assert.ok([...env2.REVIEWS.map.entries()].filter(([key]) => key.startsWith('rl:')).every(([, item]) => item.ttl > 0));
  void env;
});

test('the service has a health route and answers unknown routes with 404', async () => {
  const { call } = setup();
  assert.equal((await call('/v1/health')).status, 200);
  assert.equal((await call('/nope')).status, 404);
  assert.equal((await call('/v1/health')).headers.get('cache-control'), 'no-store');
});
