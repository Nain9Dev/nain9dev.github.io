import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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

test('LABEL-001: the Spanish tech stack section has no English labels', async () => {
  const section = await read('src/components/home/TechStack.astro');
  assert.doesNotMatch(text(section), ENGLISH_LABELS);
  const { categories } = JSON.parse(await read('public/assets/data/tech-stack.json'));
  for (const { name } of categories) assert.doesNotMatch(name, ENGLISH_LABELS, name);
});
