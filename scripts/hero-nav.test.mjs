// Guards for specs/045-visual-polish PR 2: hero entrance, phone menu, scroll progress and the retired particles.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('VP-005: the hero entrance runs only without a reduced-motion preference and never hides content at rest', async () => {
  const css = await read('src/styles/main.css');
  const block = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*html:not\(\.low-performance\) \.hero-copy > \*[\s\S]*?\n\}/)?.[0];
  assert.ok(block, 'the hero entrance lives inside a no-preference media block');
  assert.match(block, /animation: compose-in [^;]*backwards/, 'fill mode backwards: the end state is the plain page');
  const keyframes = css.match(/@keyframes compose-in \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.doesNotMatch(keyframes, /\bto\b|opacity/, 'only a "from" frame, and no opacity (LCP stays countable)');
  const hero = await read('src/components/home/Hero.astro');
  assert.doesNotMatch(hero, /data-reveal/, 'PERF-006: the hero text is not behind a script reveal');
});

test('VP-009: the phone menu is a disclosure button that leaves the links visible without JavaScript', async () => {
  const header = await read('src/components/Header.astro');
  const button = header.match(/<button class="nav-toggle"[^>]*>/)?.[0];
  assert.ok(button, 'the header has a menu toggle');
  assert.match(button, /type="button"/);
  assert.match(button, /aria-expanded="false"/);
  assert.match(button, /aria-controls="primary-navigation"/);
  assert.match(button, /aria-label="[^"]+"/);
  assert.doesNotMatch(button, /\bhidden\b/, 'no hidden attribute: toggling it after load would shift the layout');
  assert.match(header, /<nav class="primary-navigation" id="primary-navigation"/);

  const layout = await read('src/layouts/BaseLayout.astro');
  assert.match(layout, /<head>[\s\S]*classList\.add\("motion-ready"\)[\s\S]*<\/head>/, 'the head script marks JavaScript before first paint');

  const script = await read('src/scripts/site-interactions.js');
  assert.match(script, /export function initializeMobileMenu/);
  assert.match(script, /event\.key === "Escape"[\s\S]{0,120}button\.focus\(\)/, 'Escape closes the menu and returns focus');

  const css = await read('src/styles/main.css');
  assert.match(css, /\.nav-toggle \{\s*display: none;/, 'without JavaScript the toggle is not shown');
  assert.match(css, /\.motion-ready \.site-header:not\(\[data-menu="open"\]\) \.primary-navigation \{\s*display: none;/, 'links fold from first paint only when JavaScript runs');
  assert.match(css, /\.motion-ready \.nav-toggle \{[^}]*width: 44px;[^}]*height: 44px;/, 'WCAG 2.5.8 target size');
});

test('VP-006: scroll progress and the menu animation respect reduced motion', async () => {
  const css = await read('src/styles/main.css');
  assert.match(css, /@supports \(animation-timeline: scroll\(\)\) \{\s*@media \(prefers-reduced-motion: no-preference\) \{\s*\.site-header::after/);
  assert.match(css, /@media \(max-width: 42rem\) and \(prefers-reduced-motion: no-preference\) \{\s*\.site-header\[data-menu="open"\] \.primary-navigation \{\s*animation: menu-in/);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) and \(pointer: fine\) \{\s*body::after/, 'the pointer-lit grid needs a fine pointer and no reduced motion');
});

test('ADR-0012: the particle canvas is retired', async () => {
  await assert.rejects(access(join(ROOT, 'src/scripts/particles.js')));
  const css = await read('src/styles/main.css');
  assert.doesNotMatch(css, /ambient-particles/);
  assert.doesNotMatch(await read('src/styles/locales.css'), /ambient-particles/);
});
