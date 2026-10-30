// Guards for specs/next-design-fusion, layer 2 (DF-004 to DF-007): the site mark is the designer's isotype,
// drawn as an inline SVG, and the icons are rendered from the same geometry.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

// The three round-capped strokes of the isotype, in a 1000 box, as delivered in the designer's favicons.
const STROKES = 'M148 148V848M308 288L686 738M848 148V848';
const STROKE_WIDTH = '113';

test('DF-004: the header brand is the isotype as inline SVG coloured by --color-logo, with a text name', async () => {
  const header = await read('src/components/Header.astro');
  const brand = header.match(/<a class="brand"[\s\S]*?<\/a>/)?.[0] ?? '';
  assert.match(brand, /aria-label="NainDev, volver al inicio"/, 'the link keeps its accessible name and target');
  assert.match(brand, /href="\/#top"/);
  assert.match(brand, new RegExp(`<svg class="brand-mark"[^>]*aria-hidden="true"[^>]*>\\s*<path d="${STROKES}"`), 'the isotype strokes');
  assert.match(brand, /<svg class="brand-wordmark" viewBox="0 0 423 38" aria-hidden="true" focusable="false">/, 'the wordmark is an inline vector, hidden from assistive tech because the link has its own name');
  assert.doesNotMatch(brand, /<text|<image|brand-name/, 'no text node and no raster in the lockup');
  assert.doesNotMatch(header, /<Image|logo_horizontal/, 'no raster logo in the header');
  const css = await read('src/styles/main.css');
  const mark = css.match(/\.brand-mark \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(mark, /stroke: var\(--color-logo\);/);
  assert.match(mark, new RegExp(`stroke-width: ${STROKE_WIDTH};`));
  assert.match(mark, /stroke-linecap: round;/);
  assert.match(mark, /fill: none;/);
  const wordmark = css.match(/\.brand-wordmark \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(wordmark, /color: var\(--color-logo\);/, 'the wordmark follows the theme like the isotype');
  assert.match(wordmark, /height: [^;]+;/);
  assert.match(css, /@media \(max-width: 48rem\) \{[^@]*\.brand-wordmark \{\s*display: none;/, 'phones show the isotype alone');
});

test('DF-005: the wordmark is published only as a vector and draws the kit geometry; the old raster logo is gone', async () => {
  assert.equal(existsSync(join(ROOT, 'src/assets/images/logo_horizontal.png')), false, 'the old 1600 px logo is removed');
  const kit = await read('design/brand/wordmark-green.svg');
  const paths = [...kit.matchAll(/ d="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(paths.length >= 4);
  // The header and the footer (DF-021) draw the wordmark; both use the kit geometry in the current colour.
  for (const [file, svgClass] of [['src/components/Header.astro', 'brand-wordmark'], ['src/components/Footer.astro', 'footer-wordmark']]) {
    const wordmark = (await read(file)).match(new RegExp(`<svg class="${svgClass}"[\\s\\S]*?</svg>`))?.[0] ?? '';
    for (const d of paths) assert.ok(wordmark.includes(` d="${d}"`), `${file} draws the same path as design/brand/wordmark-green.svg`);
    assert.match(wordmark, /fill="currentColor"/);
    assert.match(wordmark, /stroke="currentColor"/);
  }
  assert.doesNotMatch(await read('src/layouts/BaseLayout.astro'), /wordmark|logo_horizontal/i, 'the layout');
});

test('DF-006: the SVG mark and the icons use the designer geometry on the deep blue tile', async () => {
  const svg = await read('public/assets/images/favicon-optimized.svg');
  assert.ok(svg.includes(STROKES), 'the favicon draws the isotype strokes');
  assert.match(svg, new RegExp(`stroke-width="${STROKE_WIDTH}"`));
  assert.match(svg, /stroke-linecap="round"/);
  assert.match(svg, /fill="#002B66"/i, 'the tile is the deep blue');
  assert.match(svg, /stroke="#80FF00"/i, 'the mark is the brand green');
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.match(layout, /rel="icon" type="image\/png" sizes="96x96" href="\/favicon-96x96\.png"/);
  assert.match(layout, /rel="apple-touch-icon" sizes="180x180" href="\/apple-touch-icon\.png"/);
});

test('DF-007: the default social image shows the new isotype in white, not the old cyan and cobalt logo', async () => {
  const { data, info } = await sharp(join(ROOT, 'public/assets/images/og-cover-v5.jpg')).raw().toBuffer({ resolveWithObject: true });
  const at = (x, y) => [0, 1, 2].map((offset) => data[(y * info.width + x) * info.channels + offset]);
  let oldLogo = 0;
  for (let y = 500; y < info.height; y += 1) {
    for (let x = 40; x < 260; x += 1) {
      const [r, , b] = at(x, y);
      if (r < 60 && b > 150) oldLogo += 1;
    }
  }
  assert.equal(oldLogo, 0, 'no cyan or cobalt pixels of the old logo remain at the bottom left');
  let mark = 0;
  for (let y = 535; y < 568; y += 1) {
    for (let x = 72; x < 108; x += 1) {
      if (at(x, y).every((value) => value > 225)) mark += 1;
    }
  }
  assert.ok(mark >= 150, `the white isotype is drawn at the old logo position (${mark} white pixels)`);
});

test('DF-007: the Organization logo URL still points at the touch icon, so it shows the new mark', async () => {
  const seo = await read('src/components/SEO.astro');
  assert.match(seo, /"logo": new URL\('\/apple-touch-icon\.png', siteURL\)\.toString\(\)/);
  assert.ok((await readFile(join(ROOT, 'public/apple-touch-icon.png'))).length > 0);
});
