import { readFile, writeFile, mkdir, cp, rm } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { parse, parseFragment, serialize } from 'parse5';
import { syncTranslations, walk } from './sync-translations.mjs';
import { origin, attr, setAttr, descendants, englishPath, localizeDocument, mapData, translated } from './lib/localization.mjs';

const preview = process.argv.includes('--preview');
const output = preview ? '.astro/localized-preview' : 'dist';
const { sources, catalog } = await syncTranslations();
if (preview) {
  const review = JSON.parse(await readFile('.astro/translations/review.json', 'utf8'));
  for (const candidate of review.candidates) {
    if (candidate.issues.length) throw new Error('Resolve structural findings before preview');
    catalog[candidate.id] = { ...candidate, status: 'reviewed' };
  }
}
// Validate full coverage before writing any translated page.
for (const segment of sources) translated(segment.source, catalog);

const runtime = JSON.parse(await readFile('src/i18n/runtime.json', 'utf8'));
const englishRuntime = Object.fromEntries(Object.entries(runtime).map(([key, value]) => [key, translated(value, catalog)]));
const pages = [];
const pendingWrites = [];
const addChildren = (parent, html) => {
  const children = parseFragment(html).childNodes;
  children.forEach(child => { child.parentNode = parent; });
  parent.childNodes.push(...children);
};
const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const escapeXml = value => escapeAttribute(value).replaceAll("'", '&apos;').replaceAll('>', '&gt;');

function finishPage(html, spanishURL, englishURL, language, indexable) {
  const doc = parse(html);
  const nodes = descendants(doc);
  const head = nodes.find(node => node.tagName === 'head');
  head.childNodes = head.childNodes.filter(node => !(
    (node.tagName === 'link' && attr(node, 'rel') === 'alternate' && ['es', 'en', 'x-default'].includes(attr(node, 'hreflang')))
    || (node.tagName === 'meta' && attr(node, 'property') === 'og:locale:alternate')
    || (node.tagName === 'link' && attr(node, 'href') === '/assets/css/locales.css')
  ));
  setAttr(nodes.find(node => node.tagName === 'html'), 'lang', language);
  const ui = nodes.find(node => attr(node, 'id') === 'localized-ui');
  if (ui) ui.childNodes[0].value = JSON.stringify(language === 'en-US' ? englishRuntime : runtime).replaceAll('<', '\\u003c');
  if (indexable) {
    for (const [code, url] of [['es', spanishURL], ['en', englishURL], ['x-default', spanishURL]]) {
      addChildren(head, `<link rel="alternate" hreflang="${code}" href="${escapeAttribute(url)}">`);
    }
    addChildren(head, `<meta property="og:locale:alternate" content="${language === 'en-US' ? 'es_ES' : 'en_US'}">`);
  }
  for (const node of nodes.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')) {
    const schema = JSON.parse(node.childNodes[0].value);
    for (const entity of schema['@graph'] ?? [schema]) {
      if (entity['@type'] === 'WebSite') entity.inLanguage = ['es-ES', 'en-US'];
      else if (entity.inLanguage) entity.inLanguage = language;
    }
    node.childNodes[0].value = JSON.stringify(schema).replaceAll('<', '\\u003c');
  }
  const header = nodes.find(node => (attr(node, 'class') ?? '').split(' ').includes('header-layout'));
  if (header) {
    const button = header.childNodes.find(node => node.tagName === 'a' && (attr(node, 'class') ?? '').includes('button'));
    const actions = header.childNodes.find(node => (attr(node, 'class') ?? '').split(' ').includes('header-actions'))
      ?? parseFragment('<div class="header-actions" data-nosnippet></div>').childNodes[0];
    header.childNodes = header.childNodes.filter(node => node !== actions);
    actions.childNodes = actions.childNodes.filter(node => !(attr(node, 'class') ?? '').split(' ').includes('language-switcher'));
    actions.parentNode = header;
    if (button) {
      header.childNodes = header.childNodes.filter(node => node !== button);
      button.parentNode = actions;
      actions.childNodes.push(button);
    }
    const label = language === 'en-US' ? 'Language' : 'Idioma';
    const spanishPath = new URL(spanishURL).pathname;
    const errorPage = /^\/404(?:\.html)?\/?$/.test(spanishPath);
    addChildren(actions, `<nav class="language-switcher" aria-label="${label}" translate="no"><a href="${escapeAttribute(errorPage ? '/' : spanishPath)}" lang="es-ES" hreflang="es"${language === 'es-ES' ? ' aria-current="page"' : ''}>Español</a><a href="${escapeAttribute(errorPage ? '/en/' : new URL(englishURL).pathname)}" lang="en-US" hreflang="en"${language === 'en-US' ? ' aria-current="page"' : ''}>English</a></nav>`);
    header.childNodes.push(actions);
  }
  addChildren(head, '<link rel="stylesheet" href="/assets/css/locales.css">');
  if (preview) {
    const robots = nodes.find(node => node.tagName === 'meta' && attr(node, 'name') === 'robots');
    if (robots) setAttr(robots, 'content', 'noindex, nofollow');
  }
  return serialize(doc);
}

for (const file of (await walk('dist')).filter(file => file.endsWith('.html'))) {
  const path = `/${relative('dist', file).replaceAll('\\', '/')}`;
  if (path.startsWith('/en/')) continue;
  const html = await readFile(file, 'utf8');
  const nodes = descendants(parse(html));
  const refresh = nodes.find(node => node.tagName === 'meta' && attr(node, 'http-equiv')?.toLowerCase() === 'refresh');
  if (refresh) {
    for (const node of nodes) {
      if (attr(node, 'href')) setAttr(node, 'href', englishPath(attr(node, 'href')));
    }
    const content = attr(refresh, 'content');
    setAttr(refresh, 'content', content.replace(/(url=)(.+)$/i, (_, prefix, target) => prefix + englishPath(target)));
    const document = nodes[0];
    pendingWrites.push([decodeURI(englishPath(path.replace(/index\.html$/, '')).slice(1)) + 'index.html', serialize(document)]);
    continue;
  }
  const spanishURL = attr(nodes.find(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical'), 'href');
  if (!spanishURL?.startsWith(`${origin}/`)) throw new Error(`Invalid source canonical: ${path}`);
  const englishURL = englishPath(spanishURL);
  const robots = attr(nodes.find(node => node.tagName === 'meta' && attr(node, 'name') === 'robots'), 'content');
  const indexable = !robots?.includes('noindex');
  const translatedHTML = localizeDocument(html, catalog);
  const enPath = path === '/404.html' ? '/en/404.html' : englishPath(path.replace(/index\.html$/, '')) + 'index.html';
  pendingWrites.push([path.slice(1), finishPage(html, spanishURL, englishURL, 'es-ES', indexable)]);
  pendingWrites.push([decodeURI(enPath.slice(1)), finishPage(translatedHTML, spanishURL, englishURL, 'en-US', indexable)]);
  if (indexable) pages.push(spanishURL, englishURL);
}

for (const file of ['projects.json', 'case-studies.json', 'impact-metrics.json', 'tech-stack.json']) {
  const source = JSON.parse(await readFile(`public/assets/data/${file}`, 'utf8'));
  const data = mapData(source, value => translated(value, catalog));
  if (file === 'projects.json') for (const project of data) for (const link of project.links) link.url = englishPath(link.url);
  pendingWrites.push([`en/assets/data/${file}`, JSON.stringify(data, null, 2) + '\n']);
}
const commands = JSON.parse(await readFile('public/assets/data/terminal-commands.json', 'utf8'));
const englishCommands = Object.fromEntries(Object.entries(commands).map(([key, html]) => {
  const doc = parse(localizeDocument(html, catalog));
  const body = descendants(doc).find(node => node.tagName === 'body');
  return [key, serialize(body)];
}));
pendingWrites.push(['en/assets/data/terminal-commands.json', JSON.stringify(englishCommands, null, 2) + '\n']);
pendingWrites.push(['sitemap-0.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(url => `<url><loc>${escapeXml(url)}</loc></url>`).join('')}</urlset>\n`]);

if (preview) {
  const previewPath = resolve(output);
  if (previewPath !== resolve('.astro', 'localized-preview')) throw new Error('Unexpected preview directory');
  await rm(previewPath, { recursive: true, force: true });
  await cp('dist', output, { recursive: true });
}
for (const [path, content] of pendingWrites) {
  const file = join(output, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, content);
}
if (preview) await writeFile(join(output, 'robots.txt'), 'User-agent: *\nDisallow: /\n');
console.log(`${preview ? 'Private noindex preview' : 'Bilingual build'}: ${pendingWrites.length} outputs, ${pages.length} indexable language URLs.`);
