import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Request page form and CSP for the invite-only intake. See specs/next-reviews-intake (REV-009, REV-010).
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('REV-009: the form is rendered only when the endpoint is configured and keeps the email flow', async () => {
  const page = await read('src/pages/recursos/recomendacion.astro');
  assert.match(page, /const reviewsEndpoint = import\.meta\.env\.PUBLIC_REVIEWS_ENDPOINT/);
  assert.match(page, /\{reviewsEndpoint && \(\s*<div data-reviews/);
  assert.match(page, /data-copy-email/, 'the email fallback is always present');
  for (const state of ['checking', 'invalid', 'unavailable', 'form', 'error-fields', 'error-rate', 'error', 'success']) {
    assert.match(page, new RegExp(`data-state="${state}"`), state);
  }
});

test('REV-009: the form is hardened against bots and never renders submitted HTML', async () => {
  const page = await read('src/pages/recursos/recomendacion.astro');
  assert.match(page, /name="website"[^>]*tabindex="-1"[^>]*autocomplete="off"/, 'honeypot field');
  assert.match(page, /class="review-trap" aria-hidden="true"/);
  assert.equal(page.match(/credentials: 'omit'/g)?.length, 2, 'no cookies are sent');
  const script = page.slice(page.indexOf('<script is:inline>'));
  assert.doesNotMatch(script, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|eval\(/);
  assert.match(script, /textContent = body\.label/);
  assert.match(page, /name="consent" type="checkbox" required/);
  assert.match(page, /maxlength="1500"/);
});

test('REV-010: the Content Security Policy gains the intake origin only when configured', async () => {
  const seo = await read('src/components/SEO.astro');
  assert.match(seo, /const reviewsEndpoint = import\.meta\.env\.PUBLIC_REVIEWS_ENDPOINT/);
  assert.match(seo, /\.\.\.\(reviewsEndpoint \? \[new URL\(reviewsEndpoint\)\.origin\] : \[\]\)/);
  assert.match(seo, /connect-src \$\{connectSources\}/);
  assert.match(seo, /content=\{contentSecurityPolicy\}/);
  assert.match(seo, /form-action 'self'/, 'the form posts through fetch, so form-action stays closed');
});

test('REV-010: enabling the endpoint requires an approved privacy section', async () => {
  const spec = await read('specs/next-reviews-intake/spec.md');
  assert.match(spec, /privacy policy shall describe this processing/);
  const blockers = await read('docs/41-blockers.md');
  assert.match(blockers, /\| B-021 \| `\[H\]` \| Approved privacy policy section for the intake/);
  const workflow = await read('.github/workflows/deploy.yml');
  assert.doesNotMatch(workflow, /PUBLIC_REVIEWS_ENDPOINT/, 'not enabled in production until B-018 to B-021 are done');
});
