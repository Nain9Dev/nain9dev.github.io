import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';

// Offer and availability copy decided by the owner. See specs/009-honest-offer-copy.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE_DIRS = ['src/components', 'src/pages', 'src/content', 'public/assets/data'];
const CALENDLY = 'https://calendly.com/aitornainmendozavallejo-ksez/30min';
const HERO_AVAILABILITY = 'Acepto proyectos a tiempo parcial y en remoto para empresas de cualquier país.';
const ABOUT_ROLE = 'Lead Software Architect en Contrast3D x NainDev, la colaboración con Contrast3D';

const read = (file) => readFile(join(ROOT, file), 'utf8');

async function sourceFiles(dirs = SOURCE_DIRS) {
  const files = [];
  for (const dir of dirs) {
    for (const entry of await readdir(join(ROOT, dir), { withFileTypes: true, recursive: true })) {
      if (!entry.isFile() || !/\.(astro|mdx?|json|html)$/.test(entry.name)) continue;
      const file = relative(ROOT, join(entry.parentPath, entry.name)).replaceAll('\\', '/');
      if (!file.startsWith('src/content/marketing/')) files.push(file);
    }
  }
  return files;
}

async function offenders(pattern, dirs) {
  const found = [];
  for (const file of await sourceFiles(dirs)) if (pattern.test(await read(file))) found.push(file);
  return found;
}

test('COPY-001: no call to action offers a free audit', async () => {
  const freeAudit = /auditor[ií]a[^<>\]\n."]{0,40}gratuita|(agendar?|reserva)\s+(una|tu)\s+auditor[ií]a/i;
  assert.deepEqual(await offenders(freeAudit), []);
});

test('COPY-001: Calendly buttons offer a free call and keep their destinations', async () => {
  const pages = {
    'src/components/home/Hero.astro': `href="${CALENDLY}"`,
    'src/pages/servicios/index.astro': `href="${CALENDLY}"`,
    'src/pages/recursos/gracias.astro': `href="${CALENDLY}?utm_source=gracias&utm_medium=website"`,
  };
  for (const [file, href] of Object.entries(pages)) {
    const markup = await read(file);
    assert.ok(markup.includes(href), `${file} keeps its Calendly URL`);
    assert.match(markup, /Agendar llamada gratuita/, file);
  }
});

test('COPY-002: the hero states part-time remote availability and nothing claims immediate availability', async () => {
  assert.ok((await read('src/components/home/Hero.astro')).includes(HERO_AVAILABILITY));
  assert.deepEqual(await offenders(/disponibilidad inmediata|immediate availability/i), []);
});

test('COPY-003: the About section names the Contrast3D x NainDev collaboration', async () => {
  const markup = await read('src/components/home/AboutSection.astro');
  assert.doesNotMatch(markup, /stealth/i);
  assert.ok(markup.replace(/\s+/g, ' ').includes(ABOUT_ROLE));
});

test('COPY-004: terminal commands contain no confidential project, redacted values or telemetry', async () => {
  const raw = await read('public/assets/data/terminal-commands.json');
  const commands = JSON.parse(raw);
  assert.doesNotMatch(raw, /\bNDA\b|confidencial/i);
  assert.doesNotMatch(raw, /\[REDACTED\]|grado industrial|uptime|latencia|carga:/i);
  for (const key of ['story', 'metrics', 'status', 'experience']) {
    assert.doesNotMatch(commands[key], /\d+(?:[.,]\d+)?\s*(%|ms\b)/i, key);
  }
  for (const key of ['help', 'story', 'metrics', 'status', 'experience', 'stack', 'contact']) {
    assert.ok(commands[key], `command ${key} exists`);
  }
  assert.match(commands.story, /Contrast3D x NainDev/);
  assert.match(commands.experience, /Backend Specialist @ SaaS Platform/);
  assert.match(commands.status, /tiempo parcial/i);
  assert.match(commands.status, /contact/);
  assert.match(commands.metrics, /contact/);
  assert.match(commands.contact, /mailto:contact@naindev\.com/);
  const listed = [...commands.help.matchAll(/<td class="term-text-green">([^<]+)<\/td>/g)].map((match) => match[1]);
  assert.deepEqual(listed.filter((name) => name !== 'clear' && !commands[name]), []);
});

test('COPY-005: service pages present availability as a design goal', async () => {
  assert.deepEqual(await offenders(/\*\*Zero Downtime:\*\*|\(Zero Downtime\)|"Zero Downtime"|disponibilidad\s+\d/i, ['src/content/servicios', 'src/content/blog']), []);
});
