// Guard for the compact language switch (owner decision of 2026-10-29, specs/next-design-fusion DF-019): two short
// codes, ES and EN, each with its full language name as the accessible name. Runs after the build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const switchOf = (html) => html.match(/<nav class="language-switcher"[\s\S]*?<\/nav>/)?.[0] ?? '';
const links = (nav) => [...nav.matchAll(/<a href="([^"]+)"([^>]*)>([^<]*)<\/a>/g)].map((match) => ({ href: match[1], attrs: match[2], text: match[3] }));

test('DF-025: one toggle offers the other language and names it for assistive technology', async () => {
  for (const [file, label, text, name, lang, href] of [
    ['dist/index.html', 'Idioma', 'EN', 'English', 'en-US', '/en/'],
    ['dist/en/index.html', 'Language', 'ES', 'Español', 'es-ES', '/'],
    ['dist/servicios/index.html', 'Idioma', 'EN', 'English', 'en-US', '/en/services/'],
    ['dist/en/services/index.html', 'Language', 'ES', 'Español', 'es-ES', '/servicios/'],
  ]) {
    const nav = switchOf(await read(file));
    assert.ok(nav.includes(`aria-label="${label}"`), `${file}: ${label}`);
    const all = links(nav);
    assert.equal(all.length, 1, `${file}: a single link`);
    assert.equal(all[0].text, text, `${file}: code`);
    assert.equal(all[0].href, href, `${file}: target`);
    assert.ok(all[0].attrs.includes(`aria-label="${name}"`), `${file}: name`);
    assert.ok(all[0].attrs.includes(`lang="${lang}"`), `${file}: lang`);
  }
});

test('DF-025: the toggle keeps a 44 px target and a mono, letter-spaced look', async () => {
  const css = await read('src/styles/locales.css');
  const link = css.match(/\.language-switcher a \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(link, /min-height: 44px;/);
  assert.match(link, /min-width: 44px;/);
  assert.match(link, /font-family: var\(--font-mono\);/);
  assert.match(link, /letter-spacing: [^;]+;/);
});
