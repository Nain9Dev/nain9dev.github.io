// Guards for specs/048-themes: paper palette on request or by system preference, with the brand contrast kept.
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

test('TH-001: the light theme uses the brandbook paper palette and keeps AA contrast', async () => {
  const css = await read('src/styles/main.css');
  const explicit = css.match(/:root\[data-theme="light"\] \{([\s\S]*?)\n\}/)?.[1];
  const system = css.match(/@media \(prefers-color-scheme: light\) \{\s*:root:not\(\[data-theme="dark"\]\) \{([\s\S]*?)\n  \}/)?.[1];
  assert.ok(explicit && system, 'explicit and system light blocks exist');
  assert.equal(explicit.trim(), system.trim(), 'both blocks carry the same tokens');
  assert.match(explicit, /color-scheme: light;/);
  const bg = token(explicit, 'color-bg');
  const surface = token(explicit, 'color-surface');
  assert.equal(bg, '#edf1f6');
  assert.equal(token(explicit, 'color-ink'), '#002b66');
  assert.equal(token(explicit, 'color-cobalt'), '#0047ab');
  for (const name of ['color-ink', 'color-ink-soft', 'color-ink-muted', 'color-link', 'color-green', 'color-red']) {
    const value = token(explicit, name);
    assert.ok(value, `${name} declared`);
    assert.ok(contrast(value, bg) >= 4.5, `${name} ${value} on paper: ${contrast(value, bg).toFixed(2)}`);
    assert.ok(contrast(value, surface) >= 4.5, `${name} ${value} on white: ${contrast(value, surface).toFixed(2)}`);
  }
  assert.ok(contrast('#ffffff', token(explicit, 'color-cobalt')) >= 4.5, 'white on cobalt buttons');
});

test('TH-002: the dark palette stays the default and the terminal keeps its dark skin', async () => {
  const css = await read('src/styles/main.css');
  const root = css.match(/\n:root \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(root, /color-scheme: dark;/);
  assert.match(root, /--color-shadow: var\(--color-cobalt-deep\);/);
  assert.match(root, /--terminal-bg: #111c36;/);
  const terminal = await read('src/styles/terminal.css');
  assert.doesNotMatch(terminal, /var\(--color-[a-z-]+\)/, 'terminal colours come from the terminal tokens');
  assert.match(terminal, /\.terminal-input:focus-visible \{[^}]*outline: 2px solid var\(--terminal-green\)/);
  assert.doesNotMatch(css, /box-shadow: [^;]*var\(--color-cobalt-deep\)/, 'solid shadows read --color-shadow');
});

test('TH-003: the choice is applied before first paint and the toggle is an accessible pressed button', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.match(layout, /<head>[\s\S]*localStorage\.getItem\("theme"\)[\s\S]*dataset\.theme = theme[\s\S]*classList\.add\("motion-ready"\)/);
  const header = await read('src/components/Header.astro');
  assert.match(header, /<div class="header-actions" data-nosnippet>\s*<!--[^>]*-->\s*<button class="theme-toggle" type="button" aria-label="[^"]+" aria-pressed="false" data-theme-toggle>/);
  assert.match(header, /<svg class="icon-moon"[^>]*aria-hidden="true"/);
  assert.match(header, /<svg class="icon-sun"[^>]*aria-hidden="true"/);
  const script = await read('src/scripts/site-interactions.js');
  assert.match(script, /export function initializeThemeToggle/);
  assert.match(script, /localStorage\.setItem\("theme", next\)/);
  assert.match(script, /prefersLight\.addEventListener\("change", render\)/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.theme-toggle \{[^}]*width: 44px;[^}]*height: 44px;/);
  assert.match(css, /\.theme-toggle\[aria-pressed="true"\] \.icon-sun \{\s*display: block;/);
  assert.match(css, /:root\[data-theme="light"\] \.tech-icon[^{]*\{\s*filter: none;/);
});
