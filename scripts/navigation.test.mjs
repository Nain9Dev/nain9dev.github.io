// Guards for specs/029-instant-navigation.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}

test('NAV-001: no client router and no astro lifecycle events', async () => {
  for (const file of (await walk('src')).filter((f) => /\.(astro|js|ts)$/.test(f))) {
    const text = await readFile(file, 'utf8');
    assert.doesNotMatch(text, /ClientRouter|astro:transitions/, file);
    assert.doesNotMatch(text, /['"]astro:(page-load|after-swap|before-swap|before-preparation|after-preparation)['"]/, file);
    assert.doesNotMatch(text, /data-astro-prefetch/, file);
  }
});

test('NAV-002: cross-document view transitions only without reduced motion, header kept in place', async () => {
  const css = await readFile('src/styles/main.css', 'utf8');
  assert.match(css, /@media \(prefers-reduced-motion: no-preference\)\s*\{\s*@view-transition\s*\{\s*navigation:\s*auto;\s*\}/);
  assert.match(css, /\.site-header\s*\{[^}]*view-transition-name:\s*site-header/);
});

test('NAV-003: speculation rules prerender same-origin pages with moderate eagerness and exclusions', async () => {
  const layout = await readFile('src/layouts/BaseLayout.astro', 'utf8');
  const match = layout.match(/<script[^>]*type="speculationrules"[^>]*>([\s\S]*?)<\/script>/);
  assert.ok(match, 'missing speculation rules');
  const rules = JSON.parse(match[1]);
  const [rule] = rules.prerender;
  assert.equal(rule.eagerness, 'moderate');
  const serialized = JSON.stringify(rule.where);
  for (const needle of ['/*', 'mailto:', '_blank', 'data-no-prerender', '.pdf']) {
    assert.ok(serialized.includes(needle), `rule must mention ${needle}`);
  }
});

test('NAV-004: modules initialise once per document', async () => {
  const app = await readFile('src/scripts/app.js', 'utf8');
  assert.doesNotMatch(app, /cleanupApp|generation\b|restorePerformanceClass/);
  const terminal = await readFile('src/scripts/terminal.js', 'utf8');
  assert.doesNotMatch(terminal, /terminalCleanup/);
});
