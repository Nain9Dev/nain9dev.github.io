import test from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../services/reviews/src/worker.mjs';
import { MemoryKv } from '../services/reviews/test/memory-kv.mjs';
import { createInvitation, pullSubmissions, deleteSubmission, entryFromSubmission, inviteLink } from './lib/reviews-client.mjs';
import { addEntry } from './lib/testimonials.mjs';

// CLI side of the review intake. See specs/next-reviews-intake (REV-008).
const ENDPOINT = 'https://reviews.example.test';
const ADMIN = 'admin-secret-for-tests-only-0123456789';
const ORIGIN = 'https://www.naindev.com';

function service() {
  const state = { time: Date.UTC(2026, 9, 19, 12, 0, 0) };
  const env = { REVIEWS: new MemoryKv(() => state.time), ADMIN_TOKEN: ADMIN, ALLOWED_ORIGIN: ORIGIN, now: () => state.time };
  const fetchImpl = (url, init) => handle(new Request(url, init), env);
  const options = { endpoint: ENDPOINT, adminToken: ADMIN, fetchImpl };
  const submit = (token, overrides = {}) => handle(new Request(`${ENDPOINT}/v1/submissions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin: ORIGIN, 'cf-connecting-ip': '203.0.113.5' },
    body: JSON.stringify({ token, name: 'David Example', role: 'Creative director', company: 'Contrast3D', quote: 'Working together was clear, calm and well organised from the first call.', consent: true, website: '', ...overrides }),
  }), env);
  return { env, options, submit, state };
}

test('createInvitation returns a ready link and never exposes the admin secret', async () => {
  const { options } = service();
  const invitation = await createInvitation({ ...options, label: 'David (Contrast3D)', relationship: 'partner', ttlDays: 7 });
  assert.match(invitation.token, /^[A-Za-z0-9_-]{40,}$/);
  assert.equal(invitation.link, inviteLink(invitation.token));
  assert.match(invitation.link, /^https:\/\/www\.naindev\.com\/recursos\/recomendacion\/\?t=/);
  assert.ok(!JSON.stringify(invitation).includes(ADMIN));
});

test('a wrong admin secret fails with a clear message', async () => {
  const { options } = service();
  await assert.rejects(createInvitation({ ...options, adminToken: 'wrong', label: 'X', relationship: 'client' }), /rejected/);
});

test('pullSubmissions lists what invited people wrote and entryFromSubmission builds a pending-ready entry', async () => {
  const { options, submit } = service();
  const { token } = await createInvitation({ ...options, label: 'David (Contrast3D)', relationship: 'partner' });
  assert.equal((await submit(token)).status, 201);

  const [submission] = await pullSubmissions(options);
  const entry = entryFromSubmission(submission, []);
  assert.equal(entry.relationship, 'partner');
  assert.equal(entry.id, 'contrast3d-partner-2026');
  assert.equal(entry.date, '2026-10-19');
  assert.equal(entry.consent.granted, true);
  assert.match(entry.consent.evidence, /invitation .* consent text 2026-10-v1/);
  const stored = addEntry([], entry);
  assert.equal(stored[0].status, 'pending');
});

test('entryFromSubmission avoids id collisions', async () => {
  const { options, submit } = service();
  const { token } = await createInvitation({ ...options, label: 'A', relationship: 'client' });
  await submit(token);
  const [submission] = await pullSubmissions(options);
  const first = entryFromSubmission(submission, []);
  const second = entryFromSubmission(submission, [first]);
  assert.notEqual(first.id, second.id);
});

test('deleteSubmission removes a processed submission from the service', async () => {
  const { options, submit } = service();
  const { token } = await createInvitation({ ...options, label: 'A', relationship: 'client' });
  await submit(token);
  const [submission] = await pullSubmissions(options);
  await deleteSubmission({ ...options, id: submission.id });
  assert.deepEqual(await pullSubmissions(options), []);
});
