import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('ENG-001: README.md is in professional English and free of emojis', async () => {
  const readme = await read('README.md');

  // No emojis
  const emojiPattern = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert.doesNotMatch(readme, emojiPattern, 'README.md should not contain emojis');

  // No Spanish headings or legacy phrases
  const spanishMarkers = [
    /\bObjetivo del Proyecto\b/i,
    /\bArquitectura T[eé]cnica\b/i,
    /\bEstructura de Directorios\b/i,
    /\bDespliegue\b/i,
    /\bSeguridad y Propiedad\b/i,
    /\bPortafolio profesional\b/i,
  ];
  for (const marker of spanishMarkers) {
    assert.doesNotMatch(readme, marker, `Found Spanish marker ${marker} in README.md`);
  }

  // Key architectural mentions
  assert.match(readme, /\.NET/);
  assert.match(readme, /Python/);
  assert.match(readme, /Astro/);
});

test('ENG-003: Root operational markdown files are written in professional English and free of emojis', async () => {
  const emojiPattern = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

  const policy = await read('SECURITY_POLICY.md');
  assert.doesNotMatch(policy, emojiPattern);
  const policySpanishMarkers = [
    /\bPol[ií]tica de Seguridad\b/i,
    /\bProp[oó]sito\b/i,
    /\bArchivos Excluidos\b/i,
    /\bProcedimiento ante Fugas\b/i,
    /\bAuditor[ií]a Continua\b/i,
  ];
  for (const marker of policySpanishMarkers) {
    assert.doesNotMatch(policy, marker, `Found Spanish marker ${marker} in SECURITY_POLICY.md`);
  }

  const checklist = await read('PRODUCTION_CHECKLIST.md');
  assert.doesNotMatch(checklist, emojiPattern);
  const checklistSpanishMarkers = [
    /\bChecklist de Producci[oó]n\b/i,
    /\bFecha de Ejecuci[oó]n\b/i,
    /\bPrevenci[oó]n de 404s\b/i,
    /\bRendimiento y Carga\b/i,
  ];
  for (const marker of checklistSpanishMarkers) {
    assert.doesNotMatch(checklist, marker, `Found Spanish marker ${marker} in PRODUCTION_CHECKLIST.md`);
  }

  const migrationLog = await read('MIGRATION_LOG.md');
  assert.doesNotMatch(migrationLog, emojiPattern);
  const migrationLogMarkers = [
    /\bLog de Migraci[oó]n\b/i,
    /\bDespliegue a Producci[oó]n\b/i,
    /\bFecha de Despliegue\b/i,
  ];
  for (const marker of migrationLogMarkers) {
    assert.doesNotMatch(migrationLog, marker, `Found Spanish marker ${marker} in MIGRATION_LOG.md`);
  }

  const imagePlan = await read('IMAGE_MIGRATION_PLAN.md');
  assert.doesNotMatch(imagePlan, emojiPattern);
  const imagePlanMarkers = [
    /\bPlan de Migraci[oó]n\b/i,
    /\bAuditor[ií]a Actual\b/i,
  ];
  for (const marker of imagePlanMarkers) {
    assert.doesNotMatch(imagePlan, marker, `Found Spanish marker ${marker} in IMAGE_MIGRATION_PLAN.md`);
  }

  const pdfReadme = await read('public/assets/pdf/README.md');
  assert.doesNotMatch(pdfReadme, /Este directorio contiene/i);
});

test('ENG-004: client scripts, logs, and comments are in professional English', async () => {
  const appJs = await read('public/assets/js/app.js');
  assert.doesNotMatch(appJs, /Inicializando app/i);
  assert.doesNotMatch(appJs, /Fallo al inicializar/i);
  assert.doesNotMatch(appJs, /Limpiando app/i);

  const impactMetrics = await read('public/assets/js/impact-metrics.js');
  assert.doesNotMatch(impactMetrics, /ejecutado/i);
  assert.doesNotMatch(impactMetrics, /Error inicializando/i);

  const mailerlite = await read('public/assets/js/lazy-mailerlite.js');
  assert.doesNotMatch(mailerlite, /Si hay un script/i);
  assert.doesNotMatch(mailerlite, /Dejamos de observar/i);

  const techStack = await read('public/assets/js/tech-stack.js');
  assert.doesNotMatch(techStack, /Para animaci[oó]n de scroll/i);
  assert.doesNotMatch(techStack, /Reutiliza la l[oó]gica/i);
  assert.doesNotMatch(techStack, /No se pudo cargar/i);

  const terminal = await read('public/assets/js/terminal.js');
  assert.doesNotMatch(terminal, /Accesibilidad:/i);
  assert.doesNotMatch(terminal, /Añadir placeholder/i);
  assert.doesNotMatch(terminal, /Limitar el n[uú]mero/i);
  assert.doesNotMatch(terminal, /Limpiando recursos/i);

  const threeHero = await read('public/assets/js/three-hero.js');
  assert.doesNotMatch(threeHero, /Referencias a listeners/i);
  assert.doesNotMatch(threeHero, /Iniciando initializeThreeHero/i);
  assert.doesNotMatch(threeHero, /Cargando Three\.js/i);
  assert.doesNotMatch(threeHero, /Limpiando recursos/i);
});
