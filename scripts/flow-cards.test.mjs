// Guards for specs/next-design-fusion DF-027: each service card on the home leads with a flow diagram instead of an
// icon; decorative, strokes only, drawn once, silent under reduced motion and on low-performance devices.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('DF-027: each of the three service cards leads with a decorative flow SVG made of strokes', async () => {
  const section = await read('src/components/home/ServicesSection.astro');
  const cards = section.match(/<article class="service-card"[\s\S]*?<\/article>/g) ?? [];
  assert.equal(cards.length, 3);
  for (const card of cards) {
    const svg = card.match(/<svg class="flow" viewBox="0 0 288 64" aria-hidden="true" focusable="false">[\s\S]*?<\/svg>/)?.[0];
    assert.ok(svg, 'a flow diagram');
    assert.ok(card.indexOf(svg) < card.indexOf('<h3>'), 'the diagram comes before the title');
    assert.doesNotMatch(svg, /<text|<image|style=|#[0-9a-fA-F]{3,6}\b|rgb\(|fill=|stroke=/, 'no text, raster or colour in the markup');
    for (const element of svg.match(/<(?:path|rect|circle|ellipse)\b[^>]*>/g)) assert.match(element, /pathLength="1"/);
    assert.match(svg, /class="ok"/, 'the result is marked');
  }
});

test('DF-027: the strokes use the primary colour, the result is green and the draw-in runs once without a loop', async () => {
  const css = await read('src/styles/main.css');
  const base = css.match(/\n\.flow \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(base, /fill: none;/);
  assert.match(base, /stroke: var\(--color-primary-strong\);/);
  assert.match(base, /stroke-linecap: round;/);
  assert.match(css, /\.flow \.ok \{\s*stroke: var\(--color-green\);/);
  const block = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*html:not\(\.low-performance\) \.flow > \*[\s\S]*?\n\}/)?.[0];
  assert.ok(block, 'the draw-in lives in a no-preference block and skips low-performance devices');
  assert.match(block, /stroke-dasharray: 1;/);
  assert.match(block, /animation: flow-draw [^;]*backwards;/);
  assert.doesNotMatch(block, /infinite/);
});
