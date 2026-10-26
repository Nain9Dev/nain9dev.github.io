// Guards for specs/next-micro-interactions: small press, lift and hover states that respect reduced motion.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

async function microSection() {
  const css = await read('src/styles/main.css');
  const start = css.indexOf('/* --- Micro-interactions');
  assert.ok(start >= 0, 'main.css has the micro-interactions section');
  return css.slice(start);
}

test('MI-001: movement (lift, press scale, icon turn) lives only inside the no-preference block', async () => {
  const section = await microSection();
  const outside = section.replace(/@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*\n\}\n?/, '');
  assert.doesNotMatch(outside, /transform:/, 'no transform outside the no-preference block');
  const inside = section.match(/@media \(prefers-reduced-motion: no-preference\) \{([\s\S]*)\n\}/)?.[1] ?? '';
  assert.match(inside, /\.social-pill:hover,\s*\.social-pill:focus-visible \{\s*transform: translateY\(-2px\);/);
  assert.match(inside, /\.theme-toggle:active,[\s\S]*transform: scale\(0\.96\);/);
  assert.match(inside, /\.theme-toggle:hover svg,\s*\.theme-toggle:focus-visible svg \{\s*transform: rotate\(18deg\);/);
});

test('MI-002: every hover has a keyboard twin and the language switcher gains a hover state', async () => {
  const section = await microSection();
  assert.match(section, /\.language-switcher a:hover,\s*\.language-switcher a:focus-visible \{/);
  const hovers = [...section.matchAll(/([^{}]+):hover/g)].length;
  const focuses = [...section.matchAll(/([^{}]+):focus-visible/g)].length;
  assert.ok(focuses >= hovers, `focus-visible twins (${focuses}) cover the hovers (${hovers})`);
});

test('MI-003: no colour literals and no transition: all in the section', async () => {
  const section = await microSection();
  assert.doesNotMatch(section, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i);
  assert.doesNotMatch(section, /transition:\s*all/);
});
