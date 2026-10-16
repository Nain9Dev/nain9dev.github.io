import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCRIPT_PATH = path.join(__dirname, '..', 'public', 'assets', 'js', 'ecosystem-bar.js');

test('ECO-003: ecosystem-bar.js exists and is ultra-lightweight (< 15 KB, no external imports)', () => {
  assert.ok(fs.existsSync(SCRIPT_PATH), 'public/assets/js/ecosystem-bar.js must exist');
  const stat = fs.statSync(SCRIPT_PATH);
  assert.ok(stat.size > 500, 'script must contain implementation');
  assert.ok(stat.size < 15000, `script size (${stat.size} bytes) must be under 15,000 bytes`);

  const content = fs.readFileSync(SCRIPT_PATH, 'utf-8');
  assert.match(content, /customElements\.define\(['"]nain-ecosystem-bar['"]/, 'must define custom element nain-ecosystem-bar');
  assert.doesNotMatch(content, /^\s*import\s+.+from/m, 'must have zero external runtime imports');
  assert.doesNotMatch(content, /require\s*\(/, 'must have zero external require calls');
});

test('ECO-001: component encapsulates styles within Shadow DOM', () => {
  const content = fs.readFileSync(SCRIPT_PATH, 'utf-8');
  assert.match(content, /attachShadow\s*\(\s*\{\s*mode:\s*['"]open['"]\s*\}\s*\)/, 'must attach shadow DOM for strict CSS encapsulation');
  assert.match(content, /<style>/, 'must declare encapsulated shadow DOM styles');
  assert.match(content, /:host/, 'must target :host for container rules');
});

test('ECO-002: component includes brand link, status link, and public project catalog', () => {
  const content = fs.readFileSync(SCRIPT_PATH, 'utf-8');
  assert.match(content, /https:\/\/www\.naindev\.com\//, 'must link to main portfolio');
  assert.match(content, /https:\/\/status\.naindev\.com\//, 'must link to status page');

  // Verify key showcase projects are present in the embedded catalog
  const expectedProjects = [
    'https://policy.naindev.com/',
    'https://drive.naindev.com/',
    'https://notify.naindev.com/',
    'https://3d.naindev.com/',
    'https://prospect.naindev.com/',
    'https://write.naindev.com/',
    'https://order.naindev.com/',
    'https://parametricad.naindev.com/',
    'https://orbe.naindev.com/',
    'https://pong.naindev.com/',
    'https://tai.naindev.com/',
    'https://tickets.naindev.com/',
    'https://gamehaven.naindev.com/',
    'https://configurator.naindev.com/',
    'https://brand.naindev.com/',
    'https://github.com/Nain9Dev/engineering-handbook'
  ];

  for (const url of expectedProjects) {
    assert.ok(content.includes(url), `catalog must include demo URL: ${url}`);
  }
});

test('ECO-004: component supports minimize/collapse toggle for full-screen viewports', () => {
  const content = fs.readFileSync(SCRIPT_PATH, 'utf-8');
  assert.match(content, /collapsed/i, 'must manage collapsed state');
  assert.match(content, /toggle|collapse/i, 'must contain collapse toggle handling');
});

test('ECO-005: component enforces accessibility attributes (WCAG 2.2 AA)', () => {
  const content = fs.readFileSync(SCRIPT_PATH, 'utf-8');
  assert.match(content, /aria-expanded/, 'dropdown toggle must declare aria-expanded');
  assert.match(content, /aria-label/, 'interactive buttons must declare descriptive aria-label');
  assert.match(content, /Escape/i, 'must handle Escape key to dismiss menus');
});
