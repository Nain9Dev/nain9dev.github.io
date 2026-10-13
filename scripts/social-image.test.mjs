// Guards for specs/026-social-image-weight.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const IMAGE = '/assets/images/og-cover-v3.jpg';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}

test('SOC-001: the default social image is a light 1200x630 JPEG with matching declared size', async () => {
  const seo = await readFile('src/utils/seo.ts', 'utf8');
  assert.match(seo, new RegExp(`image: '${IMAGE.replaceAll('.', '\\.')}'`));
  const file = join('public', IMAGE);
  const { width, height, format } = await sharp(file).metadata();
  assert.deepEqual([width, height, format], [1200, 630, 'jpeg']);
  assert.ok((await stat(file)).size <= 200 * 1024, 'social image must be at most 200 KB');
  const component = await readFile('src/components/SEO.astro', 'utf8');
  assert.match(component, /og:image:width" content="1200"/);
  assert.match(component, /og:image:height" content="630"/);
});

test('SOC-002: no source references or publishes the old PNG', async () => {
  assert.equal(existsSync('public/assets/images/og-cover-v2.png'), false);
  for (const file of [...await walk('src'), 'docs/21-data-model.md']) {
    if (!/\.(astro|ts|js|mdx|md|json)$/.test(file)) continue;
    assert.doesNotMatch(await readFile(file, 'utf8'), /og-cover-v2\.png/, file);
  }
});
