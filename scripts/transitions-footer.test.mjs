// Guards for specs/045-visual-polish PR 4: page transitions and the footer band.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('VP-006: page transitions run only without a reduced-motion preference', async () => {
  const css = await read('src/styles/main.css');
  const block = css.match(/@media \(prefers-reduced-motion: no-preference\) \{\s*@view-transition \{ navigation: auto; \}([\s\S]*?)\n\}/)?.[1];
  assert.ok(block, 'NAV-002: @view-transition stays first in its reduced-motion block');
  assert.match(block, /::view-transition-old\(root\) \{\s*animation: [^;]*page-out;/);
  assert.match(block, /::view-transition-new\(root\) \{\s*animation: [^;]*page-in;/);
  const pageIn = css.match(/@keyframes page-in \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(pageIn, /transform: translateY\(12px\)/);
});

test('A11Y: the footer heading follows the page outline and the footer has no inline style', async () => {
  const footer = await read('src/components/Footer.astro');
  assert.doesNotMatch(footer, /<h[3-6]\b/, 'no heading that skips a level after the page h2 sections');
  assert.match(footer, /<h2 class="footer-title">/);
  assert.doesNotMatch(footer, /style=/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.status-dot \{[^}]*background: var\(--color-green\);/);
  assert.match(css, /\.footer-links a:not\(\.status-pill\):hover::after,\s*\.footer-links a:not\(\.status-pill\):focus-visible::after \{/);
});
