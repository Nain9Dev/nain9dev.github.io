// Guards for the hero on the deep blue band (owner decision of 2026-10-29, specs/next-design-fusion DF-020): the hero is
// a full-bleed band in --brand-deep in both themes, with the band's own ink, surfaces and stroke colours, and a
// primary button that keeps its contrast on the band.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const css = await readFile(join(ROOT, 'src/styles/main.css'), 'utf8');
const tokens = css.match(/\n:root \{([\s\S]*?)\n\}/)?.[1] ?? '';
const token = (name) => tokens.match(new RegExp(`--${name}: (#[0-9a-fA-F]{6});`))?.[1];

const luminance = (hex) => {
  const channel = (offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const rule = (selector) => css.match(new RegExp(`\\n${selector.replaceAll('.', '\\.')} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';

test('DF-020: the hero is a deep blue band with the band colours in both themes', () => {
  const hero = rule('.hero');
  assert.match(hero, /background: var\(--brand-deep\);/);
  assert.match(hero, /isolation: isolate;/, 'the field at z-index -1 must paint above the hero background');
  for (const line of [
    '--color-ink: var(--band-ink);',
    '--color-ink-soft: var(--band-ink-soft);',
    '--color-ink-muted: var(--band-ink-muted);',
    '--color-link: var(--band-link);',
    '--color-stroke: var(--brand-green);',
    '--color-red: var(--brand-red);',
  ]) {
    assert.ok(hero.includes(line), line);
  }
  // The panel and the receipts sit on surfaces taken from the band, not from the theme.
  assert.match(hero, /--color-bg-raised: color-mix\(in srgb, var\(--brand-deep\)/);
  assert.match(hero, /--color-surface: color-mix\(in srgb, var\(--brand-deep\)/);
});

test('DF-020: text, links and the primary button keep AA contrast on the band', () => {
  const deep = token('brand-deep');
  assert.equal(deep, '#002b66');
  for (const name of ['band-ink', 'band-ink-soft', 'band-ink-muted', 'band-link']) {
    assert.ok(contrast(token(name), deep) >= 4.5, `${name} on the band: ${contrast(token(name), deep).toFixed(2)}`);
  }
  const button = rule('.hero .button-primary');
  assert.match(button, /background: var\(--brand-green\);/);
  assert.match(button, /color: var\(--brand-deep\);/);
  assert.ok(contrast(token('brand-green'), deep) >= 4.5, 'the button label on the green');
  assert.ok(contrast(token('brand-green'), deep) >= 3, 'the button against the band');
});

test('DF-020: the stroke field reads the band colours from the canvas, so the scope applies', async () => {
  const source = await readFile(join(ROOT, 'src/scripts/hero-field.js'), 'utf8');
  assert.match(source, /getComputedStyle\(canvas\)/);
});
