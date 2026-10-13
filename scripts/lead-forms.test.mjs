// Guards for specs/025-remove-placeholder-forms.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return files.flat();
}

// The privacy policy wording about processors is an open owner decision (spec 025, out of scope).
const PRIVACY = join('src', 'pages', 'privacidad.astro');

test('LEAD-001: no MailerLite form, script, endpoint or CSP allowance remains', async () => {
  assert.equal(existsSync('src/scripts/lazy-mailerlite.js'), false);
  assert.equal(existsSync('src/scripts/checklist-form.js'), false);
  // src/content/marketing holds internal planning notes that are not part of any collection or page.
  const rendered = ['src/pages', 'src/components', 'src/layouts', 'src/scripts', 'src/content/blog', 'src/content/servicios'];
  const sources = (await Promise.all(rendered.map(walk))).flat()
    .filter((file) => /\.(astro|js|ts|mdx)$/.test(file) && file !== PRIVACY);
  for (const file of sources) {
    const text = await readFile(file, 'utf8');
    assert.doesNotMatch(text, /mailerlite|ml-block-form|ml-subscribe-form/i, file);
  }
  assert.doesNotMatch(await readFile('public/_headers', 'utf8'), /mailerlite/i);
});

test('LEAD-002 and LEAD-003: the checklist page asks by email, with the link excluded from obfuscation', async () => {
  const page = await readFile('src/pages/recursos/checklist-ia.astro', 'utf8');
  assert.doesNotMatch(page, /<form\b/);
  assert.match(page, /<!--email_off-->\s*<p[^>]*><a[^>]+href="mailto:contact@naindev\.com\?subject=[^"]+"[\s\S]*?<\/a><\/p>\s*<!--\/email_off-->/);
});
