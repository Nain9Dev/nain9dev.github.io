import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import sharp from 'sharp';

// Clients and collaborators bar. See specs/next-collaborators-bar.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const SECTION = 'src/components/home/Testimonials.astro';
const BAR = 'src/components/home/CollaboratorsBar.astro';
const MODULE = '../src/utils/collaborators.ts';
const MOTION_GATE = '@media (prefers-reduced-motion: no-preference)';

const markup = (source) => source.replace(/^---[\s\S]*?\n---/, '').replace(/<style[\s\S]*?<\/style>/g, '');
const styles = (source) => source.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const entry = (id, data = {}) => ({ id, data: { name: id, order: 99, status: 'approved', ...data } });

test('CLB-001: the collection schema makes the authorization mandatory', async () => {
  const config = await read('src/content.config.ts');
  const block = config.match(/const collaborators = defineCollection\(\{([\s\S]*?)\n\}\);/)?.[1] ?? '';
  assert.match(block, /file\('src\/data\/collaborators\.json'\)/);
  for (const field of ['name', 'url', 'logo', 'order', 'status', 'authorization']) {
    assert.match(block, new RegExp(`\\b${field}:`), field);
  }
  assert.match(block, /url: z\.url\(\{ protocol: \/\^https\$\/ \}\)\.optional\(\)/, 'https only, and a brand may have no link');
  assert.match(block, /startsWith\('\/assets\/images\/collaborators\/'\)/);
  assert.match(block, /withName: z\.boolean\(\)\.default\(false\)/);
  assert.match(block, /z\.enum\(\['pending', 'approved'\]\)\.default\('pending'\)/);
  assert.match(block, /granted: z\.literal\(true\)/);
  assert.match(block, /evidence: z\.string\(\)\.min\(10\)/);
  assert.doesNotMatch(block, /summary|relationship/, 'the bar shows the brand only, no description of the work');
  const sources = config.match(/const reviewSources = defineCollection\(\{([\s\S]*?)\n\}\);/)?.[1] ?? '';
  assert.match(sources, /file\('src\/data\/review-sources\.json'\)/);
  assert.match(sources, /url: z\.url\(\{ protocol: \/\^https\$\/ \}\)/);
  assert.match(config, /collections = \{[^}]*\bcollaborators\b[^}]*\breviewSources\b/);
});

test('CLB-008: committed entries are approved, authorized, https and carry a small local logo', async () => {
  const entries = JSON.parse(await read('src/data/collaborators.json'));
  assert.ok(Array.isArray(entries));
  const ids = new Set();
  for (const item of entries) {
    assert.match(item.id ?? '', /^[a-z0-9][a-z0-9-]*$/, 'id is kebab-case');
    assert.ok(!ids.has(item.id), `${item.id}: duplicate id`);
    ids.add(item.id);
    assert.ok(item.name?.length > 0, `${item.id}: name`);
    // The repository is public: a pending entry is a decision not taken yet, so it is approved or removed before any commit.
    assert.equal(item.status, 'approved', `${item.id}: approve or remove it before committing`);
    assert.equal(item.authorization?.granted, true, `${item.id}: authorization`);
    assert.ok(item.authorization?.evidence?.length >= 10, `${item.id}: evidence`);
    if (item.url !== undefined) assert.match(item.url, /^https:\/\//, `${item.id}: https URL`);
    for (const dropped of ['summary', 'relationship']) assert.ok(!(dropped in item), `${item.id}: no ${dropped}`);
    if (item.logo) {
      assert.match(item.logo.src, /^\/assets\/images\/collaborators\/[a-z0-9-]+\.(svg|webp|png)$/, `${item.id}: logo path`);
      const file = join(ROOT, 'public', item.logo.src);
      const { size } = await stat(file);
      assert.ok(size <= 20 * 1024, `${item.id}: logo is ${size} B, limit 20 kB`);
      const { width, height } = await sharp(file).metadata();
      assert.deepEqual([item.logo.width, item.logo.height], [width, height], `${item.id}: declared logo size is the file's own`);
    }
  }
  const sources = JSON.parse(await read('src/data/review-sources.json'));
  assert.ok(Array.isArray(sources));
  for (const source of sources) {
    assert.match(source.id ?? '', /^[a-z0-9][a-z0-9-]*$/, 'source id');
    assert.ok(source.name?.length > 0, `${source.id}: name`);
    assert.match(source.url, /^https:\/\//, `${source.id}: https URL`);
  }
});

test('CLB-003: only approved collaborators are shown, by order and then by name', async () => {
  const { approvedCollaborators } = await import(MODULE);
  const shown = approvedCollaborators([
    entry('zeta', { order: 2 }),
    entry('draft', { order: 1, status: 'pending' }),
    entry('Álamo', { order: 2 }),
    entry('beta', { order: 1 }),
  ]);
  assert.deepEqual(shown.map((item) => item.id), ['beta', 'Álamo', 'zeta']);
  assert.deepEqual(approvedCollaborators([]), []);
});

test('CLB-009: the list moves from three brands on, and a longer list takes longer to loop', async () => {
  const { movesAsStrip, stripLoopSeconds } = await import(MODULE);
  assert.deepEqual([0, 1, 2, 3, 12].map(movesAsStrip), [false, false, false, true, true]);
  assert.equal(stripLoopSeconds(3), 30);
  assert.equal(stripLoopSeconds(10), 80);
});

test('CLB-002, CLB-005 and CLB-006: one section, rendered only with an approved entry', async () => {
  const section = await read(SECTION);
  assert.match(section, /approvedCollaborators\(await getCollection\('collaborators'\)\)/);
  assert.match(section, /\{\(collaborators\.length > 0 \|\| approved\.length > 0\) && \(/);
  assert.match(section, /<section class="section" id="clientes">/);
  assert.equal(section.match(/<section[\s>]/g)?.length, 1);
  assert.match(section, /\{collaborators\.length > 0 && <CollaboratorsBar items=\{collaborators\} \/>\}/);
  // The recommendations keep their own heading: an H3 under the bar, the section H2 without it.
  assert.match(section, /collaborators\.length > 0\s*\?\s*<h3 class="testimonials-title">/);
  assert.equal(markup(section).match(/<h2[\s>]/g)?.length, 1);
  assert.match(section, /await getCollection\('reviewSources'\)/);
  assert.match(section, /\{sources\.length > 0 && \(/);
  const sourceLink = section.match(/<a\b[^>]*href=\{source\.data\.url\}[^>]*>/)?.[0] ?? '';
  assert.match(sourceLink, /target="_blank"/);
  assert.match(sourceLink, /rel="noopener noreferrer"/);
  const home = await read('src/pages/index.astro');
  assert.doesNotMatch(home, /CollaboratorsBar/, 'the bar lives inside the section, the home keeps its ten sections (HN-001)');
});

test('CLB-003 and CLB-004: each brand is shown by its logo or its name, as a safe link when it has an address', async () => {
  const bar = await read(BAR);
  const body = markup(bar);
  assert.match(body, /<p class="eyebrow">Clientes y colaboradores<\/p>/);
  assert.match(body, /<h2>Trabajamos con estas marcas<\/h2>/);
  assert.equal(body.match(/<h2[\s>]/g)?.length, 1);
  assert.match(body, /<ul class="collab-group"/);
  assert.match(bar, /const Plate = url \? 'a' : 'span';/, 'a brand without an address is not a link');
  assert.match(bar, /href: url, target: '_blank', rel: 'noopener noreferrer'/);
  const image = body.match(/<img\b[^>]*>/)?.[0] ?? '';
  assert.match(image, /src=\{logo\.src\}/);
  assert.match(image, /alt=\{logo\.withName \? '' : name\}/, 'the name is read once: from the image or from the text beside it');
  assert.match(image, /width=\{logo\.width\}/);
  assert.match(image, /height=\{logo\.height\}/);
  assert.match(image, /loading="lazy"/);
  assert.match(image, /decoding="async"/);
  assert.match(body, /\{\(!logo \|\| logo\.withName\) && name\}/, 'the name stands in when there is no logo');
  assert.doesNotMatch(body, /summary|relationship/, 'no caption under a brand');
});

test('CLB-009: the strip is drawn twice for the loop and the copy is out of the way of assistive technology', async () => {
  const bar = await read(BAR);
  assert.match(bar, /const moving = movesAsStrip\(items\.length\);/);
  assert.match(bar, /const copies = moving \? \[false, true\] : \[false\];/);
  assert.match(bar, /aria-hidden=\{clone \? 'true' : undefined\}/);
  assert.match(bar, /tabindex: clone \? -1 : undefined/);
  assert.match(bar, /--collab-loop: \$\{stripLoopSeconds\(items\.length\)\}s/);
  const body = markup(bar);
  assert.match(body, /\{moving && \(\s*<label class="collab-pause"><input type="checkbox" \/> Pausar el movimiento<\/label>\s*\)\}/);
  assert.doesNotMatch(bar, /<script|<marquee/i, 'no script');
});

test('CLB-009: the motion is gated, compositor-only, pausable and static for keyboard users', async () => {
  const css = styles(await read(BAR));
  const [base, motion = ''] = css.split(MOTION_GATE);
  assert.doesNotMatch(base, /animation|mask-image/, 'nothing moves outside the motion gate');
  assert.match(base, /\.collab-group\[aria-hidden\] \{\s*display: none;/, 'the copy exists only while the strip moves');
  assert.match(base, /\.collab-pause \{\s*display: none;/, 'the pause control exists only while the strip moves');
  assert.match(motion, /animation: collab-slide var\(--collab-loop\) linear infinite;/);
  const moving = [...motion.matchAll(/^\s*([^{}\n]*\.is-moving[^{}\n]*) \{[^}]*(?:animation:|mask-image|display: flex)/gm)];
  assert.equal(moving.length, 3, 'the strip, its groups and the copy');
  for (const rule of moving) {
    assert.match(rule[1], /^:global\(html:not\(\.low-performance\)\) /, `${rule[1]}: stops in low-performance mode`);
    assert.match(rule[1], /\.is-moving:not\(:has\(:focus-visible\)\)/, `${rule[1]}: static while a link has keyboard focus`);
  }
  // The pause rules repeat the gate of the rule that starts the loop: a weaker selector loses to the shorthand's play state.
  assert.match(motion, /:global\(html:not\(\.low-performance\)\) \.is-moving:not\(:has\(:focus-visible\)\):hover \.collab-group,\s*:global\(html:not\(\.low-performance\)\) \.collab-bar:has\(\.collab-pause input:checked\) \.collab-group \{\s*animation-play-state: paused;/);
  const keyframes = motion.match(/@keyframes collab-slide \{([\s\S]*?)\n  \}/)?.[1] ?? '';
  const properties = [...keyframes.matchAll(/([\w-]+)\s*:/g)].map((match) => match[1]);
  assert.deepEqual([...new Set(properties)], ['transform'], 'the loop animates transform only (PERF-007)');
});

test('CLB-004 and CLB-012: tokens only, logos as delivered on the plate, a pause control tall enough to tap', async () => {
  assert.match(styles(await read(BAR)), /\.collab-pause \{[^}]*min-height: 2\.75rem;/);
  const css = styles(await read(BAR)) + styles(await read(SECTION));
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i, 'no colour literal');
  assert.doesNotMatch(css, /transition: all|filter:/i, 'no transition: all, logos are not filtered');
  assert.match(css, /background: var\(--color-plate\)/);
  const tokens = await read('src/styles/main.css');
  assert.match(tokens, /--color-plate: #ffffff;/, 'the plate is a token of the root block');
});

test('CLB-007: no ratings, no embeds and no claims in the section', async () => {
  const sources = (await read(SECTION)) + (await read(BAR));
  assert.doesNotMatch(sources, /AggregateRating|"@type":\s*"Review"|ratingValue|[★⭐]/);
  assert.doesNotMatch(sources, /<iframe|<script[^>]+src=|https?:\/\//i, 'no embed and no hard-coded address: links come from the data');
  const copy = text(markup(await read(SECTION)) + markup(await read(BAR)));
  assert.doesNotMatch(copy, /satisfech|conf[ií]an en|trusted by|todos (nuestros |los )?clientes|100\s*%|casos? de (éxito|estudio)/i);
});

test('CLB-011: the guard is registered and the process is documented', async () => {
  const pkg = JSON.parse(await read('package.json'));
  assert.match(pkg.scripts.check, /scripts\/collaborators\.test\.mjs/);
  const runbook = await read('docs/06-runbook/testimonials.md');
  assert.match(runbook, /^## Collaborators$/m);
  assert.match(runbook, /src\/data\/collaborators\.json/);
  assert.match(runbook, /src\/data\/review-sources\.json/);
  assert.doesNotMatch(runbook, /"summary"|"relationship": "client",\s*"summary"/, 'the runbook shows the current entry shape');
  const adr = await read('docs/30-decisions/ADR-next-collaborators-bar.md');
  assert.match(adr, /^Status: Proposed$/m);
});
