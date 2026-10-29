// Guards for specs/next-design-fusion, layer 1 (DF-001 to DF-003): the roles of the round 4 design,
// the skip link contrast and the browser bar colour that follows the theme.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

function luminance(hex) {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((part) => parseInt(part, 16) / 255);
  const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const token = (block, name) => block.match(new RegExp(`--${name}: (#[0-9a-f]{6});`))?.[1];

async function blocks() {
  const css = await read('src/styles/main.css');
  const dark = css.match(/\n:root \{([\s\S]*?)\n\}/)?.[1];
  const explicit = css.match(/:root\[data-theme="light"\] \{([\s\S]*?)\n\}/)?.[1];
  const system = css.match(/@media \(prefers-color-scheme: light\) \{\s*:root:not\(\[data-theme="dark"\]\) \{([\s\S]*?)\n  \}/)?.[1];
  assert.ok(dark && explicit && system, 'dark, explicit light and system light blocks exist');
  return { css, dark, explicit, system };
}

const DARK = {
  'color-sunken': '#070b16',
  'color-heading': '#edf1f6',
  'color-stroke': '#80ff00',
  'color-focus': '#80ff00',
  'color-red-ink': '#ff5c6c',
  'color-logo': '#ffffff',
};
const LIGHT = {
  'color-sunken': '#dee6f0',
  'color-heading': '#0047ab',
  'color-stroke': '#0047ab',
  'color-focus': '#2e6b00',
  'color-red-ink': '#c4001a',
  'color-logo': '#0047ab',
};
const BRAND = { 'brand-deep': '#002b66', 'brand-green': '#80ff00', 'brand-red': '#ff001f', 'brand-black': '#1d1d1b' };

test('DF-001: the new roles exist with the dark and paper values of the round 4 table', async () => {
  const { dark, explicit, system } = await blocks();
  for (const [name, value] of Object.entries(DARK)) assert.equal(token(dark, name), value, `dark --${name}`);
  for (const [name, value] of Object.entries(BRAND)) assert.equal(token(dark, name), value, `--${name}`);
  for (const [name, value] of Object.entries(LIGHT)) {
    assert.equal(token(explicit, name), value, `light --${name}`);
    assert.equal(token(system, name), value, `system light --${name}`);
  }
  assert.equal(explicit.trim(), system.trim(), 'both light blocks carry the same tokens');
});

test('DF-001: no existing role changed value', async () => {
  const { dark, explicit } = await blocks();
  const before = {
    dark: { 'color-bg': '#070b16', 'color-bg-raised': '#0d1730', 'color-band': '#0b1e45', 'color-surface': '#111c36',
      'color-ink': '#edf1f6', 'color-ink-soft': '#c9d3e3', 'color-ink-muted': '#a9b8cf', 'color-cobalt': '#0047ab',
      'color-link': '#6d9bf5', 'color-green': '#80ff00', 'color-red': '#ff001f' },
    light: { 'color-bg': '#edf1f6', 'color-bg-raised': '#f7f9fc', 'color-band': '#dee6f0', 'color-surface': '#ffffff',
      'color-ink': '#002b66', 'color-ink-soft': '#1f3b6e', 'color-ink-muted': '#3c5f94', 'color-cobalt': '#0047ab',
      'color-link': '#0047ab', 'color-green': '#2e6b00', 'color-red': '#c4001a', 'color-shadow': '#1d1d1b' },
  };
  for (const [name, value] of Object.entries(before.dark)) assert.equal(token(dark, name), value, `dark --${name}`);
  for (const [name, value] of Object.entries(before.light)) assert.equal(token(explicit, name), value, `light --${name}`);
});

test('DF-001: the text roles keep AA contrast on the surfaces they sit on, and strokes keep 3:1', async () => {
  const { dark, explicit } = await blocks();
  for (const [label, block, roles] of [['dark', dark, DARK], ['paper', explicit, LIGHT]]) {
    const surfaces = ['color-bg', 'color-bg-raised', 'color-band', 'color-surface']
      .map((name) => [name, token(block, name)]);
    for (const name of ['color-heading', 'color-red-ink']) {
      for (const [surface, hex] of surfaces) {
        assert.ok(contrast(roles[name], hex) >= 4.5, `${label} --${name} on --${surface}: ${contrast(roles[name], hex).toFixed(2)}`);
      }
    }
    for (const name of ['color-stroke', 'color-focus']) {
      for (const [surface, hex] of surfaces) {
        assert.ok(contrast(roles[name], hex) >= 3, `${label} --${name} on --${surface}: ${contrast(roles[name], hex).toFixed(2)}`);
      }
    }
  }
});

test('DF-002: the skip link is white on the action colour, at least 4.5:1 in both themes', async () => {
  const { css, dark, explicit } = await blocks();
  const rule = css.match(/\.skip-link \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(rule, /background: var\(--color-cobalt\);/);
  assert.match(rule, /color: var\(--color-cobalt-ink\);/);
  for (const block of [dark, explicit]) {
    assert.ok(contrast('#ffffff', token(block, 'color-cobalt')) >= 4.5, 'white on --color-cobalt');
  }
});

test('DF-003: the browser bar colour follows the theme before first paint', async () => {
  const seo = await read('src/components/SEO.astro');
  assert.doesNotMatch(seo, /<meta name="theme-color" content="#090A0F">/i, 'no single fixed colour');
  assert.match(seo, /<meta name="theme-color" content="#070b16" media="\(prefers-color-scheme: dark\)">/i);
  assert.match(seo, /<meta name="theme-color" content="#edf1f6" media="\(prefers-color-scheme: light\)">/i);
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.match(layout, /<script is:inline>[\s\S]*localStorage\.getItem\("theme"\)[\s\S]*meta\[name="theme-color"\][\s\S]*classList\.add\("motion-ready"\)/,
    'the head script applies the stored choice to the bar before first paint');
  const interactions = await read('src/scripts/site-interactions.js');
  assert.match(interactions, /meta\[name="theme-color"\]/, 'the toggle updates the bar');
});
