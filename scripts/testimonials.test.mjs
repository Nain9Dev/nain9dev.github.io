import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Curated testimonials with consent. See specs/next-testimonials and ADR-0008.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const SECTION = 'src/components/home/Testimonials.astro';
const REQUEST_PAGE = 'src/pages/recursos/recomendacion.astro';

test('TEST-001: the collection schema makes consent and attribution mandatory', async () => {
  const config = await read('src/content.config.ts');
  const block = config.match(/const testimonials = defineCollection\(\{([\s\S]*?)\n\}\);/)?.[1] ?? '';
  assert.match(block, /file\('src\/data\/testimonials\.json'\)/);
  for (const field of ['name', 'role', 'company', 'date', 'relationship', 'quote', 'consent']) {
    assert.match(block, new RegExp(`\\b${field}:`), field);
  }
  assert.match(block, /z\.enum\(\['client', 'partner'\]\)/);
  assert.match(block, /granted: z\.literal\(true\)/);
  assert.match(block, /evidence: z\.string\(\)\.min\(/);
  assert.match(config, /collections = \{[^}]*testimonials/);
});

test('TEST-007: stored recommendations are consented, not placeholders and not metric claims of ours', async () => {
  const entries = JSON.parse(await read('src/data/testimonials.json'));
  assert.ok(Array.isArray(entries));
  for (const entry of entries) {
    assert.notEqual(entry.name, 'Cliente de Prueba');
    // The repository is public: a pending entry is a decision not taken yet, so it must be approved or rejected before any commit.
    assert.equal(entry.status, 'approved', `${entry.id}: approve or reject it before committing`);
    assert.equal(entry.consent?.granted, true, `${entry.id}: consent`);
    assert.ok(entry.consent?.evidence?.length >= 10, `${entry.id}: evidence`);
    assert.ok(['client', 'partner'].includes(entry.relationship), `${entry.id}: relationship`);
  }
});

test('TEST-002 and TEST-003: the section renders only approved entries, with attribution', async () => {
  const section = await read(SECTION);
  assert.match(section, /getCollection\('testimonials', \(\{ data \}\) => data\.status === 'approved'\)/);
  assert.match(section, /\{approved\.length > 0 && \(/);
  assert.match(section, /<blockquote/);
  assert.match(section, /testimonial\.data\.name/);
  assert.match(section, /testimonial\.data\.role/);
  assert.match(section, /testimonial\.data\.company/);
  assert.match(section, /companyUrl/);
  assert.match(section, /sourceUrl/);
  const home = await read('src/pages/index.astro');
  assert.match(home, /import Testimonials from '\.\.\/components\/home\/Testimonials\.astro'/);
  assert.match(home, /<Testimonials \/>/);
  assert.doesNotMatch(home, /Oculto temporalmente/);
});

test('TEST-004: a partner recommendation is labelled as not a client review', async () => {
  const section = await read(SECTION);
  assert.match(section, /relationship === 'partner'/);
  assert.match(section, /Recomendación de un socio, no de un cliente/);
});

test('TEST-005: no ratings or self-published review markup anywhere', async () => {
  const section = await read(SECTION);
  const seo = await read('src/components/SEO.astro');
  assert.doesNotMatch(section + seo, /AggregateRating|"@type":\s*"Review"|ratingValue|[★⭐]/);
  assert.doesNotMatch(text(section.replace(/<style[\s\S]*?<\/style>/g, '')), /todos (nuestros )?clientes|100\s*%|satisfech/i);
});

test('TEST-006: the request page is private, form-free and states the rules', async () => {
  const page = await read(REQUEST_PAGE);
  assert.match(page, /robots="noindex, nofollow"/);
  assert.doesNotMatch(page, /<script[^>]+src=|<iframe|<link[^>]+href="https?:/i);
  // The form exists only when the invite-only intake is configured (specs/next-reviews-intake, REV-009).
  const guard = page.indexOf('{reviewsEndpoint && (');
  assert.ok(guard > 0, 'the form is behind the endpoint guard');
  for (const match of page.matchAll(/<form/g)) assert.ok(match.index > guard, 'no form outside the guard');
  const body = text(page);
  assert.equal(page.match(/<h1[\s>]/g)?.length, 1);
  assert.equal(page.match(/<li class="question"/g)?.length, 4);
  assert.match(body, /opinión honesta/i);
  assert.match(body, /no busco una reseña favorable/i);
  assert.match(body, /retirar tu permiso/i);
  assert.match(body, /repositorio es público/i);
  assert.match(page, /data-copy-email/);
  assert.match(page, /data-email-user="contact"/);
  assert.doesNotMatch(page, /mailto:/, 'the address stays split (MAIL-006)');
  const config = await read('astro.config.mjs');
  assert.match(config, /'\/recursos\/recomendacion\/'/);
});

test('TEST-007b: the dormant placeholder data is gone and the process is documented', async () => {
  const data = await read('src/data/testimonials.json');
  assert.doesNotMatch(data, /Cliente de Prueba|placeholder|40%/);
  await access(join(ROOT, 'docs/06-runbook/testimonials.md'));
  await access(join(ROOT, 'docs/06-runbook/review-intake.md'));
  assert.match(await read('docs/06-runbook/testimonials.md'), /\(review-intake\.md\)/);
  const adr = await read('docs/30-decisions/ADR-0008-curated-testimonials-collection.md');
  assert.match(adr, /^Status: Proposed$/m);
  const scale = await read('docs/30-decisions/ADR-0009-reviews-service-for-scale.md');
  assert.match(scale, /^Status: Proposed$/m, 'the reviews service is a proposal until the owner approves it');
  assert.match(scale, /the browser never calls the service at runtime/i);
});
