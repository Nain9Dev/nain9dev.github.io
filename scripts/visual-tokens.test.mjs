// Guards for specs/045-visual-polish PR 1: every style value comes from the token block (VP-001),
// the type scale keeps its hierarchy at every width (VP-002) and transitions name their properties.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const STYLESHEETS = ['src/styles/main.css', 'src/styles/terminal.css', 'src/styles/locales.css'];

function tokenBlock(css) {
  const start = css.indexOf(':root {');
  assert.ok(start >= 0, 'main.css declares a :root token block');
  const end = css.indexOf('\n}\n', start);
  return { block: css.slice(start, end), rest: css.slice(0, start) + css.slice(end) };
}

// Evaluates clamp(A rem, B rem + C vw, D rem) at a viewport width, in px (16 px root).
function clampAt(expression, viewport) {
  const match = expression.match(/clamp\(\s*([\d.]+)rem,\s*([\d.]+)rem \+ ([\d.]+)vw,\s*([\d.]+)rem\s*\)/);
  assert.ok(match, `fluid clamp with a viewport term: ${expression}`);
  const [, min, base, vw, max] = match.map(Number);
  return Math.min(Math.max(min * 16, base * 16 + (vw / 100) * viewport), max * 16);
}

test('VP-001: colour literals live only in the token block', async () => {
  const main = await read('src/styles/main.css');
  const { block, rest } = tokenBlock(main);
  assert.match(block, /--color-cobalt: #0047ab/);
  assert.match(block, /--color-green: #80ff00/);
  assert.match(block, /--color-red: #ff001f/);
  assert.match(block, /--color-ink: #edf1f6/);
  assert.match(block, /--radius: 4px/);
  assert.match(block, /--ease-standard: cubic-bezier/);
  const literal = /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/gi;
  assert.deepEqual(rest.match(literal) ?? [], [], 'main.css keeps colour literals inside :root');
  for (const file of STYLESHEETS.slice(1)) {
    const css = await read(file);
    assert.deepEqual(css.match(literal) ?? [], [], `${file} reads colours from the tokens`);
  }
});

test('VP-001: no stylesheet transitions "all" and the display font is Urbanist with a local fallback', async () => {
  for (const file of STYLESHEETS) {
    const css = await read(file);
    assert.doesNotMatch(css, /transition:\s*all\b/, `${file} names the transitioned properties`);
  }
  const main = await read('src/styles/main.css');
  assert.match(main, /font-family: 'Urbanist';[\s\S]*?src: url\(\.\.\/assets\/fonts\/urbanist-var\.woff2\)/);
  assert.match(main, /font-family: 'Urbanist Fallback';\s*src: local\(/);
  assert.match(main, /size-adjust:\s*[\d.]+%/);
  assert.match(main, /--font-display: "Urbanist", "Urbanist Fallback"/);
  assert.doesNotMatch(main, /Outfit/);
});

test('VP-002: the heading scale keeps h1 above h2 at phone and desktop widths', async () => {
  const main = await read('src/styles/main.css');
  const { block } = tokenBlock(main);
  const h2 = block.match(/--text-2xl: (clamp\([^)]+\))/)?.[1];
  const h1 = main.match(/\n\.hero h1 \{[^}]*font-size: (clamp\([^)]+\))/)?.[1];
  assert.ok(h2 && h1, 'h1 and h2 sizes are fluid clamps');
  for (const viewport of [320, 390, 768, 1440]) {
    const ratio = clampAt(h1, viewport) / clampAt(h2, viewport);
    assert.ok(ratio >= 1.3, `h1/h2 ratio ${ratio.toFixed(2)} at ${viewport}px`);
  }
  assert.match(main, /\nh2 \{[^}]*font-size: var\(--text-2xl\)/);
  assert.match(main, /\nh3 \{[^}]*font-size: var\(--text-lg\)/);
  assert.match(main, /\nbody \{[^}]*font-size: var\(--text-base\)/);
});

test('VP-007: the focus ring is the green token and the selection is cobalt', async () => {
  const main = await read('src/styles/main.css');
  assert.match(main, /:focus-visible \{\s*outline: 3px solid var\(--color-green\)/);
  assert.match(main, /::selection \{\s*background: var\(--color-cobalt\)/);
});
