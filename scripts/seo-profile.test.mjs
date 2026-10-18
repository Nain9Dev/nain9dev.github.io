import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Search metadata aligned with the profile. See specs/013-seo-profile-alignment.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const OLD_POSITIONING = /Arquitectura Backend,? 3D e IA/;
const JOB_TITLE = 'Arquitecto de Software Full Stack';

test('SEO-011: the home title and description follow the current profile', async () => {
  const seo = await read('src/utils/seo.ts');
  assert.ok(seo.includes(`title: 'NainDev | Aitor Nain · ${JOB_TITLE}'`));
  const description = seo.match(/description: '([^']+)'/)[1];
  assert.match(description, /conformidad determinista/);
  assert.match(description, /Python/);
  assert.match(description, /\.NET/);
  assert.doesNotMatch(seo, OLD_POSITIONING);
});

test('SEO-012: the Person structured data carries the current job title', async () => {
  const component = await read('src/components/SEO.astro');
  assert.ok(component.includes(`"jobTitle": "${JOB_TITLE}"`));
});

test('SEO-014: NainDev is an Organization with its own identity and profile links', async () => {
  const component = await read('src/components/SEO.astro');
  const block = component.match(/const organizationSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  assert.match(block, /"@type": "Organization"/);
  assert.match(block, /"@id": organizationId/);
  assert.match(block, /"name": "NainDev"/);
  assert.match(block, /"logo": new URL\('\/apple-touch-icon\.png', siteURL\)\.toString\(\)/);
  for (const url of [
    'https://www.linkedin.com/company/146215151/',
    'https://github.com/Nain9Dev',
    'https://gitlab.com/aitornainmendozavallejo',
    'https://x.com/Nain9Dev'
  ]) assert.ok(block.includes(`"${url}"`), url);
  assert.ok(await readFile(join(ROOT, 'public/apple-touch-icon.png')).then(file => file.length > 0));
});

test('SEO-015: the person keeps only personal profiles and founds the organization', async () => {
  const component = await read('src/components/SEO.astro');
  const person = component.match(/const personSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  const organization = component.match(/const organizationSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  assert.doesNotMatch(person, /linkedin\.com\/company\//);
  assert.ok(person.includes('"https://gitlab.com/aitornainmendozavallejo"'));
  assert.ok(person.includes('"https://www.linkedin.com/in/aitor-nain-mendoza-vallejo/"'));
  assert.match(organization, /"founder": \{ "@id": personId \}/);
});

test('SEO-016: the website and articles are published by the organization', async () => {
  const component = await read('src/components/SEO.astro');
  const website = component.match(/const websiteSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  const article = component.match(/const articleSchema = [\s\S]*?\n\} : undefined;/)?.[0] ?? '';
  assert.match(website, /"publisher": \{ "@id": organizationId \}/);
  assert.match(article, /"publisher": \{ "@id": organizationId \}/);
  assert.match(component, /personSchema,\s+organizationSchema,\s+contrast3dSchema,\s+websiteSchema/);
});

const BRAND_CHANNELS = [
  'https://www.youtube.com/@Nain9Dev',
  'https://www.instagram.com/nainndev/',
  'https://www.tiktok.com/@nain9dev'
];

test('SEO-018: the Organization lists the brand YouTube, Instagram and TikTok profiles', async () => {
  const component = await read('src/components/SEO.astro');
  const organization = component.match(/const organizationSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  for (const url of BRAND_CHANNELS) assert.ok(organization.includes(`"${url}"`), url);
  assert.equal(organization.match(/"https:\/\/github\.com\/Nain9Dev"/g)?.length, 1);
  assert.equal(organization.match(/"https:\/\/x\.com\/Nain9Dev"/g)?.length, 1);
});

test('SEO-019: the Person does not list the brand-only channels', async () => {
  const component = await read('src/components/SEO.astro');
  const person = component.match(/const personSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  for (const url of BRAND_CHANNELS) assert.ok(!person.includes(url), url);
});

const LISTING_AND_THREADS = [
  'https://share.google/1tIQO3tlW8K8qVZ9R',
  'https://www.threads.com/@nainndev'
];

test('SEO-020: the Organization lists the Google Business Profile and Threads', async () => {
  const component = await read('src/components/SEO.astro');
  const organization = component.match(/const organizationSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  for (const url of LISTING_AND_THREADS) assert.ok(organization.includes(`"${url}"`), url);
  assert.doesNotMatch(organization, /g\.page\/r\//, 'the review link is not a profile link');
});

test('SEO-021: the Person does not list the Google Business Profile or Threads', async () => {
  const component = await read('src/components/SEO.astro');
  const person = component.match(/const personSchema = \{([\s\S]*?)\n\};/)?.[1] ?? '';
  for (const url of LISTING_AND_THREADS) assert.ok(!person.includes(url), url);
});

test('SEO-013: the blog and service hubs drop the old positioning', async () => {
  for (const file of ['src/pages/blog/index.astro', 'src/pages/servicios/index.astro']) {
    const page = await read(file);
    assert.doesNotMatch(page, OLD_POSITIONING, file);
    assert.match(page, /\| NainDev"/, file);
  }
});
