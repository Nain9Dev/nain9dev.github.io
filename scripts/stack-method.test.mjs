// Guards for specs/046-visual-storytelling PR 7: stack map and method timeline.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');

test('VS-004: the stack renders as layer bands on a spine, every badge keeping its visible name', async () => {
  const css = await read('src/styles/main.css');
  assert.match(css, /\n\.tech-category-group \{\s*position: relative;\s*display: grid;/);
  assert.match(css, /\.tech-stack-container::before \{[^}]*background: linear-gradient\(var\(--color-cobalt-bright\), var\(--color-green\)\);/);
  assert.match(css, /\n\.tech-badge \{\s*flex: 0 0 auto;\s*min-width: 5\.5rem;/);
  assert.doesNotMatch(css, /\.tech-name \{[^}]*(display: none|clip-path)/, 'badge names stay visible');
  const stack = await read('src/components/home/TechStack.astro');
  assert.match(stack, /<span class="tech-name">\{item\.name\}<\/span>/);
});

test('VS-005: the method steps sit on a horizontal rail that draws on scroll, without JavaScript', async () => {
  const css = await read('src/styles/main.css');
  assert.match(css, /\.step-list > li::before/, 'VIS-007 rail selector kept');
  const keyframes = css.match(/@keyframes rail-draw \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.deepEqual([...keyframes.matchAll(/^\s{4}([a-z-]+):/gm)].map((m) => m[1]), ['transform']);
  assert.match(css, /@supports \(animation-timeline: view\(\)\) \{\s*@media \(min-width: 60rem\) and \(prefers-reduced-motion: no-preference\) \{\s*\.step-list > li::before \{[^}]*animation-timeline: view\(\);/);
  assert.match(css, /@media \(min-width: 60rem\) \{\s*\.method-grid \{\s*grid-template-columns: 1fr;/);
  const method = await read('src/components/home/MethodSection.astro');
  assert.equal(method.match(/<li>/g)?.length, 4);
  assert.doesNotMatch(method, /<script/);
});
