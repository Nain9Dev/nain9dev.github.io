// Guards for specs/next-projects-route, step 1 (NPR-002): the whole filterable catalog has its own page in both
// languages, built from the same data and the same markup the home uses. Runs after the build.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { englishPath } from './lib/localization.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const projects = JSON.parse(await read('public/assets/data/projects.json'));

test('NPR-002: /proyectos/ and its English twin are built, indexable and listed in the sitemap', async () => {
  for (const file of ['dist/proyectos/index.html', 'dist/en/projects/index.html']) {
    assert.ok(existsSync(join(ROOT, file)), `${file} is built`);
  }
  const sitemap = await read('dist/sitemap-0.xml');
  assert.match(sitemap, /<loc>https:\/\/www\.naindev\.com\/proyectos\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/www\.naindev\.com\/en\/projects\/<\/loc>/);
  assert.equal(englishPath('/proyectos/'), '/en/projects/', 'the hub maps to its English path');
  const page = await read('dist/proyectos/index.html');
  assert.doesNotMatch(page, /name="robots"[^>]*noindex/i, 'the catalog is indexable');
  assert.match(page, /<link rel="canonical" href="https:\/\/www\.naindev\.com\/proyectos\/"/);
  assert.match(page, /hreflang="en"[^>]*href="https:\/\/www\.naindev\.com\/en\/projects\/"/);
});

test('NPR-002: the page lists every catalog project as text without JavaScript and keeps the filters', async () => {
  const page = await read('dist/proyectos/index.html');
  const entries = page.match(/<li><h3>[^<]+<\/h3><p class="catalog-index-status">/g) ?? [];
  assert.equal(entries.length, projects.length, 'one static entry per project');
  for (const project of projects) {
    assert.ok(page.includes(`<h3>${project.title.replaceAll('&', '&amp;')}</h3>`), `${project.id} is listed`);
  }
  assert.match(page, /data-project-toolbar/);
  assert.match(page, /data-project-list/);
  for (const filter of ['all', 'production', 'dotnet', 'python', '3d', 'demo']) {
    assert.match(page, new RegExp(`data-project-filter="${filter}"`), `filter ${filter}`);
  }
  assert.match(page, /<h1[^>]*>[^<]*Proyectos/, 'one H1 names the page');
  assert.equal((page.match(/<h1[\s>]/g) ?? []).length, 1);
});

test('NPR-002: the catalog markup is one component shared by the home and the page', async () => {
  const component = await read('src/components/ProjectCatalog.astro');
  assert.match(component, /data-project-toolbar/);
  assert.match(component, /data-project-list/);
  assert.match(component, /class="catalog-index"/);
  const home = await read('src/components/home/ProjectsSection.astro');
  assert.match(home, /<ProjectCatalog/, 'the home renders the component');
  assert.doesNotMatch(home, /data-project-filter/, 'no duplicated filter markup');
  const page = await read('src/pages/proyectos/index.astro');
  assert.match(page, /<ProjectCatalog/);
  assert.match(page, /import '\.\.\/\.\.\/styles\/inner\.css';/, 'pages import the stylesheet, not the layout (ADR-0017)');
});
