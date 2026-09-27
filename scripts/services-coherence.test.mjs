import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

// Service copy aligned with the profile. See specs/014-services-coherence.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

async function sources() {
  const files = [];
  for (const dir of ['src/components', 'src/pages', 'src/content']) {
    for (const entry of await readdir(join(ROOT, dir), { withFileTypes: true, recursive: true })) {
      if (entry.isFile() && /\.(astro|mdx?)$/.test(entry.name)) files.push(relative(ROOT, join(entry.parentPath, entry.name)));
    }
  }
  return files;
}

async function cards() {
  const html = await read('src/components/home/ServicesSection.astro');
  return [...html.matchAll(/<article class="service-card"[\s\S]*?<\/article>/g)].map((match) => text(match[0]));
}

test('COPY-015: the first service card describes multi-domain conformance', async () => {
  const [first] = await cards();
  assert.match(first, /conformidad determinista/i);
  assert.match(first, /primer dominio/i);
  assert.match(first, /glTF\/GLB/);
  assert.doesNotMatch(first, /USD|tiempo real/i);
});

test('COPY-016: the critical backend card names Python and .NET', async () => {
  const third = (await cards())[2];
  for (const name of ['Python', '.NET', 'PostgreSQL', 'SQL Server']) assert.ok(third.includes(name), name);
});

test('COPY-017: no source claims industrial scale', async () => {
  const offenders = [];
  for (const file of await sources()) if (/escala industrial/i.test(await read(file))) offenders.push(file);
  assert.deepEqual(offenders, []);
});

test('COPY-018: the 3D validation service claims no USD or real-time conversion', async () => {
  const page = await read('src/content/servicios/validacion-3d.mdx');
  assert.doesNotMatch(page, /\bUSD\b|tiempo real/i);
});
