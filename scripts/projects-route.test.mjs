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
  const shown = projects.filter((project) => !project.bridge); // the bridged 3D projects stand behind one row (NPR-003)
  assert.equal(entries.length, shown.length, 'one static entry per project');
  for (const project of shown) {
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

test('NPR-002: the catalog markup is one component, rendered by the catalog page only (DF-033)', async () => {
  const component = await read('src/components/ProjectCatalog.astro');
  assert.match(component, /data-project-toolbar/);
  assert.match(component, /data-project-list/);
  assert.match(component, /class="catalog-index"/);
  const home = await read('src/components/home/ProjectsSection.astro');
  assert.doesNotMatch(home, /<ProjectCatalog|data-project-filter/, 'the home renders no catalog rows');
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

test('NPR-001 (superseded by DF-033): the home shows one visual gate to the catalog and no project rows', async () => {
  for (const [file, hub] of [['dist/index.html', '/proyectos/'], ['dist/en/index.html', '/en/projects/']]) {
    const home = await read(file);
    const section = home.match(/<section[^>]*id="projects"[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.doesNotMatch(section, /<li><h3>|data-project-list|data-project-filter|data-project-toolbar/, `${file}: no catalog rows or filters on the home`);
    assert.equal((section.match(/class="catalog-gate"/g) ?? []).length, 1, `${file}: one gate`);
    assert.ok(section.includes(`href="${hub}"`), `${file}: links the catalog page`);
    assert.equal((section.match(/<img /g) ?? []).length, 6, `${file}: six capture tiles`);
  }
});

test('NPR-001 (superseded by DF-033): the client renderer and the component no longer carry a selection mode', async () => {
  for (const file of ['src/scripts/home-catalog.js', 'src/scripts/app.js', 'src/components/ProjectCatalog.astro']) {
    assert.doesNotMatch(await read(file), /data-project-selection|selection/, file);
  }
});

// Step 3a (NPR-005 to NPR-007): the products band promotes DSE and Contrast Viewer and names Contrast Hub.
test('NPR-005: the products band follows the catalog, links DSE, the Viewer site and the studio', async () => {
  const source = await read('src/components/home/ProductsBand.astro');
  assert.doesNotMatch(source, /viewerSiteLive/, 'the viewer link is permanent (OQ-018)');
  for (const [file, studio] of [['dist/index.html', 'Contrast3D'], ['dist/en/index.html', 'Contrast3D']]) {
    const home = await read(file);
    const band = home.match(/<section[^>]*id="products"[\s\S]*?<\/section>/)?.[0] ?? '';
    assert.equal((band.match(/<article class="service-card"/g) ?? []).length, 3, `${file}: DSE, Contrast Viewer and Contrast Hub`);
    assert.ok(band.includes('href="https://datumstatutum.com/"'), `${file}: DSE link`);
    assert.ok(band.includes('href="https://www.contrast3d.com/"') && band.includes(studio), `${file}: studio credit`);
    assert.ok(band.includes('href="https://viewer.contrast3dhub.com/"'), `${file}: Viewer site link`);
    assert.ok(home.indexOf('id="projects"') < home.indexOf('id="products"') && home.indexOf('id="products"') < home.indexOf('id="open-ecosystem"'), `${file}: after the projects, before the open ecosystem`);
  }
});

test('NPR-005: no page links the gated viewer app or any Contrast Hub host except the public Viewer site', async () => {
  const otherHub = (text) => text.replaceAll('viewer.contrast3dhub.com', '');
  for (const file of ['dist/index.html', 'dist/en/index.html', 'dist/proyectos/index.html']) {
    assert.doesNotMatch(otherHub(await read(file)), /contrast3dhub\.com/i, file);
  }
  for (const file of ['src/components/home/ProductsBand.astro', 'public/assets/data/projects.json']) {
    assert.doesNotMatch(otherHub(await read(file)), /contrast3dhub\.com/i, file);
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

// Step 3b (NPR-003, NPR-004, NPR-006): the 3D projects leave the catalog and become one bridge row.
const BRIDGED = [
  'conformance-architecture',
  'interactive-3d-viewer',
  'nain3d-conformance-gateway',
  'nain-mcp-validator',
  'parametricad-ai',
  'orbe-runner-3d',
  'pong-arcade',
];
const BRIDGE_ROW = 'contrast3d-products';
const shownInCatalog = projects.filter((project) => !project.bridge);

test('NPR-003: the seven 3D projects are marked as bridged and one row stands for them', () => {
  assert.deepEqual(projects.filter((project) => project.bridge === true).map((project) => project.id).sort(), [...BRIDGED].sort());
  const row = projects.find((project) => project.id === BRIDGE_ROW);
  assert.ok(row && !row.bridge, 'the bridge row exists and is itself shown');
  assert.ok(row.links.some((link) => link.url === 'https://datumstatutum.com/'), 'it links DSE');
  assert.ok(row.links.every((link) => !/contrast3dhub\.com/i.test(link.url)), 'and never the gated app host');
  assert.ok(projects.some((project) => project.id === 'nainconfigurator') && !projects.find((project) => project.id === 'nainconfigurator').bridge, 'the two application projects with a 3D tag stay');
  assert.ok(!projects.find((project) => project.id === 'driving-exam-simulator').bridge);
});

test('NPR-003: the catalog page and the client renderer leave the bridged projects out', async () => {
  const page = await read('dist/proyectos/index.html');
  for (const id of BRIDGED) {
    const title = projects.find((project) => project.id === id).title.replaceAll('&', '&amp;');
    assert.ok(!page.includes(`<h3>${title}</h3>`), `${id} is not in the static index`);
  }
  assert.ok(page.includes(`<h3>${projects.find((project) => project.id === BRIDGE_ROW).title}</h3>`), 'the bridge row is');
  assert.equal((page.match(/<li><h3>/g) ?? []).length, shownInCatalog.length);
  assert.ok(page.includes(`<span translate="no">${shownInCatalog.length}</span> proyectos<`), 'the dimension counts what is shown');
  assert.match(await read('src/scripts/home-catalog.js'), /\.bridge/, 'the client renderer filters them too');
});

test('NPR-004 (as revised by DF-038): the 3D pages that were indexed still answer, the two case pages redirect to the products band', async () => {
  const sitemap = await read('dist/sitemap-0.xml');
  assert.ok(sitemap.includes('https://www.naindev.com/servicios/validacion-3d/'), 'the 3D service stays in the sitemap');
  assert.ok(existsSync(join(ROOT, 'dist/servicios/validacion-3d/index.html')), 'the 3D service is built');
  for (const [path, target] of [
    ['/trabajo/nain3d-conformance-gateway/', '/#products'],
    ['/trabajo/parametricad-ai/', '/#products'],
    ['/en/work/nain3d-conformance-gateway/', '/en/#products'],
    ['/en/work/parametricad-ai/', '/en/#products'],
  ]) {
    assert.ok(existsSync(join(ROOT, `dist${path}index.html`)), `${path} still answers`);
    assert.match(await read(`dist${path}index.html`), new RegExp(`http-equiv="refresh" content="0;url=${target}"`), `${path} lands on the products band`);
    assert.ok(!sitemap.includes(`https://www.naindev.com${path}`), `${path} left the sitemap`);
  }
  assert.ok(!existsSync(join(ROOT, 'src/content/work/nain3d-conformance-gateway.mdx')) && !existsSync(join(ROOT, 'src/content/work/parametricad-ai.mdx')), 'the two work entries are removed');
});

test('NPR-006: the hero and the services card describe NainDev\'s architecture and point to DSE', async () => {
  const hero = await read('src/components/home/Hero.astro');
  assert.ok(hero.includes('Producto completo en Python y .NET, con IA bajo revisión humana y conformidad determinista de productos, hoy aplicada a modelos 3D en DSE.'));
  const services = await read('src/components/home/ServicesSection.astro');
  assert.ok(services.includes('Arquitectura multidominio que valida cada producto contra especificaciones versionadas. Su primer producto es DSE, para modelos 3D.'));
  assert.doesNotMatch(hero, /su primer dominio son los modelos 3D/i, 'the old hero sentence is gone');
});

test('DF-036: every catalog row leads with a decorative capture or technology mark and keeps its text', async () => {
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /function createCapture\(project\)/);
  assert.match(view, /setAttribute\("aria-hidden", "true"\)/);
  assert.match(view, /replace\(\/\\\.webp\$\/, "-400\.webp"\)/, 'rows load the small capture variant');
  assert.match(view, /image\.alt = "";/);
  assert.match(view, /image\.loading = "lazy";/);
  assert.match(view, /article\.append\(createCapture\(project\), body\);/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.project-capture \{[^}]*aspect-ratio: 16 \/ 10;/);
  assert.match(css, /\.project-row \{[^}]*grid-template-columns: 6\.5rem minmax\(0, 1fr\);/);
  const page = await read('dist/proyectos/index.html');
  assert.equal((page.match(/<ul class="catalog-index"[\s\S]*?<\/ul>/)?.[0].match(/<li>/g) ?? []).length, projects.filter((project) => !project.bridge).length, 'the static index still lists every project as text');
});
