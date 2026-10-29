// Guards for the brand kit in design/brand/ (specs/next-design-fusion, T07c): the designer's files are kept as
// delivered, the vector wordmark exists in the three brand colours, and nothing in the kit is published.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const KIT = join(ROOT, 'design/brand');

const DELIVERED = [
  'aitor-linkedin-banner2x.png',
  'favicon-deep.svg',
  'favicon-paper.svg',
  'full-black.png',
  'full-white.png',
  'solid-black.png',
  'solid-blue.png',
  'solid-white.png',
  'wordmark-blue.png',
  'wordmark-green.png',
  'wordmark-white.png',
];

test('BRAND-001: every file the designer delivered is kept unmodified under design/brand/source/', async () => {
  for (const file of DELIVERED) {
    assert.ok(existsSync(join(KIT, 'source', file)), `${file} is in the kit`);
  }
  const banner = await sharp(join(KIT, 'source/aitor-linkedin-banner2x.png')).metadata();
  assert.deepEqual([banner.width, banner.height], [3168, 792], 'the LinkedIn banner keeps its delivered size');
  const demos = (await readdir(join(KIT, 'demos'))).filter((file) => file.endsWith('.gif'));
  assert.equal(demos.length, 4, 'the four demo GIFs are kept as source material');
});

test('BRAND-002: the vector wordmark exists in green, blue and white and matches the delivered raster', async () => {
  const colours = { green: '#80FF00', blue: '#0047AB', white: '#FFFFFF' };
  for (const [name, colour] of Object.entries(colours)) {
    const svg = await readFile(join(KIT, `wordmark-${name}.svg`), 'utf8');
    assert.match(svg, /viewBox="0 0 423 38"/, `${name}: same box as the delivered 423 x 38 raster`);
    assert.match(svg, /aria-label="NainDev"/, `${name}: accessible name`);
    assert.ok(svg.includes(`fill="${colour}"`) && svg.includes(`stroke="${colour}"`), `${name}: one brand colour`);
    assert.doesNotMatch(svg, /<image|<text|font-family/i, `${name}: pure geometry, no raster and no font`);
    const reference = await sharp(join(KIT, `source/wordmark-${name}.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const drawn = await sharp(Buffer.from(svg)).resize(reference.info.width, reference.info.height).ensureAlpha().raw().toBuffer();
    let inside = 0;
    let union = 0;
    for (let pixel = 0; pixel < reference.info.width * reference.info.height; pixel += 1) {
      const a = reference.data[pixel * 4 + 3] > 127;
      const b = drawn[pixel * 4 + 3] > 127;
      if (a && b) inside += 1;
      if (a || b) union += 1;
    }
    assert.ok(inside / union > 0.9, `${name}: overlap with the delivered raster is ${(inside / union).toFixed(3)}`);
  }
});

test('BRAND-003: the kit is documented and is not part of the published site', async () => {
  const readme = await readFile(join(KIT, 'README.md'), 'utf8');
  for (const heading of ['## Contents', '## Colours', '## Rules', '## Wordmark']) {
    assert.ok(readme.includes(heading), `README has ${heading}`);
  }
  for (const file of [...DELIVERED, 'wordmark-green.svg']) {
    assert.ok(readme.includes(file), `README lists ${file}`);
  }
  const published = await readdir(join(ROOT, 'public/assets/images'));
  assert.ok(!published.some((file) => /^wordmark|^solid-|^full-|^demo-/.test(file)), 'no kit file is copied into public/');
});
