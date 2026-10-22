// Guards for specs/045-visual-polish PR 5: terminal under reduced motion and the compact privacy notice.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('VP-006: the terminal writes in one step when the visitor prefers reduced motion', async () => {
  const terminal = await read('src/scripts/terminal.js');
  assert.match(terminal, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches/);
  assert.match(terminal, /node\.nodeType === Node\.TEXT_NODE && instant\) \{\s*parent\.appendChild\(document\.createTextNode\(node\.textContent\)\)/);
  // A11Y-005 stays: readOnly and aria-busy, never disabled or a focus move.
  assert.match(terminal, /input\.readOnly = true/);
  assert.doesNotMatch(terminal, /input\.disabled/);
});

test('WCAG 2.4.11: the privacy notice is compact, keeps its text and steps aside after the first screen', async () => {
  const banner = await read('src/components/PrivacyBanner.astro');
  assert.match(banner, /🔒 Este sitio no utiliza cookies de seguimiento invasivas\. Tu privacidad está protegida\./);
  assert.match(banner, /max-width: min\(24rem/);
  assert.match(banner, /left: var\(--s4\)/);
  assert.doesNotMatch(banner, /translateX\(-50%\)/, 'no longer centred over the call-to-action column');
  assert.match(banner, /\.privacy-banner\.is-away \{[^}]*visibility: hidden;/);
  assert.match(banner, /classList\.toggle\('is-away', footerInView \|\| window\.scrollY > window\.innerHeight \* 0\.6\)/);
  assert.match(banner, /new IntersectionObserver[\s\S]{0,120}\.observe\(footer\)/, 'never covers the footer links');
  assert.match(banner, /width: 32px;\s*height: 32px;/, 'close button is a 24 px+ target');
  assert.match(banner, /@media \(max-width: 42rem\) \{\s*\.privacy-banner,\s*\.privacy-banner\.is-away \{\s*position: static;/, 'no fixed layer over phone content');
});
