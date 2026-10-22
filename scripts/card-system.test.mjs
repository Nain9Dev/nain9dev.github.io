// Guards for specs/045-visual-polish PR 3: one card system, CSS stagger, keyboard parity and 24 px targets.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const rule = (css, selector) => css.match(new RegExp(`\\n${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} \\{([^}]*)\\}`))?.[1];

test('VP-004: every card family uses the shared radius', async () => {
  const css = await read('src/styles/main.css');
  for (const selector of ['.live-demo', '.blog-card', '.pain-card', '.case-study-card', '.impact-metric-card', '.catalog-index li', '.tech-badge', '.project-thumb']) {
    const body = rule(css, selector);
    assert.ok(body, `${selector} rule exists`);
    assert.match(body, /border-radius: var\(--radius\);/, `${selector} uses --radius`);
  }
});

test('VP-008: hover lifts have a keyboard equivalent', async () => {
  const css = await read('src/styles/main.css');
  assert.match(css, /\.service-card:hover,\s*\.service-card:focus-within,\s*\.project-card:hover,\s*\.project-card:focus-within \{/);
  assert.match(css, /\.live-demo:hover,\s*\.live-demo:focus-visible \{[^}]*box-shadow: var\(--shadow-raised\)/);
  assert.match(css, /a\.tech-badge:hover,\s*a\.tech-badge:focus-visible \{/);
  assert.match(css, /\.blog-card:hover,\s*\.blog-card:focus-within \{/);
  assert.match(css, /\.project-link:hover,\s*\.project-link:focus-visible \{/);
});

test('VP-004: badges and cards never depend on JavaScript to become visible', async () => {
  const css = await read('src/styles/main.css');
  assert.doesNotMatch(rule(css, '.tech-badge'), /opacity:\s*0/);
  assert.doesNotMatch(css, /\.tech-badge\.is-revealed/);
});

test('VP-005: the reveal stagger comes from CSS, not inline delays', async () => {
  const view = await read('src/scripts/project-view.js');
  assert.doesNotMatch(view, /transitionDelay/);
  const css = await read('src/styles/main.css');
  assert.match(css, /\.motion-ready :is\(\.card-grid, \.project-grid, \.tech-category\) > \[data-reveal\]:nth-child\(n \+ 6\) \{ transition-delay: calc\(var\(--stagger\) \* 5\); \}/);
});

test('WCAG 2.5.8: small links inside cards are at least 24 px tall', async () => {
  const css = await read('src/styles/main.css');
  assert.match(rule(css, '.project-link'), /min-height: 24px;/);
  assert.match(css, /\.project-detail summary \{[^}]*min-height: 24px;/);
  assert.match(rule(css, '.card-link'), /min-height: 24px;/);
});

test('ADR-0012: the card tilt and the unused tech-stack module are retired', async () => {
  await assert.rejects(access(join(ROOT, 'src/scripts/card-tilt.js')));
  await assert.rejects(access(join(ROOT, 'src/scripts/tech-stack.js')));
  const css = await read('src/styles/main.css');
  assert.doesNotMatch(css, /--card-mouse-x/);
  assert.doesNotMatch(css, /\.project-grid-container\.is-filtering \{[^}]*scale/);
});
