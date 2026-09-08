import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse } from 'parse5';

const origin = 'https://www.naindev.com';
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const attr = (node, name) => node?.attrs?.find(attribute => attribute.name === name)?.value;
const descendants = node => [node, ...(node.childNodes ?? []).flatMap(descendants)];
const text = node => node?.nodeName === '#text' ? node.value : (node?.childNodes ?? []).map(text).join('');
const excludedFromSnippets = node => node && (attr(node, 'data-nosnippet') !== undefined || excludedFromSnippets(node.parentNode));

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(join(directory, entry.name)) : [join(directory, entry.name)]));
  return files.flat();
}

const files = await walk('dist');
const publicPaths = new Set(files.map(file => `/${relative('dist', file).replaceAll('\\', '/')}`));
const existingPath = pathname => publicPaths.has(pathname)
  || publicPaths.has(`${pathname.replace(/\/$/, '')}/index.html`);
const pages = [];
let redirects = 0;

for (const file of files.filter(file => file.endsWith('.html'))) {
  const source = await readFile(file, 'utf8');
  const nodes = descendants(parse(source));
  const elements = tag => nodes.filter(node => node.tagName === tag);
  const meta = name => elements('meta').filter(node => attr(node, 'name') === name || attr(node, 'property') === name);
  const value = name => attr(meta(name)[0], 'content');
  const path = `/${relative('dist', file).replaceAll('\\', '/')}`;
  const robots = value('robots') ?? '';
  if (elements('meta').some(node => attr(node, 'http-equiv')?.toLowerCase() === 'refresh')) {
    redirects += 1;
    check(robots.includes('noindex'), `${path}: redirect must stay noindex`);
    continue;
  }

  const title = text(elements('title')[0]);
  const canonical = attr(elements('link').find(node => attr(node, 'rel') === 'canonical'), 'href');
  const indexable = !robots.includes('noindex');
  pages.push({ path, title, description: value('description'), canonical, indexable });

  const isEnglish = path.startsWith('/en/');
  check(attr(elements('html')[0], 'lang') === (isEnglish ? 'en-US' : 'es-ES'), `${path}: incorrect page language`);
  check(elements('title').length === 1 && title.trim(), `${path}: must have one title`);
  check(meta('description').length === 1 && value('description')?.trim(), `${path}: must have one description`);
  check(meta('robots').length === 1 && /\b(index|noindex)\b/.test(robots), `${path}: missing explicit index policy`);
  check(elements('link').filter(node => attr(node, 'rel') === 'canonical').length === 1, `${path}: must have one canonical`);
  check(canonical === value('og:url'), `${path}: canonical and og:url differ`);
  if (path.endsWith('/index.html')) {
    check(canonical === new URL(path.replace(/index\.html$/, ''), origin).href, `${path}: canonical differs from built route`);
  }
  check(value('og:site_name') === 'NainDev', `${path}: Open Graph brand must be NainDev`);
  check(value('og:title') === title && value('twitter:title') === title, `${path}: social titles differ`);
  check(value('og:description') === value('description') && value('twitter:description') === value('description'), `${path}: social descriptions differ`);
  const socialImage = value('og:image');
  check(socialImage?.startsWith(`${origin}/`) && value('twitter:image') === socialImage, `${path}: invalid social image URL`);
  if (socialImage?.startsWith(`${origin}/`)) check(existingPath(new URL(socialImage).pathname), `${path}: missing social image`);
  check(Boolean(value('og:image:alt')) && value('twitter:image:alt') === value('og:image:alt'), `${path}: missing social image description`);

  const scripts = elements('script').filter(node => attr(node, 'type') === 'application/ld+json');
  const graph = [];
  for (const script of scripts) {
    try {
      const schema = JSON.parse(text(script));
      graph.push(...(schema['@graph'] ?? [schema]));
    } catch { check(false, `${path}: invalid JSON-LD`); }
  }
  const website = graph.find(node => node['@type'] === 'WebSite');
  check(website?.name === 'NainDev' && website.url === `${origin}/`, `${path}: missing consistent WebSite identity`);
  const page = graph.find(node => ['WebPage', 'ProfilePage'].includes(node['@type']));
  check(page?.url === canonical && page?.['@id'] === `${canonical}#webpage`, `${path}: missing distinct page entity`);
  const article = graph.find(node => node['@type'] === 'BlogPosting');
  if (/^\/(?:en\/)?blog\//.test(path) && !['/blog/index.html', '/en/blog/index.html'].includes(path)) {
    check(Boolean(article), `${path}: missing BlogPosting`);
    check(article?.mainEntityOfPage?.['@id'] === page?.['@id'] && article?.['@id'] !== page?.['@id'], `${path}: article must refer to a separate WebPage`);
    check(article?.author?.['@id'] === `${origin}/#person` && graph.some(node => node['@id'] === article?.author?.['@id'] && node.name && node.url), `${path}: missing named author`);
    check(elements('time').some(node => attr(node, 'datetime') === article?.datePublished), `${path}: publication date must be visible`);
    check(value('article:published_time') === article?.datePublished, `${path}: publication dates differ`);
  }
  const breadcrumb = graph.find(node => node['@type'] === 'BreadcrumbList');
  for (const item of breadcrumb?.itemListElement ?? []) {
    check(item.item?.startsWith(`${origin}/`) && existingPath(decodeURIComponent(new URL(item.item).pathname)), `${path}: breadcrumb points to missing page ${item.item}`);
  }

  const header = elements('header').find(node => (attr(node, 'class') ?? '').split(' ').includes('site-header'));
  const footer = elements('footer').find(node => (attr(node, 'class') ?? '').split(' ').includes('site-footer'));
  for (const container of [header, footer]) {
    check(Boolean(container), `${path}: missing shared navigation container`);
    if (container) check(descendants(container).filter(node => node.nodeName === '#text' && node.value.trim()).every(excludedFromSnippets), `${path}: navigation boilerplate is eligible for snippets`);
  }
  for (const node of nodes.filter(node => attr(node, 'data-nosnippet') !== undefined)) {
    check(['div', 'span', 'section'].includes(node.tagName), `${path}: unsupported data-nosnippet element`);
  }
  if (indexable) {
    check(robots.includes('max-image-preview:large'), `${path}: large image previews are not enabled`);
    check(elements('h1').length === 1, `${path}: must have one H1`);
    check(!excludedFromSnippets(elements('h1')[0]), `${path}: main heading excluded from snippets`);
    check(nodes.some(node => attr(node, 'id') === 'main-content'), `${path}: broken skip-link target`);
  }
  for (const link of elements('a')) {
    const href = attr(link, 'href');
    if (!href || href.startsWith('#')) continue;
    const target = new URL(href, canonical);
    if (target.origin !== origin) continue;
    check(existingPath(decodeURIComponent(target.pathname)), `${path}: broken internal link ${href}`);
  }
  if (path === '/index.html') {
    check(title.includes('NainDev') && title.includes('Aitor Nain'), 'Home title must identify the brand and author');
    for (const href of ['/servicios/', '/casos/', '/blog/']) {
      check(header && descendants(header).some(node => node.tagName === 'a' && attr(node, 'href') === href), `Header must link to ${href}`);
    }
  }
}

const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const indexablePages = pages.filter(page => page.indexable);
check(urls.length === new Set(urls).size, 'Sitemap contains duplicate URLs');
check(indexablePages.length > 0, 'No indexable pages were generated');
for (const page of pages) {
  check(urls.includes(page.canonical) === page.indexable, `${page.path}: sitemap and robots index policy differ`);
  if (/^\/tecnologia\//.test(page.path) || ['/404.html', '/privacidad/index.html', '/recursos/gracias/index.html'].includes(page.path)) {
    check(!page.indexable, `${page.path}: established noindex policy must be preserved`);
  }
}
for (const url of urls) check(indexablePages.some(page => page.canonical === url), `Sitemap points to a missing or noindex page: ${url}`);
for (const field of ['title', 'description']) {
  const values = indexablePages.map(page => page[field]);
  check(values.length === new Set(values).size, `Indexable pages have duplicate ${field}s`);
}
const robots = await readFile('dist/robots.txt', 'utf8');
check(robots.includes(`Sitemap: ${origin}/sitemap-index.xml`), 'robots.txt must advertise the canonical sitemap');
check(!/^Disallow:\s*\/\s*$/m.test(robots), 'robots.txt blocks the site');
check(!pages.some(page => page.path.includes('template_service')), 'Template service must not be published');

if (failures.length) {
  console.error([...new Set(failures)].join('\n'));
  assert.fail(`${failures.length} SEO contract violations`);
}
console.log(`SEO contract passed: ${pages.length} pages, ${redirects} redirects, ${urls.length} indexable URLs, no broken internal page links.`);
