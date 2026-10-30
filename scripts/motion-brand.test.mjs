// Guards for two of the designer's motions (owner decision of 2026-10-30, specs/next-design-fusion DF-022): the
// header mark draws itself once, and section titles are uncovered by a mask once, as they come into view. Both run only
// without a reduced-motion preference and not on low-performance devices, never loop and hide nothing at rest.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('DF-022: the header mark is three strokes that can be drawn one after another', async () => {
  const header = await read('src/components/Header.astro');
  const mark = header.match(/<svg class="brand-mark"[\s\S]*?<\/svg>/)?.[0] ?? '';
  const strokes = [...mark.matchAll(/<path class="mk" pathLength="1" style="--i:(\d)" d="([^"]+)" \/>/g)];
  assert.deepEqual(strokes.map((match) => match[2]), ['M148 148V848', 'M308 288L686 738', 'M848 148V848'], 'the designer geometry, split in three');
  assert.deepEqual(strokes.map((match) => match[1]), ['0', '1', '2']);
});

test('DF-022: the mark is drawn once, never in a loop, only without a reduced-motion preference', async () => {
  const css = await read('src/styles/main.css');
  const block = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*html:not\(\.low-performance\) \.brand-mark \.mk[\s\S]*?\n\}/)?.[0];
  assert.ok(block, 'the draw-in lives in a no-preference block and skips low-performance devices');
  assert.match(block, /stroke-dasharray: 1;/);
  assert.match(block, /animation: mark-draw [^;]*backwards;/);
  assert.doesNotMatch(block, /infinite/);
  const keyframes = css.match(/@keyframes mark-draw \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(keyframes, /from/);
  assert.doesNotMatch(keyframes, /\bto\b|opacity/, 'only a "from" frame, nothing hidden at rest');
});

test('DF-022: section titles are uncovered by a mask once, only after the script marked the page', async () => {
  const css = await read('src/styles/main.css');
  const hidden = css.match(/\.motion-ready \.section-heading\[data-reveal\] h2 \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(hidden, /clip-path: inset\(/, 'the title starts masked');
  assert.match(hidden, /transform: translateY\(/);
  assert.match(hidden, /transition: clip-path [^;]*, transform [^;]*;/);
  const shown = css.match(/\.motion-ready \.section-heading\[data-reveal\]\.is-visible h2 \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(shown, /clip-path: inset\(/);
  assert.match(shown, /transform: none;/);
  // Reduced motion and low-performance devices see every title at rest, like every other reveal (PERF-014).
  assert.match(css, /prefers-reduced-motion: reduce\) \{[\s\S]*?\.motion-ready \.section-heading\[data-reveal\] h2 \{\s*clip-path: none;\s*transform: none;/);
  assert.match(css, /html\.low-performance \.motion-ready \.section-heading\[data-reveal\] h2 \{\s*clip-path: none !important;/);
});
