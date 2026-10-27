// Guards for specs/047-inner-pages: services hub and pages, blog index and article.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('IP-001: every published service resolves to a glyph', async () => {
  const component = await read('src/components/ServiceIcon.astro');
  const shapes = [...component.matchAll(/^\s{2}'?([\w-]+)'?: '<(?:path|rect|circle)/gm)].map((m) => m[1]);
  const aliases = [...component.matchAll(/'([^']+)': '([\w-]+)'/g)].map((m) => [m[1], m[2]]);
  assert.ok(shapes.length >= 7, `glyphs: ${shapes.join(', ')}`);
  for (const [, target] of aliases) assert.ok(shapes.includes(target), `alias target ${target} exists`);
  assert.match(component, /aria-hidden="true"/);
  for (const file of await readdir(join(ROOT, 'src/content/servicios'))) {
    if (!file.endsWith('.mdx')) continue;
    const icon = (await read(`src/content/servicios/${file}`)).match(/^icon:\s*"([^"]+)"/m)?.[1];
    if (icon) assert.ok(shapes.includes(icon) || aliases.some(([from]) => from === icon), `${file}: icon "${icon}" resolves`);
  }
});

test('IP-002: the services hub leads each card with its glyph and discloses the intro', async () => {
  const page = await read('src/pages/servicios/index.astro');
  assert.match(page, /import ServiceIcon from '\.\.\/\.\.\/components\/ServiceIcon\.astro'/);
  assert.match(page, /<ServiceIcon name=\{servicio\.data\.icon\} \/>\s*<h3>\{servicio\.data\.title\}<\/h3>/);
  assert.match(page, /<Quiet><p>Soluciones arquitectónicas[\s\S]*?<\/p><\/Quiet>/);
  assert.doesNotMatch(page, /style=/);
  const css = (await read('src/styles/main.css')) + '\n' + (await read('src/styles/inner-pages.css')); // inner-page rules moved (specs/next-case-pages IS-001)
  assert.match(css, /\.service-group \.service-card \{[^}]*min-height: 0;/);
});

test('IP-003: the service page heads the article with glyph and title, no inline style', async () => {
  const page = await read('src/pages/servicios/[categoria].astro');
  assert.match(page, /<header class="service-head">\s*<ServiceIcon name=\{servicio\.data\.icon\} \/>\s*\{servicio\.data\.renderTitle && <h1>/);
  assert.doesNotMatch(page, /style=/);
  const css = (await read('src/styles/main.css')) + '\n' + (await read('src/styles/inner-pages.css')); // inner-page rules moved (specs/next-case-pages IS-001)
  assert.match(css, /\.service-article :is\(p, li, blockquote\) \{\s*max-width: 68ch;/);
});

test('IP-004: blog cards open with a silent numbered cover and disclose the description', async () => {
  const page = await read('src/pages/blog/index.astro');
  assert.match(page, /<Quiet><p>\{post\.data\.description\}<\/p><\/Quiet>/);
  assert.match(page, /button-outline blog-action/, 'VIS-011 kept');
  const css = (await read('src/styles/main.css')) + '\n' + (await read('src/styles/inner-pages.css')); // inner-page rules moved (specs/next-case-pages IS-001)
  assert.match(css, /\.blog-card::before \{[^}]*content: counter\(post, decimal-leading-zero\) \/ "";/);
  assert.match(css, /\.blog-grid \{\s*counter-reset: post;/);
});

test('IP-005: the article page has no inline style and keeps its share row', async () => {
  const page = await read('src/pages/blog/[...slug].astro');
  assert.doesNotMatch(page, /style=/);
  assert.match(page, /<article class="shell section page-top article">/);
  assert.match(page, /<div class="share-buttons" data-reveal>\s*<span class="share-label">Compartir este artículo:<\/span>/);
  const css = (await read('src/styles/main.css')) + '\n' + (await read('src/styles/inner-pages.css')); // inner-page rules moved (specs/next-case-pages IS-001)
  assert.match(css, /\.share-buttons \{[^}]*border-top: 1px solid var\(--color-line\);/);
  assert.match(css, /\.article-byline \{/);
});

test('IP-007: the technology page heads with the stack mark and discloses its intro', async () => {
  const page = await read('src/pages/tecnologia/[tech].astro');
  assert.match(page, /import Quiet from '\.\.\/\.\.\/components\/home\/Quiet\.astro'/);
  assert.match(page, /<div class="section-heading tech-head" data-reveal>\s*<div>\s*\{icon && <img class="tech-icon tech-hero-icon" src=\{icon\} alt="" width="64" height="64" decoding="async" \/>\}\s*<p class="eyebrow">/);
  assert.match(page, /<Quiet><p>Servicios relacionados con \{tech\}\.<\/p><\/Quiet>/);
  assert.doesNotMatch(page, /style=/);
});

test('IP-008 (as revised by HN-004): every catalog row keeps its index in the markup', async () => {
  // The numbered cover band went with the tall cards (specs/049-selected-work); the row shows the index as text.
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /article\.dataset\.index = String\(index \+ 1\)\.padStart\(2, "0"\);/);
  assert.match(view, /createElement\("span", "project-index", String\(index \+ 1\)\.padStart\(2, "0"\)\)/);
  const css = await read('src/styles/main.css');
  assert.doesNotMatch(css, /\.project-card-plain/);
  assert.match(css, /\n\.project-row \{/);
});

test('IP-009: the about links come before the disclosed copy', async () => {
  const css = await read('src/styles/main.css');
  assert.match(css, /\.about-copy \.text-links \{[^}]*order: -1;/);
});
