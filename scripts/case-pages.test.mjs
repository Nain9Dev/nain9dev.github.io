// Guards for specs/050-work-pages: one work page per selected project, and inner-page styles out of main.css.
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
// CRLF folded to LF: a Windows checkout with autocrlf converts the .mdx and .astro sources and the frontmatter pattern missed them.
const read = (file) => readFile(join(ROOT, file), 'utf8').then((text) => text.replace(/\r\n/g, '\n'));
const exists = (file) => access(join(ROOT, file)).then(() => true, () => false);
const OWN_DEMO = /^https:\/\/[a-z0-9-]+\.naindev\.com(?:\/|$)/;
const CASE_WORDING = /\bcasos? de (?:estudio|éxito)\b|\bcase[- ]stud(?:y|ies)\b|\bsuccess (?:story|stories|cases?)\b/i;
const pascal = (id) => id.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join('');

async function selected() {
  const projects = JSON.parse(await read('public/assets/data/projects.json'));
  return projects
    .filter((project) => project.selected && project.links.some((link) => OWN_DEMO.test(link.url)))
    .sort((a, b) => a.order - b.order);
}

async function workEntries() {
  const files = (await readdir(join(ROOT, 'src/content/work')).catch(() => [])).filter((file) => file.endsWith('.mdx'));
  return Promise.all(files.map(async (file) => ({ id: file.replace(/\.mdx$/, ''), source: await read(`src/content/work/${file}`) })));
}

const frontmatter = (source) => Object.fromEntries([...(source.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '').matchAll(/^(\w+):\s*"?(.*?)"?\s*$/gm)].map((m) => [m[1], m[2]]));
const body = (source) => source.replace(/^---\n[\s\S]*?\n---\n/, '').replace(/^import .*$/gm, '');
const prose = (source) => body(source)
  .replace(/<[^>]+>/g, ' ')
  .replace(/^#+\s.*$/gm, ' ')
  .replace(/[*_`>#|-]/g, ' ');
const words = (text) => text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;

test('WK-001: one work entry per selected project, in a work collection', async () => {
  const config = await read('src/content.config.ts');
  assert.match(config, /const work = defineCollection\(\{\s*loader: glob\(\{ pattern: "\*\*\/\*\.mdx", base: "\.\/src\/content\/work" \}\)/);
  assert.match(config, /collections = \{[^}]*\bwork\b/);
  const ids = (await selected()).map((project) => project.id);
  const entries = await workEntries();
  assert.deepEqual(entries.map((entry) => entry.id).sort(), [...ids].sort(), 'work entries match the selected projects');
  for (const entry of entries) assert.equal(frontmatter(entry.source).project, entry.id, `${entry.id}: frontmatter names its project`);
});

test('WK-002: the page reads header, context, architecture, decisions, demo checks, stack and navigation in order', async () => {
  const page = await read('src/pages/trabajo/[id].astro');
  const at = (needle) => { const index = page.indexOf(needle); assert.ok(index >= 0, `page has ${needle}`); return index; };
  assert.ok(at('class="work-head"') < at('class="work-eyebrow"'));
  assert.ok(at('class="work-eyebrow"') < at('<h1'));
  assert.ok(at('<h1') < at('class="work-lead"'));
  assert.ok(at('class="work-lead"') < at('class="work-media"'));
  assert.ok(at('class="work-media"') < at('class="work-links"'));
  assert.ok(at('class="work-links"') < at('<Content'));
  assert.ok(at('<Content') < at('class="work-stack"'));
  assert.ok(at('class="work-stack"') < at('class="work-nav"'));
  assert.match(page, /width="640" height="360"/);
  assert.match(page, /alt=""/);
  assert.match(page, /loading="eager"/);
  assert.match(page, /fetchpriority="high"/);
  assert.match(page, /target="_blank" rel="noopener noreferrer"/);
  assert.match(page, /translate="no"/, 'the stack chips are not translated');
  assert.match(page, /href="\/#selected-work"/);
  assert.match(page, /import '\.\.\/\.\.\/styles\/work\.css'/);
  for (const entry of await workEntries()) {
    const text = body(entry.source);
    const order = ['## Contexto', '<Architecture', '## Decisiones', '## Qué puedes comprobar en la demo'];
    const positions = order.map((needle) => text.indexOf(needle));
    positions.forEach((position, index) => assert.ok(position >= 0, `${entry.id}: ${order[index]}`));
    assert.deepEqual([...positions].sort((a, b) => a - b), positions, `${entry.id}: sections keep their order`);
    const decisions = text.slice(text.indexOf('## Decisiones'), text.indexOf('## Qué puedes comprobar en la demo'));
    const items = decisions.match(/^(?:\d+\.|-)\s+\*\*/gm) ?? [];
    assert.ok(items.length >= 3 && items.length <= 4, `${entry.id}: ${items.length} decisions`);
  }
});

test('WK-003: each page holds between 450 and 900 Spanish words', async () => {
  for (const entry of await workEntries()) {
    const count = words(prose(entry.source) + ' ' + Object.values(frontmatter(entry.source)).join(' '));
    assert.ok(count >= 450 && count <= 900, `${entry.id}: ${count} words`);
  }
});

test('WK-004: one accessible token-coloured diagram per project, with its Mermaid source', async () => {
  const architecture = await read('src/components/work/Architecture.astro');
  assert.match(architecture, /<h2[^>]*>Arquitectura<\/h2>/);
  for (const project of await selected()) {
    const file = `src/components/work/diagrams/${pascal(project.id)}.astro`;
    const svg = await read(file);
    assert.match(svg, /<svg[^>]*role="img"[^>]*aria-labelledby=/, `${file}: labelled image`);
    assert.match(svg, /<title id=/);
    assert.match(svg, /<desc id=/);
    assert.match(svg, /viewBox="0 0 \d+ \d+"/);
    assert.doesNotMatch(svg, /<script|<animate|<set\b/, `${file}: static`);
    assert.doesNotMatch(svg, /#[0-9a-f]{3,8}\b|fill="(?!none|url)|stroke="(?!none)/i, `${file}: no colour literal or presentation colour`);
    assert.match(svg, /class="node/, `${file}: nodes styled by class`);
    assert.match(svg, /data-translate="yes"/, `${file}: labels opt into the English build`);
    assert.ok(await exists(`docs/assets/diagrams/work-${project.id}.mmd`), `${project.id}: Mermaid source`);
  }
  // The diagram rules are shared with the catalog since specs/next-private-diagrams (PD-006).
  const css = await read('src/styles/diagram.css');
  for (const part of ['node', 'label', 'flow', 'arrow']) assert.match(css, new RegExp(`\\.arch-diagram \\.${part} \\{[^}]*var\\(--color-`), `.${part} reads a token colour`);
});

test('WK-006: no case-study wording in the work pages, their components or their styles', async () => {
  const files = ['src/pages/trabajo/[id].astro', 'src/components/work/Architecture.astro', 'src/styles/work.css', ...(await workEntries()).map((entry) => `src/content/work/${entry.id}.mdx`)];
  for (const file of files) assert.doesNotMatch(await read(file), CASE_WORDING, file);
});

test('WK-007: the trabajo hub maps to work in the English build', async () => {
  const lib = await read('scripts/lib/localization.mjs');
  assert.match(lib, /trabajo: 'work'/);
});

test('WK-009: each home case links to its work page from the title and a closing link', async () => {
  const section = await read('src/components/home/SelectedWork.astro');
  assert.match(section, /import \{[^}]*\bworkPath\b[^}]*\} from '\.\.\/\.\.\/utils\/projects'/);
  assert.match(section, /<h3 class="case-title"><a href=\{workPath\(project\.id\)\}>\{project\.title\}<\/a><\/h3>/);
  const links = section.slice(section.indexOf('class="case-links"'));
  assert.ok(links.indexOf('project.links.map') < links.indexOf('Cómo está hecho'), 'the work link closes the row');
  assert.match(links, /<a class="card-link" href=\{workPath\(project\.id\)\}>Cómo está hecho/);
});

test('WK-012: no navigation entry; the bare hub redirects to the home section', async () => {
  for (const file of ['src/components/Header.astro', 'src/components/Footer.astro']) assert.doesNotMatch(await read(file), /href="\/trabajo/, `${file} has no work entry`);
  const config = await read('astro.config.mjs');
  const hubPage = await exists('src/pages/trabajo/index.astro');
  assert.ok(/'\/trabajo': '\/#selected-work'/.test(config) || hubPage, 'the bare /trabajo/ URL is a redirect');
});

test('IS-001: inner-page styles live in their own stylesheet, imported by every inner page after the site styles', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.doesNotMatch(layout, /import '\.\.\/styles\//, 'the layout imports no stylesheet: page order decides the cascade');
  assert.match(await read('src/styles/site.css'), /@import '\.\/main\.css';\s*@import '\.\/terminal\.css';\s*@import '\.\/locales\.css';/);
  assert.match(await read('src/styles/inner.css'), /@import '\.\/site\.css';\s*@import '\.\/inner-pages\.css';/);
  assert.match(await read('src/pages/index.astro'), /import '\.\.\/styles\/site\.css'/);
  assert.doesNotMatch(await read('src/pages/index.astro'), /inner(?:-pages)?\.css|work\.css/);
  const sheet = await read('src/styles/inner-pages.css');
  assert.ok(sheet.length > 1000, 'the stylesheet holds the moved rules');
  const main = await read('src/styles/main.css');
  for (const selector of ['.page-top', '.blog-card', '.case-study-card', '.service-head', '.thanks-card', '.article-byline', '.tech-link-card']) {
    assert.match(sheet, new RegExp(`\\n${selector.replace('.', '\\.')} \\{`), `${selector} rule moved`);
    assert.doesNotMatch(main, new RegExp(`\\n${selector.replace('.', '\\.')} \\{`), `${selector} rule left main.css`);
  }
  for (const selector of ['.error-page', '.error-panel', '.project-grid-container', '.tech-badge-small', '.service-hero']) {
    assert.doesNotMatch(main + sheet, new RegExp(`\\n${selector.replace('.', '\\.')}[ ,{]`), `${selector} dead rule removed`);
  }
  const pages = [];
  async function walk(dir) {
    for (const entry of await readdir(join(ROOT, dir), { withFileTypes: true })) {
      if (entry.isDirectory()) await walk(`${dir}/${entry.name}`);
      else if (entry.name.endsWith('.astro')) pages.push(`${dir}/${entry.name}`);
    }
  }
  await walk('src/pages');
  for (const page of pages) {
    if (page === 'src/pages/index.astro') continue;
    assert.match(await read(page), /import '(?:\.\.\/)+styles\/inner\.css'/, `${page} imports the inner stylesheet`);
  }
});

test('IS-004: the new stylesheets read tokens and name their transitions', async () => {
  for (const file of ['src/styles/inner-pages.css', 'src/styles/work.css']) {
    const css = await read(file);
    assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i, `${file}: no colour literal`);
    assert.doesNotMatch(css, /transition:\s*all/, file);
  }
});
