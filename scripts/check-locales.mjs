import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { parse, serializeOuter } from 'parse5';
import { walk } from './sync-translations.mjs';
import { origin, attr, descendants, englishPath } from './lib/localization.mjs';

const preview = process.argv.includes('--preview');
const root = preview ? '.astro/localized-preview' : 'dist';
const files = await walk(root);
const paths = new Set(files.map(file => `/${relative(root, file).replaceAll('\\', '/')}`));
const exists = value => {
  const path = decodeURI(new URL(value, origin).pathname);
  return paths.has(path) || paths.has(`${path.replace(/\/$/, '')}/index.html`);
};
const pages = new Map();
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
for (const file of files.filter(file => file.endsWith('.html'))) {
  const nodes = descendants(parse(await readFile(file, 'utf8'), { scriptingEnabled: false }));
  if (nodes.some(node => attr(node, 'http-equiv')?.toLowerCase() === 'refresh')) continue;
  const links = nodes.filter(node => node.tagName === 'link');
  const canonical = attr(links.find(node => attr(node, 'rel') === 'canonical'), 'href');
  if (!canonical) continue;
  const english = new URL(canonical).pathname.startsWith('/en/');
  const robots = attr(nodes.find(node => node.tagName === 'meta' && attr(node, 'name') === 'robots'), 'content');
  check(attr(nodes.find(node => node.tagName === 'html'), 'lang') === (english ? 'en-US' : 'es-ES'), `${canonical}: incorrect language`);
  const ui = nodes.find(node => attr(node, 'id') === 'localized-ui');
  check(Boolean(ui), `${canonical}: missing interface dictionary`);
  if (ui) check(typeof JSON.parse(ui.childNodes[0].value).terminalHint === 'string', `${canonical}: incomplete interface dictionary`);
  for (const script of nodes.filter(node => node.tagName === 'script' && attr(node, 'src') === '/assets/js/terminal.js')) {
    check(attr(script, 'type') === 'module', `${canonical}: terminal imports require module loading`);
  }
  const alternate = links.filter(node => attr(node, 'rel') === 'alternate');
  if (!robots?.includes('noindex') || (preview && alternate.length)) {
    check(alternate.length === 3, `${canonical}: expected es/en/x-default alternatives`);
    for (const link of alternate) check(exists(attr(link, 'href')), `${canonical}: nonexistent language alternate`);
  }
  if (preview) check(robots?.includes('noindex'), `${canonical}: preview is indexable`);
  const languageLinks = nodes.filter(node => node.tagName === 'a' && ['es', 'en'].includes(attr(node, 'hreflang')));
  check(languageLinks.length === 2, `${canonical}: missing equivalent-page language switcher`);
  for (const link of languageLinks) check(exists(attr(link, 'href')), `${canonical}: broken language switcher`);
  for (const node of nodes.filter(node => node.tagName === 'a')) {
    const href = attr(node, 'href');
    if (!href || href.startsWith('#')) continue;
    const url = new URL(href, canonical);
    if (url.origin === origin) check(exists(url.href), `${canonical}: missing internal target ${href}`);
  }
  pages.set(canonical, { nodes, alternate, english });
}
let pairs = 0;
for (const [url, page] of pages) {
  if (page.english) continue;
  const english = pages.get(englishPath(url));
  check(Boolean(english), `${url}: missing English page`);
  if (!english) continue;
  pairs++;
  const protectedNodes = nodes => nodes.filter(node => ['pre', 'code', 'style'].includes(node.tagName)
    || (attr(node, 'class') ?? '').split(/\s+/).includes('mermaid')
    || (node.tagName === 'script' && !['application/ld+json', 'application/json'].includes(attr(node, 'type')))).map(serializeOuter);
  check(JSON.stringify(protectedNodes(page.nodes)) === JSON.stringify(protectedNodes(english.nodes)), `${url}: executable content or code example changed`);
  for (const [key, value] of [['es', url], ['en', englishPath(url)], ['x-default', url]]) {
    if (!page.alternate.length) continue;
    check([page, english].every(item => item.alternate.some(node => attr(node, 'hreflang') === key && attr(node, 'href') === value)), `${url}: language links are not reciprocal`);
  }
}
const runtime = JSON.parse(await readFile('src/i18n/runtime.json', 'utf8'));
for (const file of [...await walk('public/assets/js'), ...await walk('src')].filter(file => /\.(?:js|astro|mdx)$/.test(file) && !file.endsWith('.min.js'))) {
  const source = await readFile(file, 'utf8');
  for (const match of source.matchAll(/message\(['"]([^'"]+)['"]/g)) check(match[1] in runtime, `${file}: unknown interface key ${match[1]}`);
}
if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  assert.fail(`${failures.length} localization contract violations`);
}
console.log(`Localization contract passed: ${pairs} language pairs, reciprocal alternates, preserved code and valid internal destinations.`);
