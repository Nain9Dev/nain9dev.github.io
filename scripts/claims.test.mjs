import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { findBlockedClaims, scanSources } from './check-claims.mjs';

test('matcher flags the unverified model count in both locales', () => {
  for (const text of ['<strong>+50M Modelos</strong>', '+50M models processed', 'validate 50M models']) {
    assert.notDeepEqual(findBlockedClaims(text), [], text);
  }
});

test('matcher flags the unverified impact metrics and badges', () => {
  const blocked = [
    '<div class="impact-metric-value">40 → 6 min</div>',
    'Uptime en sistemas críticos',
    'Uptime in critical systems',
    'Desarrolladores mentorizados',
    'Developers mentored',
    'Arquitecturas migradas',
    'Architectures migrated',
    '<strong>Colaborador OSS</strong>',
    'OSS Contributor',
  ];
  for (const text of blocked) assert.notDeepEqual(findBlockedClaims(text), [], text);
});

test('matcher ignores service descriptions of availability goals', () => {
  assert.deepEqual(findBlockedClaims('- **Zero Downtime:** Arquitecturas diseñadas para despliegues continuos'), []);
  assert.deepEqual(findBlockedClaims('Mentoría técnica para equipos que adoptan DDD'), []);
});

test('matcher flags availability percentages, telemetry and redacted values', () => {
  const blocked = [
    '<strong>Disponibilidad 99.99%:</strong>',
    '99.95 % availability',
    'Uptime: 99.97% - Todos los sistemas operando con normalidad.',
    'API Gateway (Latencia p95: 42ms)',
    'API Gateway (p95 Latency: 42ms)',
    '[REDACTED] modelos/hora',
    'Proceso completado en [REDACTED] ms.',
  ];
  for (const text of blocked) assert.notDeepEqual(findBlockedClaims(text), [], text);
});

test('matcher ignores availability described as a design goal', () => {
  assert.deepEqual(findBlockedClaims('**Alta disponibilidad:** Diseñado para aislar fallos'), []);
  assert.deepEqual(findBlockedClaims('Para lograr **zero downtime** y escalar el procesamiento 3D'), []);
  assert.deepEqual(findBlockedClaims('Arquitecturas distribuidas y Zero Downtime Deployments'), []);
  assert.deepEqual(findBlockedClaims('Coverage above 99% of test cases, uptime monitoring'), []);
});

test('matcher ignores file sizes and unrelated numbers', () => {
  assert.deepEqual(findBlockedClaims('GLB files larger than 50MB'), []);
  assert.deepEqual(findBlockedClaims('millones de modelos 3D'), []);
});

test('tracked sources publish no blocked claims', async () => {
  assert.deepEqual(await scanSources(), []);
});

test('home page keeps the checklist call to action', async () => {
  const markup = await readFile(new URL('../src/components/home/ImpactMetrics.astro', import.meta.url), 'utf8');
  assert.match(markup, /href="\/recursos\/checklist-ia"/);
});

test('thank-you page shows no Zero Downtime badge', async () => {
  // "Zero Downtime" stays valid as a design goal in services and blog posts, so
  // this badge is checked on its page instead of being blocked site-wide.
  const markup = await readFile(new URL('../src/pages/recursos/gracias.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(markup, /zero downtime/i);
});
