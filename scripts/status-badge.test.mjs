import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const FOOTER_PATH = path.join(__dirname, '..', 'src', 'components', 'Footer.astro');

test('STAT-001 & STAT-003: Footer contains secure link to status.naindev.com', () => {
  assert.ok(fs.existsSync(FOOTER_PATH), 'src/components/Footer.astro must exist');
  const content = fs.readFileSync(FOOTER_PATH, 'utf-8');

  assert.match(
    content,
    /href=["']https:\/\/status\.naindev\.com\/["']/,
    'Footer must contain link pointing to https://status.naindev.com/'
  );

  assert.match(
    content,
    /target=["']_blank["']/,
    'Status link must open in new tab'
  );

  assert.match(
    content,
    /rel=["']noopener noreferrer["']/,
    'Status link must use strict rel="noopener noreferrer"'
  );
});

test('STAT-002 & STAT-004: Status element includes indicator dot and accessible label', () => {
  const content = fs.readFileSync(FOOTER_PATH, 'utf-8');

  assert.match(
    content,
    /Estado del servicio/,
    'Status indicator must display clear operational text'
  );

  assert.match(
    content,
    /aria-hidden=["']true["']/,
    'Visual status dot must be marked aria-hidden="true"'
  );

  assert.match(
    content,
    /#22c55e|rgb\(34,\s*197,\s*94\)|green/,
    'Status dot must use operational green styling'
  );
});

test('STAT-005: Zero runtime script overhead in footer', () => {
  const content = fs.readFileSync(FOOTER_PATH, 'utf-8');
  assert.doesNotMatch(
    content,
    /<script>/,
    'Footer must remain completely static without inline client scripts'
  );
});
