// Guards for the shorter top bar (owner decision of 2026-10-29, specs/next-design-fusion DF-018): three links with a
// stroke icon each; the links that left stay reachable from the footer; the current page is marked. Runs after the build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const navOf = (html) => html.match(/<nav class="primary-navigation"[\s\S]*?<\/nav>/)?.[0] ?? '';
const linksOf = (nav) => [...nav.matchAll(/<a href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/g)].map((match) => ({ href: match[1], attrs: match[2], inner: match[3] }));

test('DF-018: the top bar has three links, each a stroke icon and one word', async () => {
  const header = await read('src/components/Header.astro');
  const links = linksOf(navOf(header));
  assert.deepEqual(links.map((link) => link.href.split('?')[0]), ['/servicios/', '/proyectos/', '/blog/']);
  for (const link of links) {
    assert.match(link.inner, /<svg class="nav-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">/, `${link.href} has an icon`);
    assert.match(link.inner, /<span>[^<]+<\/span>/, `${link.href} has a label`);
  }
  assert.doesNotMatch(navOf(header), /Arquitectura Frontend|Cómo trabajo|Sobre mí/, 'the other links left the bar');
  const css = await read('src/styles/main.css');
  const icon = css.match(/\.nav-icon \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(icon, /stroke: currentColor;/);
  assert.match(icon, /fill: none;/);
  assert.match(icon, /stroke-linecap: round;/);
});

test('DF-018: what left the bar stays one click away, in the footer, in both languages', async () => {
  for (const [file, expected] of [
    ['dist/index.html', ['/servicios/arquitectura-frontend-alto-rendimiento/', '/#method', '/#about', '/blog/']],
    ['dist/en/index.html', ['/en/services/arquitectura-frontend-alto-rendimiento/', '/en/#method', '/en/#about', '/en/blog/']],
  ]) {
    const footer = (await read(file)).match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
    const nav = footer.match(/<nav class="[^"]*footer-nav[^"]*"[\s\S]*?<\/nav>/)?.[0] ?? '';
    assert.ok(nav, `${file}: the footer has its own navigation`);
    for (const href of expected) assert.ok(nav.includes(`href="${href}"`), `${file}: ${href}`);
  }
});

test('DF-018: the bar marks the page the visitor is on', async () => {
  for (const [file, href] of [['dist/servicios/index.html', '/servicios/'], ['dist/proyectos/index.html', '/proyectos/'], ['dist/blog/index.html', '/blog/']]) {
    const current = linksOf(navOf(await read(file))).filter((link) => /aria-current="page"/.test(link.attrs));
    assert.deepEqual(current.map((link) => link.href), [href], file);
  }
  const home = linksOf(navOf(await read('dist/index.html')));
  assert.equal(home.filter((link) => /aria-current/.test(link.attrs)).length, 0, 'the home marks none');
  const css = await read('src/styles/main.css');
  assert.match(css, /\.primary-navigation a\[aria-current="page"\]/, 'the sweep and colour of the current page');
});
