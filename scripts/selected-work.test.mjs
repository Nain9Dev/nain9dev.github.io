// Guards for specs/049-selected-work: four cases told as a story after the hero, and the home narrative order.
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const HOME = 'src/components/home/';
const OWN_DEMO = /^https:\/\/[a-z0-9-]+\.naindev\.com(?:\/|$)/;
const missing = (file) => assert.rejects(access(join(ROOT, file)), { code: 'ENOENT' }, `${file} is deleted`);

async function featuredCases() {
  const projects = JSON.parse(await read('public/assets/data/projects.json'));
  return projects
    .filter((project) => project.selected && project.links.some((link) => OWN_DEMO.test(link.url)))
    .sort((a, b) => a.order - b.order);
}

test('SW-001: the selected work follows the hero and shows the featured projects with an own demo', async () => {
  const home = await read('src/pages/index.astro');
  assert.match(home, /import SelectedWork from '\.\.\/components\/home\/SelectedWork\.astro'/);
  assert.ok(home.indexOf('<Hero />') < home.indexOf('<SelectedWork />'));
  assert.ok(home.indexOf('<SelectedWork />') < home.indexOf('<ServicesSection>'));
  const section = await read(`${HOME}SelectedWork.astro`);
  assert.match(section, /id="selected-work"/);
  assert.match(section, /<h2[^>]*>Trabajo seleccionado<\/h2>/);
  assert.match(section, /project\.selected/);
  assert.match(section, /isOwnDemo/);
  assert.match(section, /\.sort\(\(a, b\) => a\.project\.order - b\.project\.order\)/);
  assert.doesNotMatch(section, /<script|<iframe/);
  const cases = await featuredCases();
  assert.deepEqual(cases.map((project) => project.id), ['parametricad-ai', 'nain3d-conformance-gateway', 'financial-management-api', 'nain-legacy-modernizer']);
});

test('SW-002: each case reads eyebrow, title, three-term story, chips and links beside its capture', async () => {
  const section = await read(`${HOME}SelectedWork.astro`);
  const at = (needle) => section.indexOf(needle);
  assert.ok(at('class="case-eyebrow"') < at('class="case-title"'));
  assert.ok(at('class="case-title"') < at('<dl class="case-story">'));
  assert.ok(at('<dl class="case-story">') < at('class="tag-list case-tags"'));
  assert.ok(at('class="tag-list case-tags"') < at('class="case-links"'));
  for (const term of ['Problema', 'Enfoque', 'Resultado']) assert.match(section, new RegExp(`<dt>${term}</dt>`));
  // DF-028: the result is open, the problem and the approach sit in the "+" details, after it and before the chips.
  assert.ok(at('<dt>Resultado</dt>') < at('<Quiet>'), 'the result comes first');
  assert.ok(at('<Quiet>') < at('<dt>Problema</dt>') && at('<dt>Enfoque</dt>') < at('class="tag-list case-tags"'), 'the story rows follow inside Quiet');
  assert.match(section, /<dd>\{story\.problem\}<\/dd>/);
  assert.match(section, /<dd>\{story\.approach\}<\/dd>/);
  assert.match(section, /<dd>\{story\.result\}<\/dd>/);
  assert.match(section, /technologies\.slice\(0, 5\)/);
  assert.match(section, /target="_blank" rel="noopener noreferrer"/);
  assert.match(section, /width="640" height="360"/);
  assert.match(section, /alt=""/);
  assert.match(section, /loading=\{index === 0 \? 'eager' : 'lazy'\}/);
  assert.match(section, /fetchpriority=\{index === 0 \? 'high' : undefined\}/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.case:nth-child\(even\) \.case-media \{[^}]*order: 2;/, 'captures alternate sides on wide screens');
  assert.match(css, /@media \(min-width: 60rem\) \{\s*\.case \{[^}]*grid-template-columns:/);
});

test('SW-003: the story lives in projects.json, complete and short, only on selected projects', async () => {
  const projects = JSON.parse(await read('public/assets/data/projects.json'));
  for (const project of await featuredCases()) {
    assert.ok(project.story, `${project.id} has a story`);
    for (const key of ['problem', 'approach', 'result']) {
      const line = project.story[key];
      assert.equal(typeof line, 'string', `${project.id}.story.${key}`);
      assert.ok(line.length > 40 && line.length <= 160, `${project.id}.story.${key} is ${line.length} characters`);
    }
  }
  for (const project of projects.filter((project) => !project.selected)) assert.equal(project.story, undefined, `${project.id} carries no story`);
  assert.ok(projects.filter((project) => project.selected).every((project) => project.featured), 'selected projects are featured ones');
});

test('SW-004: the story lines carry no figure, client, guarantee or downtime claim', async () => {
  const blocked = [/\d+\s*%/, /\b\d+\s*(ms|s|min|h|x|€|k)\b/i, /cero tiempo|zero downtime|sin ca[ií]das/i, /\bcliente/i, /garant/i, /\b(mejor|m[aá]s r[aá]pido|reduc)/i];
  for (const project of await featuredCases()) {
    for (const line of Object.values(project.story)) {
      for (const pattern of blocked) assert.doesNotMatch(line, pattern, `${project.id}: ${line}`);
    }
  }
});

test('HN-001: the home renders ten sections in the narrative order', async () => {
  const home = await read('src/pages/index.astro');
  const order = ['<Hero />', '<SelectedWork />', '<ServicesSection>', '<TechStack />', '</ServicesSection>', '<ProjectsSection />', '<OpenEcosystem />', '<MethodSection />', '<AboutSection />', '<Testimonials />', '<ContactSection />'];
  const positions = order.map((needle) => home.indexOf(needle));
  positions.forEach((position, index) => assert.ok(position >= 0, `${order[index]} is rendered`));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions, 'sections keep the narrative order');
  for (const retired of ['ProofStrip', 'ImpactMetrics', 'TerminalSection', 'LiveDemos']) assert.doesNotMatch(home, new RegExp(retired), `${retired} left the home`);
});

test('HN-002: the terminal is folded inside the about section and keeps its markup and script', async () => {
  await missing(`${HOME}TerminalSection.astro`);
  const about = await read(`${HOME}AboutSection.astro`);
  assert.match(about, /<details class="fold terminal-fold" id="terminal">\s*<summary>Terminal interactiva<\/summary>/);
  assert.match(about, /<Terminal \/>\s*<\/details>/, 'the widget sits inside the fold');
  const terminal = await read(`${HOME}Terminal.astro`);
  assert.match(terminal, /<div class="terminal-wrapper" role="application"/);
  assert.match(terminal, /id="terminal-output" role="log"/);
  assert.match(terminal, /<!--email_off-->\[aitor@naindev\.com ~\]\$<!--\/email_off-->/, 'PERF-011 kept');
  assert.match(terminal, /import '\.\.\/\.\.\/scripts\/terminal\.js'/);
  const notFound = await read('src/pages/404.astro');
  assert.match(notFound, /<Terminal \/>/, 'the 404 page shares the widget');
  assert.ok(about.indexOf('class="text-links"') < about.indexOf('terminal-fold"'), 'profile links come first (IP-009)');
  const css = await read('src/styles/main.css');
  assert.match(css, /\.fold > summary \{[^}]*min-height: 44px;/, 'the summary is a comfortable target');
  assert.match(css, /\.fold > summary:hover,\s*\.fold > summary:focus-visible \{/, 'keyboard parity');
});

test('HN-003: the stack is a one-line strip inside the services section, category names kept hidden', async () => {
  const services = await read(`${HOME}ServicesSection.astro`);
  assert.match(services, /<\/div>\s*<slot \/>\s*<\/div>\s*<\/section>/, 'the stack slot follows the service cards');
  const stack = await read(`${HOME}TechStack.astro`);
  assert.match(stack, /<div class="tech-strip" id="tech-stack">/);
  assert.match(stack, /<span class="tech-category-title">\{category\.name\}<\/span>/);
  assert.match(stack, /<span class="tech-name">\{item\.name\}<\/span>/, 'badge names stay visible');
  assert.doesNotMatch(stack, /<section/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.tech-strip \.tech-category-title \{[^}]*clip-path: inset\(50%\);/);
  assert.match(css, /\.tech-strip \.tech-category-group,\s*\.tech-strip \.tech-category \{\s*display: contents;/);
  assert.doesNotMatch(css, /\.tech-stack-container::before/, 'the layer spine is retired');
});

test('HN-004: catalog projects render as compact rows with the summary and proof in the detail', async () => {
  const view = await read('src/scripts/project-view.js');
  assert.match(view, /createElement\("article", "project-row"\)/);
  assert.doesNotMatch(view, /"project-card"|project-card-plain|project-thumb/);
  assert.match(view, /technologies\.slice\(0, 4\)/);
  assert.match(view, /detail\.append\(summary, createElement\("p", "project-proof", project\.proof\)\);/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\n\.project-row \{/);
  assert.doesNotMatch(css, /\.project-card\b/, 'tall card rules are removed');
  // .proof-icon stays: the about section reuses it for the three principles.
  assert.doesNotMatch(css, /\.proof-strip|\.proof-grid|\.resource-cta|\.impact-metric/, 'retired component rules are removed');
});

test('HN-005: the proof strip and the checklist box left the home; the proof sentences live in the about copy', async () => {
  await missing(`${HOME}ProofStrip.astro`);
  await missing(`${HOME}ImpactMetrics.astro`);
  const about = (await read(`${HOME}AboutSection.astro`)).replace(/\s+/g, ' ');
  for (const sentence of ['Trabajo a diario con .NET y SQL Server.', 'Los proyectos y las demos están enlazados.', 'Proyectos a tiempo parcial y en remoto, con el alcance acordado desde la primera llamada.']) {
    assert.ok(about.includes(sentence), `about keeps: ${sentence}`);
  }
  const checklist = await read('src/pages/recursos/checklist-ia.astro');
  assert.ok(checklist.length > 0);
});

test('SW-007: the new CSS reads tokens and names its transitions', async () => {
  const css = await read('src/styles/main.css');
  const block = css.slice(css.indexOf('/* --- Selected work and home narrative (specs/049-selected-work) --- */'));
  assert.ok(block.length > 100, 'the block exists');
  assert.doesNotMatch(block, /#[0-9a-f]{3,8}\b/i, 'no colour literal');
  assert.doesNotMatch(block, /transition:\s*all/);
  assert.match(block, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.case-media:hover \.case-capture,\s*\.case:focus-within \.case-capture \{/, 'the capture scale is motion-gated with a keyboard twin');
});
