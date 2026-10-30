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

test('DF-019: the switch shows ES and EN and names the languages for assistive technology', async () => {
  for (const [file, label, current, hrefs] of [
    ['dist/index.html', 'Idioma', 'ES', ['/', '/en/']],
    ['dist/en/index.html', 'Language', 'EN', ['/', '/en/']],
    ['dist/servicios/index.html', 'Idioma', 'ES', ['/servicios/', '/en/services/']],
  ]) {
    const nav = switchOf(await read(file));
    assert.ok(nav.includes(`aria-label="${label}"`), `${file}: ${label}`);
    const [es, en] = links(nav);
    assert.deepEqual([es.text, en.text], ['ES', 'EN'], `${file}: short codes`);
    assert.deepEqual([es.href, en.href], hrefs, `${file}: targets`);
    assert.match(es.attrs, /aria-label="Español"/);
    assert.match(en.attrs, /aria-label="English"/);
    assert.match(es.attrs, /lang="es-ES"/);
    assert.match(en.attrs, /lang="en-US"/);
    const marked = links(nav).filter((link) => /aria-current="page"/.test(link.attrs)).map((link) => link.text);
    assert.deepEqual(marked, [current], `${file}: the current language is marked`);
  }
});

test('DF-019: the switch keeps a 44 px target and a mono, letter-spaced look', async () => {
  const css = await read('src/styles/locales.css');
  const link = css.match(/\.language-switcher a \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(link, /min-height: 44px;/);
  assert.match(link, /min-width: 44px;/);
  assert.match(link, /font-family: var\(--font-mono\);/);
  assert.match(link, /letter-spacing: [^;]+;/);
});
