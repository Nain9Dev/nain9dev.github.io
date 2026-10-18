import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Contrast3D x NainDev partnership section. See specs/next-contrast3d-partnership-section.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const COMPONENT = 'src/components/home/PartnershipSection.astro';
const FORBIDDEN = /clientes? (en común|compartid)|proyectos? conjunt|joint (client|project)|shared client|testimon|casos? de éxito/i;

test('PART-001: the home page renders a partnership section with an H2 and the role split', async () => {
  const section = await read(COMPONENT);
  assert.match(section, /<section[^>]*id="partnership"/);
  assert.equal(section.match(/<h2[\s>]/g)?.length, 1);
  assert.match(section, /Contrast3D/);
  assert.match(section, /backend/i);
  assert.match(section, /validación determinista/);
  const home = await read('src/pages/index.astro');
  assert.match(home, /import PartnershipSection from '..\/components\/home\/PartnershipSection\.astro'/);
  assert.match(home, /<AboutSection \/>\s*<PartnershipSection \/>/);
});

test('PART-002: the section links to contrast3d.com safely', async () => {
  const section = await read(COMPONENT);
  const anchor = section.match(/<a\b[^>]*href="https:\/\/www\.contrast3d\.com\/"[^>]*>/)?.[0] ?? '';
  assert.ok(anchor, 'link to https://www.contrast3d.com/');
  assert.match(anchor, /target="_blank"/);
  assert.match(anchor, /rel="noopener noreferrer"/);
});

test('PART-003: no shared clients, joint projects or testimonials are claimed', async () => {
  const section = await read(COMPONENT);
  assert.doesNotMatch(section, FORBIDDEN);
  assert.doesNotMatch(section, /<img\b/i, 'no client logos');
});

test('PART-004: the structured data relates the person to Contrast3D without sameAs', async () => {
  const component = await read('src/components/SEO.astro');
  assert.match(component, /const contrast3dSchema = \{[\s\S]*?"@type": "Organization"[\s\S]*?"url": "https:\/\/www\.contrast3d\.com\/"/);
  const person = component.match(/const personSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  assert.match(person, /"affiliation": \{ "@id": contrast3dId \}/);
  const organization = component.match(/const organizationSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  assert.doesNotMatch(organization, /contrast3d\.com/);
  assert.match(component, /organizationSchema,\s+contrast3dSchema,\s+websiteSchema/);
});

test('PART-006: the new copy has English translations', async () => {
  const section = await read(COMPONENT);
  const translations = JSON.parse(await read('src/i18n/en-US.json'));
  const entries = Array.isArray(translations) ? translations : Object.values(translations).flat();
  const sources = new Set(entries.map((entry) => entry?.source).filter(Boolean));
  const heading = section.match(/<h2[^>]*>([^<]+)<\/h2>/)?.[1].trim();
  assert.ok(heading && sources.has(heading), `translation for heading "${heading}"`);
});
