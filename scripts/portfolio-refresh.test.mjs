import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Live demos, Nain3D and catalog structured data. See specs/next-portfolio-refresh.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const readJson = async (file) => JSON.parse(await read(file));
const urlsOf = (project) => project.links.map((link) => link.url);

test('PRJ-020: public demos use the naindev.com subdomains', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const byId = Object.fromEntries(projects.map((project) => [project.id, project]));
  assert.ok(urlsOf(byId['nainorder-ecommerce-api']).includes('https://order.naindev.com/'));
  assert.ok(urlsOf(byId['financial-management-api']).includes('https://policy.naindev.com/'));
  assert.ok(urlsOf(byId['driving-school-management']).includes('https://drive.naindev.com/'));
  const raw = JSON.stringify(projects);
  assert.doesNotMatch(raw, /onrender\.com|azurewebsites\.net|streamlit\.app/);
});

test('PRJ-021: Nain3D is listed after ParametriCAD AI with its demo and repository', async () => {
  const projects = (await readJson('public/assets/data/projects.json')).sort((a, b) => a.order - b.order);
  const index = projects.findIndex((project) => project.id === 'nain3d-conformance-gateway');
  assert.equal(index, 4);
  assert.equal(projects[3].id, 'parametricad-ai');
  const nain3d = projects[index];
  assert.deepEqual(urlsOf(nain3d), ['https://3d.naindev.com/', 'https://github.com/Nain9Dev/Nain3D']);
  assert.ok(!nain3d.categories.includes('production'));
  assert.ok(!nain3d.private);
  const copy = [nain3d.title, nain3d.status, nain3d.summary, nain3d.proof].join(' ');
  assert.doesNotMatch(copy, /\b(showroom|configurador|visor)\b/i);
});

test('PRJ-022: NainNotify links its live demo and orders stay sequential', async () => {
  const projects = (await readJson('public/assets/data/projects.json')).sort((a, b) => a.order - b.order);
  const notify = projects.find((project) => project.id === 'notification-worker');
  assert.ok(urlsOf(notify).includes('https://notify.naindev.com/'));
  assert.deepEqual(projects.map((project) => project.order), projects.map((_, index) => index));
});

test('PRJ-023: NainProspect and NainWrite are public catalog entries', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const prospect = projects.find((project) => project.id === 'b2b-prospecting-pipeline');
  const write = projects.find((project) => project.id === 'local-rewriting-agent');
  assert.deepEqual(urlsOf(prospect), ['https://github.com/Nain9Dev/NainProspect']);
  assert.deepEqual(urlsOf(write), ['https://github.com/Nain9Dev/NainWrite']);
  assert.ok(!prospect.private && !write.private);
  assert.equal(projects.filter((project) => project.private).length, 6);
});

test('VIS-003: every live demo has a small lazy-loaded thumbnail on its card', async () => {
  const projects = await readJson('public/assets/data/projects.json');
  const live = projects.filter((project) => project.links.some((link) => /^https:\/\/[a-z0-9-]+\.naindev\.com(\/|$)/.test(link.url)));
  assert.equal(live.length, 9);
  for (const project of live) {
    assert.equal(project.thumbnail, `/assets/images/demos/${project.id}.webp`);
    const { size } = await stat(join(ROOT, 'public', project.thumbnail));
    assert.ok(size > 1000 && size < 30000, `${project.id} thumbnail weighs ${size} bytes`);
  }
  assert.ok(projects.filter((project) => project.private).every((project) => !project.thumbnail));
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /project\.thumbnail/);
  assert.match(view, /loading = "lazy"/);
  assert.match(view, /width = 640/);
});

test('VIS-001 and VIS-002: the home page shows a static live-demos strip', async () => {
  const home = await read('src/pages/index.astro');
  assert.match(home, /import LiveDemos from '\.\.\/components\/home\/LiveDemos\.astro'/);
  assert.ok(home.indexOf('<ProofStrip />') < home.indexOf('<LiveDemos />'));
  assert.ok(home.indexOf('<LiveDemos />') < home.indexOf('<ServicesSection />'));
  const strip = await read('src/components/home/LiveDemos.astro');
  assert.match(strip, /projects\.json/);
  assert.match(strip, /naindev\\\.com/);
  assert.match(strip, /rel="noopener noreferrer"/);
  assert.match(strip, /translate="no"/);
  assert.doesNotMatch(strip, /<script|<iframe/);
});

test('SEO-020: the home JSON-LD lists the catalog projects as an ItemList', async () => {
  const seo = await read('src/components/SEO.astro');
  assert.match(seo, /"@type": "ItemList"/);
  assert.match(seo, /projects\.json/);
  assert.match(seo, /isHome/);
});
