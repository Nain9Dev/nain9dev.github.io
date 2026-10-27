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
  // TerminalSection and ImpactMetrics left the home (specs/next-selected-work, HN-002, HN-005).
  const sections = ['ServicesSection', 'TechStack', 'ProjectsSection', 'OpenEcosystem', 'PartnershipSection', 'MethodSection', 'AboutSection', 'ContactSection'];
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

test('VS-002: the hero map hides its detail lines in CSS and animates only transform', async () => {
  const hero = await read(`${HOME}Hero.astro`);
  assert.match(hero, /<small>Contratos y validación<\/small>/, 'detail lines stay in the markup');
  assert.match(hero, /<p class="panel-hint">/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.system-node small,\s*\.panel-hint \{[^}]*clip-path: inset\(50%\);/);
  const keyframes = css.match(/@keyframes rail-pulse \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.ok(keyframes, 'rail pulse keyframes exist');
  assert.deepEqual([...keyframes.matchAll(/^\s{4}([a-z-]+):/gm)].map((m) => m[1]), ['transform', 'transform']);
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\) \{\s*\.system-map::after/);
  assert.match(css, /html\.low-performance \.system-map::after \{[^}]*animation: none/);
});

test('VS-003: the demo gallery shows lazy captures and keeps host and technologies in the markup', async () => {
  const strip = await read(`${HOME}LiveDemos.astro`);
  // The 400 px variant is the default; the 640 px capture only where the rendered size asks for it (spec 032 transfer budget).
  assert.match(strip, /<img class="live-demo-thumb" src=\{demo\.small\} srcset=\{`\$\{demo\.small\} 400w, \$\{demo\.thumbnail\} 640w`\} sizes="\(max-width: 42rem\) 54vw, 12rem" alt="" width="400" height="225" loading="lazy" decoding="async" \/>/);
  assert.match(strip, /-400\.webp/);
  assert.match(strip, /<span class="live-demo-host" translate="no">/);
  assert.match(strip, /<span class="live-demo-tech" translate="no">/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.live-demos \.live-demo-host,\s*\.live-demos \.live-demo-tech \{[^}]*clip-path: inset\(50%\);/);
  assert.match(css, /\.live-demos \.live-demo \{[^}]*aspect-ratio: 16 \/ 10;/, 'gallery styles scoped to the strip');
  // The open-ecosystem tiles share the grid classes but are repositories, not demos: mark plus name, note hidden.
  const ecosystem = await read(`${HOME}OpenEcosystem.astro`);
  assert.match(ecosystem, /<svg class="repo-icon"[^>]*aria-hidden="true"/);
  assert.match(css, /#open-ecosystem \.live-demo-tech \{[^}]*clip-path: inset\(50%\);/);
  assert.match(css, /scroll-snap-type: x mandatory;/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\) \{\s*\.live-demos \.live-demo:hover \.live-demo-thumb/);
});

test('VS-010: service lists fold behind the toggle and captured project cards keep their summary in the detail', async () => {
  const services = await read(`${HOME}ServicesSection.astro`);
  assert.equal(services.match(/<Quiet><ul class="compact-list">/g)?.length, 3);
  assert.equal(services.match(/<\/ul><\/Quiet>/g)?.length, 3);
  const view = await read('src/scripts/project-view.js');
  // Rows keep summary and proof in the detail for every project (specs/next-selected-work, HN-004).
  assert.match(view, /detail\.append\(summary, createElement\("p", "project-proof", project\.proof\)\);/);
  assert.match(view, /detail\.append\(createElement\("summary", "", message\('projectDetail'\)\)\);/, 'the summary element stays first inside details');
});
