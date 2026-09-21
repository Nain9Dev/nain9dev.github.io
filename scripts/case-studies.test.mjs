// Contract for specs/007-remove-case-studies. Runs against the built dist/.
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { relative } from 'node:path';
import { parse } from 'parse5';
import { walk } from './sync-translations.mjs';
import { origin, attr, descendants, englishPath } from './lib/localization.mjs';

const root = 'dist';
const serviceHub = '/servicios/';
const validation = '/servicios/validacion-3d/';
const performance = '/servicios/optimizacion-rendimiento-apirest-dotnet/';

// Retired Spanish route -> Spanish redirect target; English pairs are derived with englishPath().
const REDIRECTS = {
  '/casos/': serviceHub,
  '/casos/stealth-3d-ai/': validation,
  '/casos/stealth-3d-ai.html/': validation,
  '/casos/optimizacion-saas/': performance,
  '/casos/optimizacion-saas.html/': performance,
  '/tecnologia/ONNX/': validation,
  '/tecnologia/Kubernetes/': performance,
  '/tecnologia/.NET Core/': performance,
};

const CASE_LINK = /^(?:https:\/\/www\.naindev\.com)?\/(?:en\/case-studies|casos)(?:[/.?#]|$)/i;
const CASE_WORDING = /\bcasos? de (?:estudio|éxito)\b|\bcase[- ]stud(?:y|ies)\b|\bsuccess (?:story|stories|cases?)\b/i;

const load = async file => descendants(parse(await readFile(file, 'utf8'), { scriptingEnabled: false }));
const isRedirect = nodes => nodes.some(node => attr(node, 'http-equiv')?.toLowerCase() === 'refresh');
const text = node => node.nodeName === '#text' ? node.value
  : ['script', 'style', 'pre', 'code'].includes(node.tagName) ? '' : (node.childNodes ?? []).map(text).join(' ');
const htmlFiles = async () => (await walk(root)).filter(file => file.endsWith('.html'));
const route = file => `/${relative(root, file).replaceAll('\\', '/')}`;
const exists = path => access(path).then(() => true, () => false);

async function contentPage(pathname) {
  const file = `${root}${decodeURI(pathname)}index.html`;
  assert.ok(await exists(file), `missing target page ${pathname}`);
  assert.ok(!isRedirect(await load(file)), `target ${pathname} must be a content page`);
}

test('CASE-001: no case-study page or listing is published in any locale', async () => {
  const pages = [];
  for (const file of await htmlFiles()) {
    const path = route(file);
    if (!/^\/(?:casos|en\/case-studies)\//.test(path)) continue;
    if (!isRedirect(await load(file))) pages.push(path);
  }
  assert.deepEqual(pages, []);
});

test('CASE-002 and CASE-003: built pages carry no case-study links or wording', async () => {
  const findings = [];
  for (const file of await htmlFiles()) {
    const nodes = await load(file);
    if (isRedirect(nodes)) continue;
    const path = route(file);
    for (const node of nodes) {
      const href = attr(node, 'href');
      if (href && CASE_LINK.test(href)) findings.push(`${path}: link ${href}`);
    }
    const body = nodes.find(node => node.tagName === 'body');
    const match = body && text(body).match(CASE_WORDING);
    if (match) findings.push(`${path}: wording "${match[0]}"`);
  }
  assert.deepEqual(findings, []);
});

test('CASE-003: home pages have no case-study section or client script', async () => {
  for (const file of [`${root}/index.html`, `${root}/en/index.html`]) {
    const source = await readFile(file, 'utf8');
    assert.doesNotMatch(source, /id="case-studies/, file);
    assert.doesNotMatch(source, /case-studies-grid/, file);
  }
  const app = await readFile(`${root}/assets/js/app.js`, 'utf8');
  assert.doesNotMatch(app, /case-studies\.js|CaseStudies/);
  assert.equal(await exists(`${root}/assets/js/case-studies.js`), false);
});

test('CASE-004 and CASE-005: retired URLs redirect to related pages in both locales', async () => {
  for (const [retired, target] of Object.entries(REDIRECTS)) {
    for (const [from, to] of [[retired, target], [englishPath(retired), englishPath(target)]]) {
      const file = `${root}${decodeURI(from)}index.html`;
      assert.ok(await exists(file), `missing redirect document for ${from}`);
      const nodes = await load(file);
      const refresh = nodes.find(node => attr(node, 'http-equiv')?.toLowerCase() === 'refresh');
      assert.ok(refresh, `${from} must be a redirect document`);
      assert.equal(attr(refresh, 'content').replace(/^\d+;\s*url=/i, ''), to, `${from} refresh target`);
      const canonical = nodes.find(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
      assert.equal(attr(canonical, 'href'), new URL(to, origin).href, `${from} canonical`);
      const robots = nodes.find(node => node.tagName === 'meta' && attr(node, 'name') === 'robots');
      assert.match(attr(robots, 'content') ?? '', /noindex/, `${from} must stay noindex`);
      await contentPage(to);
    }
  }
});

test('CASE-006: terminal commands and runtime data contain no case-study link', async () => {
  const files = (await walk(`${root}/assets/data`)).concat(await walk(`${root}/en/assets/data`));
  for (const file of files.filter(file => file.endsWith('.json'))) {
    assert.doesNotMatch(await readFile(file, 'utf8'), /\/casos\/|\/case-studies\/|case-studies\.json/, file);
  }
  assert.equal(await exists(`${root}/assets/data/case-studies.json`), false);
});

test('CASE-007: the sitemap lists no case-study URL', async () => {
  const sitemap = await readFile(`${root}/sitemap-0.xml`, 'utf8');
  assert.doesNotMatch(sitemap, /\/casos\/|\/case-studies\//);
});
