// Source-level guards for specs/020-low-end-device-performance.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const read = (path) => readFile(path, 'utf8');

async function walk(dir) {
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  }));
  return files.flat();
}

function keyframeProperties(css, name) {
  const start = css.indexOf(`@keyframes ${name}`);
  assert.notEqual(start, -1, `missing @keyframes ${name}`);
  let depth = 0;
  let end = start;
  for (let i = css.indexOf('{', start); i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}' && --depth === 0) { end = i; break; }
  }
  const body = css.slice(start, end);
  return [...body.matchAll(/([a-z-]+)\s*:/g)].map((match) => match[1]);
}

test('PERF-001: one variable font file and one @font-face rule per family', async () => {
  const fonts = (await walk('src/assets/fonts')).filter((file) => file.endsWith('.woff2'));
  assert.equal(fonts.length, 2, `expected two font files, found ${fonts.join(', ')}`);
  const hashes = await Promise.all(fonts.map(async (file) =>
    createHash('sha256').update(await readFile(file)).digest('hex')));
  assert.equal(new Set(hashes).size, hashes.length, 'font files must not be byte-identical');
  assert.equal((await walk('public/assets/fonts')).length, 0, 'public/assets/fonts must be empty');

  const css = await read('src/styles/main.css');
  const allFaces = [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((match) => match[1]);
  // A metrics-matched local() fallback face (spec 045) loads no file, so only url() faces count here.
  const faces = allFaces.filter((face) => face.includes('url('));
  assert.equal(faces.length, 2);
  for (const face of allFaces.filter((face) => !faces.includes(face))) assert.match(face, /src:\s*local\(/);
  for (const face of faces) {
    assert.match(face, /font-weight:\s*300 800/);
    assert.equal((face.match(/url\(/g) ?? []).length, 1);
  }
});

test('PERF-002: preloaded fonts come from the bundled font files', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  const preloads = [...layout.matchAll(/<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g)].map((m) => m[0]);
  assert.ok(preloads.length >= 1);
  for (const link of preloads) assert.match(link, /href=\{\w+\}/, `preload must use an imported URL: ${link}`);
  assert.match(layout, /from '\.\.\/assets\/fonts\/[\w-]+\.woff2\?url'/);
});

test('PERF-003: client scripts are bundled from src/scripts without manual versioning', async () => {
  const unbundled = (await walk('public/assets/js')).filter((f) => !/ecosystem-bar(-panel)?\.js$/.test(f));
  assert.equal(unbundled.length, 0, 'public/assets/js must contain only standalone ecosystem distribution scripts');
  const sources = (await walk('src'))
    .filter((file) => /\.(astro|js|ts|mjs|mdx)$/.test(file));
  for (const file of sources) {
    const text = await read(file);
    assert.doesNotMatch(text, /\?v=\d/, `${file} uses a manual ?v= cache buster`);
    assert.doesNotMatch(text, /\/assets\/js\//, `${file} references an unbundled script`);
    assert.doesNotMatch(text, /<script[^>]*is:inline[^>]*type="module"/, `${file} has an unbundled module script`);
  }
});

test('PERF-004: no stylesheet is served unbundled', async () => {
  assert.equal((await walk('public/assets/css')).length, 0, 'public/assets/css must be empty');
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.doesNotMatch(layout, /href="\/assets\/css\//);
  assert.match(layout, /import '\.\.\/styles\/main\.css'/);
});

test('PERF-005: the document head never creates a WebGL context', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  const head = layout.slice(layout.indexOf('<head>'), layout.indexOf('</head>'));
  assert.doesNotMatch(head, /getContext|['"](experimental-)?webgl2?['"]/i);
});

test('PERF-006: hero content does not wait for a script-driven reveal', async () => {
  const hero = await read('src/components/home/Hero.astro');
  assert.doesNotMatch(hero, /data-reveal/);
});

test('PERF-007: infinite animations use compositor-only properties and stop in low-performance mode', async () => {
  const styles = (await walk('src/styles')).filter((file) => file.endsWith('.css'));
  for (const file of styles) {
    const css = await read(file);
    for (const match of css.matchAll(/animation:\s*([\w-]+)[^;]*infinite/g)) {
      const properties = keyframeProperties(css, match[1]);
      for (const property of properties) {
        assert.ok(['transform', 'opacity'].includes(property), `${match[1]} animates ${property}`);
      }
    }
  }
  const main = await read('src/styles/main.css');
  assert.match(main, /html\.low-performance \.availability::after\s*\{[^}]*animation:\s*none/);
});

test('PERF-018: no SVG favicon is declared, while the file and raster icons stay', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.doesNotMatch(layout, /rel="icon"[^>]*image\/svg\+xml/);
  assert.match(layout, /rel="icon" type="image\/png" sizes="96x96"/);
  assert.match(layout, /rel="icon" type="image\/x-icon"/);
  assert.ok(existsSync('public/assets/images/favicon-optimized.svg'), 'the SVG mark keeps its stable URL (SEO-002)');
});

test('PERF-008: off-screen home sections can skip rendering', async () => {
  const main = await read('src/styles/main.css');
  const rule = main.match(/main > \.section:not\(\.hero\)[^{]*\{([^}]*)\}/);
  assert.ok(rule, 'missing content-visibility rule for home sections');
  assert.match(rule[1], /content-visibility:\s*auto/);
  assert.match(rule[1], /contain-intrinsic-size:\s*auto \d+px/);
});
