// Guards for specs/next-private-diagrams: an anonymized architecture diagram for every private project in
// production, fetched into the catalog row when its disclosure opens, on the shared diagram stylesheet.
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { findBlockedClaims } from './check-claims.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8').then((text) => text.replace(/\r\n/g, '\n'));
const exists = (file) => access(join(ROOT, file)).then(() => true, () => false);
const IN_PRODUCTION = /^Privado · En producción/;
const CLASSES = ['node', 'node-accent', 'label', 'label-soft', 'flow', 'flow-accent', 'arrow', 'arrow-accent'];

const projects = async () => JSON.parse(await read('public/assets/data/projects.json'));
const withDiagram = async () => (await projects()).filter((project) => project.private && IN_PRODUCTION.test(project.status));
const textOf = (svg) => [...svg.matchAll(/>([^<]+)</g)].map((m) => m[1].trim()).filter(Boolean).join('\n');

test('PD-001: every private project in production carries a diagram file, and no other project does', async () => {
  const all = await projects();
  const scoped = all.filter((project) => project.private && IN_PRODUCTION.test(project.status));
  assert.ok(scoped.length >= 3, 'three private projects in production are expected');
  for (const project of scoped) {
    assert.equal(project.diagram, `/assets/diagrams/${project.id}.svg`, `${project.id} diagram path`);
    assert.ok(await exists(`public${project.diagram}`), `${project.id} diagram file exists`);
    assert.equal(project.links.length, 0, `${project.id} stays without links (PRJ-002)`);
  }
  for (const project of all.filter((project) => !scoped.includes(project))) {
    assert.equal(project.diagram, undefined, `${project.id} carries no diagram`);
  }
  assert.match(await read('src/utils/projects.ts'), /diagram\?: string;/);
});

test('PD-002: each diagram is a hand-authored accessible SVG on token classes with a Mermaid source', async () => {
  const prefixes = new Set();
  for (const project of await withDiagram()) {
    const svg = await read(`public${project.diagram}`);
    assert.match(svg, /^<svg [^>]*viewBox="0 0 720 320"/, `${project.id} viewBox`);
    assert.match(svg, /<svg [^>]*role="img"/, `${project.id} role`);
    assert.match(svg, /<svg [^>]*data-translate="yes"/, `${project.id} opts in to translation`);
    const labelled = svg.match(/aria-labelledby="([\w-]+) ([\w-]+)"/);
    assert.ok(labelled, `${project.id} aria-labelledby names title and desc`);
    assert.match(svg, new RegExp(`<title id="${labelled[1]}">[^<]{8,}</title>`), `${project.id} title`);
    assert.match(svg, new RegExp(`<desc id="${labelled[2]}">[^<]{40,}</desc>`), `${project.id} desc`);
    assert.doesNotMatch(svg, /(?:fill|stroke)="#|style=|<script|<animate|<set\b|xlink:href/, `${project.id} colours only through classes, no script or animation`);
    for (const part of ['node', 'label', 'label-soft', 'flow', 'arrow']) assert.match(svg, new RegExp(`class="${part}[ "]`), `${project.id} uses .${part}`);
    const classes = [...svg.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/));
    for (const name of classes) assert.ok(CLASSES.includes(name), `${project.id} unknown class ${name}`);
    const ids = [...svg.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.ok(ids.length >= 4, `${project.id} has title, desc and marker ids`);
    const prefix = ids[0].split('-')[0];
    assert.ok(ids.every((id) => id.startsWith(`${prefix}-`)), `${project.id} ids share the prefix ${prefix}-`);
    assert.ok(!prefixes.has(prefix), `${project.id} prefix ${prefix} is unique`);
    prefixes.add(prefix);
    assert.ok(await exists(`docs/assets/diagrams/project-${project.id}.mmd`), `${project.id} Mermaid source`);
    assert.match(await read(`docs/assets/diagrams/project-${project.id}.mmd`), /^flowchart /m);
  }
});

test('PD-003: diagram text carries no blocked claim, percentage or currency, and the claim check scans the files', async () => {
  for (const project of await withDiagram()) {
    const svg = await read(`public${project.diagram}`);
    assert.deepEqual(findBlockedClaims(svg), [], `${project.id} blocked claims`);
    assert.doesNotMatch(textOf(svg), /%|€|\$/, `${project.id} no percentage or currency`);
  }
  const claims = await read('scripts/check-claims.mjs');
  assert.match(claims, /'public\/assets\/diagrams'/);
  assert.match(claims, /\\\.\(astro\|mdx\?\|html\|json\|svg\)\$/);
});

test('PD-004: the catalog row fetches the diagram into a focusable figure the first time its disclosure opens', async () => {
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /project\.diagram/);
  assert.match(view, /if \(project\.diagram\) \{\s*detail\.firstChild\.textContent = message\('projectDetailDiagram'\)/);
  assert.match(view, /message\('projectDiagram'\)/);
  assert.match(view, /"arch-diagram project-diagram"/);
  assert.match(view, /tabIndex = 0|tabindex", "0"/);
  assert.match(view, /addEventListener\("toggle"/);
  assert.match(view, /fetch\(assetUrl\(project\.diagram\)/);
  assert.match(view, /figure\.remove\(\)/, 'a failed fetch removes the figure');
  const locale = await read('src/scripts/locale.js');
  assert.match(locale, /export function assetUrl\(path\)/);
  assert.match(locale, /return assetUrl\(`\/assets\/data\/\$\{file\}`\)/, 'dataUrl reuses assetUrl');
  const runtime = JSON.parse(await read('src/i18n/runtime.json'));
  assert.equal(runtime.projectDetailDiagram, 'Ver arquitectura y detalle');
  assert.match(runtime.projectDiagram, /^Diagrama de arquitectura/);
});

test('PD-005: the localization pipeline covers the diagram files', async () => {
  assert.match(await read('scripts/sync-translations.mjs'), /public\/assets\/diagrams/);
  assert.match(await read('scripts/build-locales.mjs'), /en\/assets\/diagrams\//);
  assert.match(await read('scripts/check-locales.mjs'), /assets\/diagrams/);
});

test('PD-006: the diagram rules live in a shared stylesheet imported by site.css and used by the work pages', async () => {
  const css = await read('src/styles/diagram.css');
  for (const part of ['node', 'label', 'flow', 'arrow']) assert.match(css, new RegExp(`\\.arch-diagram \\.${part} \\{[^}]*var\\(--color-`), `.${part} reads a token colour`);
  assert.match(css, /\.arch-diagram svg \{[^}]*min-width: 40rem/);
  assert.match(css, /\.arch-diagram:focus-visible/);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|transition: all/i);
  assert.match(await read('src/styles/site.css'), /@import '\.\/diagram\.css';/);
  assert.doesNotMatch(await read('src/styles/work.css'), /\.work-diagram|\.arch-diagram[ :]/, 'work.css holds no diagram rule');
  assert.match(await read('src/components/work/Architecture.astro'), /<figure class="arch-diagram"/);
  assert.doesNotMatch(await read('src/styles/main.css'), /\.arch-diagram|\.work-diagram/);
  assert.match(await read('package.json'), /scripts\/private-diagrams\.test\.mjs/);
});
