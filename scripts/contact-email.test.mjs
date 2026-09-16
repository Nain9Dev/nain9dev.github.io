import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

// Single public contact address. See specs/008-unify-contact-email.
const RETIRED_ADDRESSES = /\b(hola|hello)@naindev\.com\b/i;
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIRS = ['src/components', 'src/pages', 'src/content', 'public/assets/data'];

test('sources and runtime data publish no retired contact address', async () => {
  const offenders = [];
  for (const dir of DIRS) {
    for (const entry of await readdir(join(ROOT, dir), { withFileTypes: true, recursive: true })) {
      if (!entry.isFile() || !/\.(astro|mdx?|json|html)$/.test(entry.name)) continue;
      const file = relative(ROOT, join(entry.parentPath, entry.name)).replaceAll('\\', '/');
      if (file.startsWith('src/content/marketing/')) continue;
      if (RETIRED_ADDRESSES.test(await readFile(join(ROOT, file), 'utf8'))) offenders.push(file);
    }
  }
  assert.deepEqual(offenders, []);
});

test('privacy policy names the public contact address', async () => {
  const markup = await readFile(join(ROOT, 'src/pages/privacidad.astro'), 'utf8');
  assert.equal(markup.match(/contact@naindev\.com/g)?.length, 2);
});
