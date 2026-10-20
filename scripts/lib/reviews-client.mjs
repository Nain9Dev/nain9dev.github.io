// CLI side of the review intake (specs/next-reviews-intake, REV-008). The fetch implementation is injected so
// tests run against the Worker handler without a network.

const SITE = 'https://www.naindev.com';

export const inviteLink = (token, site = SITE) => `${site}/recursos/recomendacion/?t=${token}`;

async function call({ endpoint, adminToken, fetchImpl = fetch }, path, init = {}) {
  const response = await fetchImpl(`${endpoint}${path}`, {
    ...init,
    headers: { authorization: `Bearer ${adminToken}`, ...(init.body ? { 'content-type': 'application/json' } : {}) },
  });
  if (response.status === 404 || response.status === 401) {
    throw new Error('The reviews service rejected the request: check REVIEWS_ENDPOINT and REVIEWS_ADMIN_TOKEN.');
  }
  if (!response.ok && response.status !== 204) throw new Error(`The reviews service answered ${response.status}.`);
  return response.status === 204 ? undefined : response.json();
}

export async function createInvitation({ label, relationship, ttlDays = 14, ...connection }) {
  const body = await call(connection, '/v1/admin/invitations', { method: 'POST', body: JSON.stringify({ label, relationship, ttlDays }) });
  return { id: body.id, token: body.token, expiresAt: body.expiresAt, link: inviteLink(body.token) };
}

export async function pullSubmissions(connection) {
  return (await call(connection, '/v1/admin/submissions')).submissions;
}

export const deleteSubmission = ({ id, ...connection }) => call(connection, `/v1/admin/submissions/${id}`, { method: 'DELETE' });

const slug = (value) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Builds a testimonial entry from a submission. Consent evidence is generated from the submission itself;
// the relationship comes from the invitation, never from the submitter.
export function entryFromSubmission(submission, existing) {
  const date = submission.submittedAt.slice(0, 10);
  const base = `${slug(submission.company) || 'author'}-${submission.relationship}-${date.slice(0, 4)}`;
  let id = base;
  for (let n = 2; existing.some((entry) => entry.id === id); n += 1) id = `${base}-${n}`;
  const entry = {
    id,
    name: submission.name,
    role: submission.role,
    company: submission.company,
    relationship: submission.relationship,
    date,
    quote: submission.quote,
    consent: {
      granted: true,
      date: submission.consent.at.slice(0, 10),
      evidence: `Submitted through invitation ${submission.invitationId} on ${date}; consent text ${submission.consent.version}`,
    },
  };
  if (submission.companyUrl) entry.companyUrl = submission.companyUrl;
  if (submission.sourceUrl) entry.sourceUrl = submission.sourceUrl;
  return entry;
}
