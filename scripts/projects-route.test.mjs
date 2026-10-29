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

// Step 2 (NPR-001): the home shows six software projects and links to the catalog page.
const SELECTION = [
  'collaborative-crm',
  'financial-management-api',
  'nain-legacy-modernizer',
  'nainorder-ecommerce-api',
  'notification-worker',
  'driving-school-management',
];

test('NPR-001: exactly six projects carry a featured order, and they are the six the owner chose', () => {
  const ordered = projects.filter((project) => project.featuredOrder !== undefined)
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
  assert.deepEqual(ordered.map((project) => project.featuredOrder), [1, 2, 3, 4, 5, 6]);
  assert.deepEqual(ordered.map((project) => project.id), SELECTION);
});

test('NPR-001: the home lists the six in order without filters and links to /proyectos/', async () => {
  for (const [file, hub] of [['dist/index.html', '/proyectos/'], ['dist/en/index.html', '/en/projects/']]) {
    const home = await read(file);
    const section = home.match(/<section[^>]*id="projects"[\s\S]*?<\/section>/)?.[0] ?? '';
    const titles = [...section.matchAll(/<li><h3>([^<]+)<\/h3>/g)];
    assert.equal(titles.length, 6, `${file}: six static entries`);
    assert.match(section, /data-project-selection/, `${file}: the grid is marked as a selection`);
    assert.doesNotMatch(section, /data-project-filter|data-project-toolbar/, `${file}: no filter bar on the home`);
    assert.ok(section.includes(`href="${hub}"`), `${file}: links the catalog page`);
  }
  const spanish = await read('dist/index.html');
  const order = [...spanish.matchAll(/<li><h3>([^<]+)<\/h3>/g)].map((match) => match[1]);
  const expected = SELECTION.map((id) => projects.find((project) => project.id === id).title);
  assert.deepEqual(order.slice(0, 6), expected, 'the static order follows the featured order');
});

test('NPR-001: the client renderer shows only the selection when the grid says so', async () => {
  const catalog = await read('src/scripts/home-catalog.js');
  assert.match(catalog, /selection/);
  assert.match(catalog, /featuredOrder/);
  const app = await read('src/scripts/app.js');
  assert.match(app, /data-project-selection/);
  const component = await read('src/components/ProjectCatalog.astro');
  assert.match(component, /selection/);
});

// Step 3a (NPR-005 to NPR-007): the products band promotes DSE and Contrast Viewer and names Contrast Hub.
test('NPR-005: the products band follows the catalog, links DSE and the studio, and shows no viewer link before its site exists', async () => {
  const source = await read('src/components/home/ProductsBand.astro');
  assert.match(source, /const viewerSiteLive = false;/, 'the viewer link waits for viewer.contrast3d.com (B-022)');
  for (const [file, studio] of [['dist/index.html', 'Contrast3D'], ['dist/en/index.html', 'Contrast3D']]) {
    const home = await read(file);
    const band = home.match(/<section[^>]*id="products"[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.equal((band.match(/<article class="service-card"/g) ?? []).length, 3, `${file}: DSE, Contrast Viewer and Contrast Hub`);
    assert.ok(band.includes('href="https://datumstatutum.com/"'), `${file}: DSE link`);
    assert.ok(band.includes('href="https://www.contrast3d.com/"') && band.includes(studio), `${file}: studio credit`);
    assert.ok(!band.includes('viewer.contrast3d.com'), `${file}: no viewer link yet`);
    assert.ok(home.indexOf('id="projects"') < home.indexOf('id="products"') && home.indexOf('id="products"') < home.indexOf('id="open-ecosystem"'), `${file}: after the projects, before the open ecosystem`);
  }
});

test('NPR-005: no page links the gated viewer app or any Contrast Hub host', async () => {
  for (const file of ['dist/index.html', 'dist/en/index.html', 'dist/proyectos/index.html']) {
    assert.doesNotMatch(await read(file), /contrast3dhub\.com/i, file);
  }
  for (const file of ['src/components/home/ProductsBand.astro', 'public/assets/data/projects.json']) {
    assert.doesNotMatch(await read(file), /contrast3dhub\.com/i, file);
  }
});

test('NPR-006: the band keeps the copy rules of the products (no certification claim, no price, no AI claim, no client)', async () => {
  const home = await read('dist/index.html');
  const band = home.match(/<section[^>]*id="products"[\s\S]*?<\/section>/)?.[0] ?? '';
  const text = band.replace(/<[^>]+>/g, ' ');
  assert.doesNotMatch(text, /certific|estándar|inteligencia artificial|€|\$|\bprecio/i);
  assert.doesNotMatch(text, /\bIA\b/, 'no AI claim (case sensitive: "propia" ends in "ia")');
  assert.match(text, /Contrast Hub[\s\S]*privad/, 'the Hub is named only as private software');
});
