// Guards for specs/next-design-fusion, the designer's agenda diagram on /servicios/ (DF-017): decorative, built from
// strokes in the stroke colour, drawn once, never looping, and silent for reduced motion and low-performance devices.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('DF-017: the diagram is a decorative inline SVG of round-capped strokes in the designer geometry', async () => {
  const svg = await read('src/components/ServicesDiagram.astro');
  assert.match(svg, /<svg class="services-diagram-svg" viewBox="0 0 1000 700" aria-hidden="true" focusable="false">/);
  assert.match(svg, /stroke="currentColor" stroke-width="45" stroke-linecap="round" stroke-linejoin="round"/);
  // The frame (two arcs on top, two below), the rings, five days, the tick and the header line of the agenda.
  for (const d of ['M240 300V228A28 28 0 0 1 268 200H500', 'M760 300V572A28 28 0 0 1 732 600H500', 'M626 508L650 532L694 482']) {
    assert.ok(svg.includes(`d="${d}"`), d);
  }
  assert.equal((svg.match(/class="sd"/g) ?? []).length, 13, 'thirteen strokes');
  assert.doesNotMatch(svg, /<text|<image|#[0-9a-fA-F]{3,6}\b|rgb\(|style="[^"]*(color|fill|stroke):/, 'no text, raster or colour literal');
});

test('DF-017: /servicios/ shows the diagram once, after the heading, and phones skip it', async () => {
  const page = await read('src/pages/servicios/index.astro');
  assert.match(page, /import ServicesDiagram from '\.\.\/\.\.\/components\/ServicesDiagram\.astro';/);
  assert.equal((page.match(/<ServicesDiagram \/>/g) ?? []).length, 1);
  assert.ok(page.indexOf('<ServicesDiagram />') > page.indexOf('class="section-heading"'));
  assert.ok(page.indexOf('<ServicesDiagram />') < page.indexOf('service-group'));
  const css = await read('src/styles/inner-pages.css');
  assert.match(css, /@media \(max-width: 40rem\) \{[^@]*\.services-diagram \{\s*display: none;/);
});

test('DF-017: the strokes are drawn once, never in a loop, only without a reduced-motion preference', async () => {
  const css = await read('src/styles/inner-pages.css');
  const block = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*html:not\(\.low-performance\) \.services-diagram \.sd[\s\S]*?\n\}/)?.[0];
  assert.ok(block, 'the draw-in lives in a no-preference block and skips low-performance devices');
  assert.match(block, /stroke-dasharray: 1;/);
  assert.match(block, /animation: services-draw [^;]*backwards;/, 'fill mode backwards: the end state is the plain drawing');
  assert.doesNotMatch(block, /infinite/, 'no loop');
  const keyframes = css.match(/@keyframes services-draw \{([\s\S]*?)\n\s*\}\n/)?.[1] ?? '';
  assert.match(keyframes, /from/);
  assert.doesNotMatch(keyframes, /\bto\b|opacity/, 'only a "from" frame, nothing hidden at rest');
  assert.match(css, /\.services-diagram \{[^}]*color: var\(--color-stroke\);/);
});

test('DF-017: the built page carries the diagram and it adds no script', { skip: !existsSync(join(ROOT, 'dist/servicios/index.html')) }, async () => {
  const page = await read('dist/servicios/index.html');
  assert.equal((page.match(/class="services-diagram-svg"/g) ?? []).length, 1);
  assert.equal((await read('dist/en/services/index.html')).includes('services-diagram-svg'), true, 'and in English');
});
