import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Home clarity improvements. See specs/next-home-clarity.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const ENGLISH_LABELS = /\b(Skills|Tech Stack|Languages|Tools|AI & DevOps)\b/;

test('HERO-001: the H1 states the full stack architect profile and a concrete value', async () => {
  const hero = await read('src/components/home/Hero.astro');
  assert.equal(hero.match(/<h1[\s>]/g)?.length, 1);
  const h1 = text(hero.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]);
  assert.match(h1, /^Arquitecto de software full stack/);
  assert.match(h1, /backend fiable/i);
  assert.doesNotMatch(h1, /reglas deterministas/);
});

test('HERO-002: the summary keeps conformance with 3D first and names the stack and human review', async () => {
  const hero = text(await read('src/components/home/Hero.astro'));
  assert.match(hero, /conformidad determinista/i);
  assert.match(hero, /primer dominio[^.]*3D/i);
  assert.match(hero, /Python y \.NET/);
  assert.match(hero, /revisión humana/i);
});

test('HERO-003: the eyebrow does not repeat the job title', async () => {
  const hero = await read('src/components/home/Hero.astro');
  const eyebrow = text(hero.match(/<p class="eyebrow"[^>]*>([\s\S]*?)<\/p>/)[1]);
  assert.doesNotMatch(eyebrow, /Arquitecto de Software/i);
});

test('CAT-001: the project catalog is rendered in the static markup, not only after JavaScript runs', async () => {
  const section = await read('src/components/home/ProjectsSection.astro');
  assert.doesNotMatch(section, /Cargando proyectos/);
  assert.match(section, /import projects from '\.\.\/\.\.\/\.\.\/public\/assets\/data\/projects\.json'/);
  const list = section.match(/<ul class="project-index"[\s\S]*?<\/ul>/)?.[0] ?? '';
  assert.match(list, /catalog\.map\(/);
  assert.match(section, /const catalog = \[\.\.\.projects\]/);
  assert.match(list, /project\.title/);
  assert.match(list, /project\.status/);
  assert.match(section, /<div class="project-grid" data-project-list/, 'the client renderer keeps its container');
});

test('CTA-001: every booking link offers a call, never a free audit or diagnosis', async () => {
  const allowed = new Set(['Agendar llamada gratuita', 'Agendar llamada', 'Agendar Auditoría de Sistemas']);
  const files = (await readdir(join(ROOT, 'src'), { recursive: true }))
    .filter((file) => /\.(astro|mdx?)$/.test(file))
    .map((file) => `src/${file.replaceAll('\\', '/')}`);
  const found = [];
  for (const file of files) {
    const source = await read(file);
    for (const match of source.matchAll(/<a\b[^>]*calendly\.com[^>]*>([\s\S]*?)<\/a>/g)) found.push([file, text(match[1])]);
    for (const match of source.matchAll(/\[([^\]]+)\]\(https:\/\/calendly\.com[^)]*\)/g)) found.push([file, text(match[1])]);
  }
  assert.ok(found.length >= 10, `expected the booking links to be found, got ${found.length}`);
  const promise = /diagn[oó]stico|consultor[ií]a|auditor[ií]a gratuita|auditor[ií]a de arquitectura|\d+ minutos? gratuit/i;
  for (const [file, label] of found) {
    assert.doesNotMatch(label, promise, `${file}: "${label}"`);
    // Button-style labels must be one of the allowed texts; inline prose links only avoid the promises above.
    if (/^src\/(components|pages)\//.test(file) || label.startsWith('Agendar ')) {
      assert.ok(allowed.has(label), `${file}: "${label}"`);
    }
  }
});

test('FOOT-001: the footer status link is labelled by its destination', async () => {
  const footer = await read('src/components/Footer.astro');
  assert.match(footer, /<span>Estado del servicio<\/span>/);
  assert.doesNotMatch(footer, /Sistemas Operativos/);
});

test('LABEL-001: the Spanish tech stack section has no English labels', async () => {
  const section = await read('src/components/home/TechStack.astro');
  assert.doesNotMatch(text(section), ENGLISH_LABELS);
  const { categories } = JSON.parse(await read('public/assets/data/tech-stack.json'));
  for (const { name } of categories) assert.doesNotMatch(name, ENGLISH_LABELS, name);
});
