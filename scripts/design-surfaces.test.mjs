// Guards for specs/next-design-fusion, layer 3 (DF-008): the footer and the terminal are one deep blue band
// in both themes, with text that keeps AA contrast on it.
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
const DEEP = '#002b66';

test('DF-008: the terminal skin is the deep blue band in both themes and its text keeps AA contrast', async () => {
  const css = await read('src/styles/main.css');
  const root = css.match(/\n:root \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.equal(token(root, 'brand-deep'), DEEP);
  assert.equal(token(root, 'terminal-bg'), DEEP);
  assert.equal(token(root, 'terminal-raised'), DEEP);
  for (const name of ['terminal-ink', 'terminal-muted', 'terminal-link', 'terminal-green', 'terminal-amber', 'terminal-red-ink']) {
    const value = token(root, name);
    assert.ok(value, `--${name} declared`);
    assert.ok(contrast(value, DEEP) >= 4.5, `--${name} ${value} on the band: ${contrast(value, DEEP).toFixed(2)}`);
  }
  const terminal = await read('src/styles/terminal.css');
  assert.match(terminal, /\.term-text-red \{ color: var\(--terminal-red-ink\); \}/, 'error text uses the readable red');
  assert.doesNotMatch(terminal, /var\(--color-[a-z-]+\)/, 'terminal colours still come from the terminal tokens');
});

test('DF-008: the footer is a flat deep blue band with the dark roles in both themes', async () => {
  const css = await read('src/styles/main.css');
  const footer = css.match(/\.site-footer \{\s*padding-block: var\(--s12\) var\(--s8\);([\s\S]*?)\n\}/)?.[1];
  assert.ok(footer, 'the footer rule exists');
  assert.match(footer, /background: var\(--brand-deep\);/);
  assert.doesNotMatch(footer, /gradient/, 'no washed gradient on paper');
  const root = css.match(/\n:root \{([\s\S]*?)\n\}/)?.[1] ?? '';
  for (const [role, band] of [['color-ink', 'band-ink'], ['color-ink-soft', 'band-ink-soft'], ['color-ink-muted', 'band-ink-muted'], ['color-link', 'band-link']]) {
    assert.match(footer, new RegExp(`--${role}: var\\(--${band}\\);`), `the footer scopes --${role}`);
    const value = token(root, band);
    assert.ok(value, `--${band} declared`);
    assert.ok(contrast(value, DEEP) >= 4.5, `--${band} ${value} on the footer: ${contrast(value, DEEP).toFixed(2)}`);
  }
  assert.match(footer, /--color-green: var\(--brand-green\);/);
  for (const alias of ['color-text', 'color-text-soft', 'color-text-muted', 'color-primary-strong']) {
    assert.match(footer, new RegExp(`--${alias}: var\\(--color-[a-z-]+\\);`), `the footer re-resolves --${alias}`);
  }
  assert.ok(contrast(token(root, 'brand-green'), DEEP) >= 4.5, 'live marks on the footer');
});
