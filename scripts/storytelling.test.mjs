// Guards for specs/046-visual-storytelling PR 6: quiet text, hero map and demo gallery.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const HOME = 'src/components/home/';

test('VS-001: explanatory paragraphs are disclosed by an accessible details element, text kept', async () => {
  const quiet = await read(`${HOME}Quiet.astro`);
  assert.match(quiet, /<details class="quiet">\s*<summary aria-label="[^"]+">\s*<svg[^>]*aria-hidden="true"/);
  assert.doesNotMatch(quiet, /<script/);
  // TerminalSection and ImpactMetrics left the home (specs/049-selected-work, HN-002, HN-005).
  const sections = ['ServicesSection', 'TechStack', 'ProjectsSection', 'OpenEcosystem', 'MethodSection', 'AboutSection', 'ContactSection'];
  for (const name of sections) {
    const markup = await read(`${HOME}${name}.astro`);
    assert.match(markup, /import Quiet from '\.\/Quiet\.astro'/, `${name} imports Quiet`);
    assert.match(markup, /<Quiet>[\s\S]*?<p[\s\S]*?<\/p>[\s\S]*?<\/Quiet>/, `${name} wraps a paragraph`);
  }
  // The About copy still carries its full text (COPY-003, COPY-007 read the same file).
  const about = (await read(`${HOME}AboutSection.astro`)).replace(/\s+/g, ' ');
  assert.match(about, /arquitectura de conformidad determinista y multidominio/i);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.quiet > summary \{[^}]*width: 32px;[^}]*height: 32px;/, '24 px+ target');
  assert.match(css, /\.quiet > summary:hover,\s*\.quiet > summary:focus-visible,/, 'keyboard parity');
});

test('VS-003 (retired by DF-029, DF-034): the open ecosystem is a row of chips with the note kept hidden', async () => {
  const css = await read('src/styles/main.css');
  assert.doesNotMatch(css, /\.live-demo/, 'the capture tiles left with the strip and the wall');
  const ecosystem = await read(`${HOME}OpenEcosystem.astro`);
  assert.match(ecosystem, /<svg class="repo-icon"[^>]*aria-hidden="true"/);
  assert.match(ecosystem, /<p class="eco-note">\{repository\.note\}<\/p>/);
  assert.match(css, /\.eco-note \{[^}]*clip-path: inset\(50%\);/);
});

test('VS-010: service lists fold behind the toggle and captured project cards keep their summary in the detail', async () => {
  const services = await read(`${HOME}ServicesSection.astro`);
  assert.equal(services.match(/<Quiet><ul class="compact-list">/g)?.length, 3);
  assert.equal(services.match(/<\/ul><\/Quiet>/g)?.length, 3);
  const view = await read('src/scripts/project-view.js');
  // Rows keep summary and proof in the detail for every project (specs/049-selected-work, HN-004).
  assert.match(view, /detail\.append\(summary, createElement\("p", "project-proof", project\.proof\)\);/);
  assert.match(view, /detail\.append\(createElement\("summary", "", message\('projectDetail'\)\)\);/, 'the summary element stays first inside details');
});
