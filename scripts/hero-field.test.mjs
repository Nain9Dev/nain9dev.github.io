// Guards for specs/next-hero-field (HERO-005 to HERO-009): the 2D stroke field replaces the WebGL scene.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const read = (file) => readFile(file, 'utf8');

test('HERO-005: the field is a deterministic grid of staggered cells whose density grows toward the right', async () => {
  const { fieldCells, strokeDensity, strokeOpacity, opacityBucket, hash } = await import('../src/scripts/hero-field.js');
  const cells = fieldCells(1200, 600, 26);
  assert.ok(cells.length > 800 && cells.length < 1600, `cell count ${cells.length}`);
  assert.deepEqual(fieldCells(1200, 600, 26).slice(0, 5), cells.slice(0, 5), 'same cells on every call');
  const row = (j) => cells.filter((cell) => cell.y === j * 26);
  assert.equal(row(1)[0].x - row(0)[0].x, 13, 'odd rows are shifted by half a step');
  for (const cell of cells.slice(0, 200)) assert.ok(cell.h >= 0 && cell.h < 1 && cell.h === hash(Math.round((cell.x - (cell.y / 26 % 2 ? 13 : 0)) / 26), cell.y / 26));
  assert.equal(strokeDensity(0, 1200), 0, 'nothing at the left edge');
  assert.equal(strokeDensity(1200 * 0.55, 1200), 0, 'nothing in the text column (it ends at 55% of the width)');
  assert.ok(strokeDensity(900, 1200) > strokeDensity(600, 1200), 'denser to the right');
  assert.equal(strokeDensity(1200, 1200), 1, 'full at the right edge');
  assert.ok(strokeOpacity(0) >= 0.26 && Math.abs(strokeOpacity(1) - 1) < 1e-9);
  assert.equal(opacityBucket(1), 10);
  assert.equal(opacityBucket(0.26), 3);
});

test('HERO-005: colours come from the theme tokens and parse from hex or rgb', async () => {
  const { parseColor } = await import('../src/scripts/hero-field.js');
  assert.deepEqual(parseColor('#80ff00'), [128, 255, 0]);
  assert.deepEqual(parseColor(' #0047AB '), [0, 71, 171]);
  assert.deepEqual(parseColor('rgb(1, 2, 3)'), [1, 2, 3]);
  const source = await read('src/scripts/hero-field.js');
  assert.match(source, /getPropertyValue\('--color-stroke'\)/);
  assert.match(source, /getPropertyValue\('--color-red'\)/);
});

test('HERO-006: it runs only when it can be seen, breathes at about 20 fps and degrades on slow frames', async () => {
  const source = await read('src/scripts/hero-field.js');
  assert.match(source, /new IntersectionObserver/);
  assert.match(source, /visibilitychange/);
  assert.match(source, /% 3/, 'one frame in three while nothing touches the field');
  assert.match(source, /classList\.add\('low-performance'\)/, 'slow frames fall back to the static hero');
  assert.match(source, /export function cleanupHeroField/);
  assert.doesNotMatch(source, /setInterval/);
});

test('HERO-007: a fine pointer pushes the strokes and a press sends at most four red ripples', async () => {
  const source = await read('src/scripts/hero-field.js');
  assert.match(source, /\(pointer: fine\)/);
  assert.match(source, /pointermove/);
  assert.match(source, /pointerdown/);
  assert.match(source, /ripples\.length < 4/);
  assert.match(source, /pointerleave/);
});

test('HERO-008: no WebGL and no library, a 2D canvas loaded lazily, and the chunk stays small', async () => {
  assert.equal(existsSync('src/scripts/hero-scene.js'), false, 'the WebGL scene is gone');
  assert.equal(existsSync('src/vendor/three.module.min.js'), false);
  const source = await read('src/scripts/hero-field.js');
  assert.match(source, /getContext\('2d'/);
  assert.doesNotMatch(source, /webgl|three\.module|from ['"]three['"]|THREE\./i);
  const app = await read('src/scripts/app.js');
  assert.match(app, /document\.getElementById\('hero-field'\)/);
  assert.match(app, /import\("\.\/hero-field\.js"\)/);
  assert.doesNotMatch(app, /hero-scene|hero-3d-canvas/);
  const hero = await read('src/components/home/Hero.astro');
  assert.match(hero, /<canvas id="hero-field" class="hero-field canvas-placeholder" aria-hidden="true"><\/canvas>/);
  if (existsSync('dist/_astro')) {
    const files = await readdir('dist/_astro');
    assert.ok(!files.some((f) => f.startsWith('three') || f.startsWith('hero-scene')), 'no WebGL scene chunk is published');
    const chunk = files.find((f) => f.startsWith('hero-field.') && f.endsWith('.js'));
    assert.ok(chunk, 'hero-field chunk missing from the build');
    assert.ok((await stat(join('dist/_astro', chunk))).size <= 8 * 1024, 'hero-field chunk over 8 KiB');
  }
});

test('HERO-009: the field follows the theme, never covers the text column or the receipts, and fades in', async () => {
  const source = await read('src/scripts/hero-field.js');
  assert.match(source, /MutationObserver/, 'repaint when the theme attribute changes');
  assert.match(source, /prefers-color-scheme/, 'repaint when the system theme changes');
  const css = await read('src/styles/main.css');
  const block = css.match(/\n\.hero-field \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(block, /position: absolute;/);
  assert.match(block, /pointer-events: none;/);
  assert.match(block, /mask-image: linear-gradient\(to bottom, black [^)]*transparent [^)]*\)/, 'it fades out above the receipts band');
  assert.match(css, /\.hero-field\.canvas-placeholder \{\s*opacity: 0;/);
  assert.match(css, /html\.low-performance \.hero-field \{\s*display: none !important;/);
});
