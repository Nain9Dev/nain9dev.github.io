// Guards for specs/next-design-fusion, layer 3b (DF-016): section heads carry a dimension with a real count,
// and the solid shadows stay solid. Build-output checks run when dist/ exists.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const projects = JSON.parse(await read('public/assets/data/projects.json'));
const selected = projects.filter((project) => project.selected && project.story).length;

test('DF-016: the Dimension component is static markup with the count as a never-translated token', async () => {
  const component = await read('src/components/home/Dimension.astro');
  assert.match(component, /<p class="dimension">/);
  assert.match(component, /<span class="dimension-line" aria-hidden="true"><\/span>/);
  assert.match(component, /<span class="dimension-label"><span translate="no">\{count\}<\/span> \{unit\}<\/span>/);
  assert.doesNotMatch(component, /<script|client:|onclick/i, 'no script');
});

test('DF-016: each label is a count taken from data, not typed by hand', async () => {
  const uses = {
    'src/components/home/ProjectsSection.astro': /<Dimension count=\{catalog\.length\} unit="proyectos" \/>/,
    'src/components/home/SelectedWork.astro': /<Dimension count=\{cases\.length\} unit="proyectos seleccionados" \/>/,
    'src/components/home/ServicesSection.astro': /<Dimension count=\{services\.length\} unit="servicios" \/>/,
    'src/pages/servicios/index.astro': /<Dimension count=\{sortedServicios\.length\} unit="servicios" \/>/,
  };
  for (const [file, pattern] of Object.entries(uses)) assert.match(await read(file), pattern, file);
});

test('DF-016: the dimension is drawn with the brand stroke and a readable label, and it never moves', async () => {
  const css = await read('src/styles/main.css');
  const line = css.match(/\.dimension-line \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(line, /var\(--color-stroke\)/, 'line and ticks use the stroke role');
  const block = css.match(/\n\.dimension \{([\s\S]*?)\n\}/)?.[1] ?? '';
  assert.match(block, /color: var\(--color-ink-muted\);/, 'the label keeps AA contrast as muted ink');
  assert.match(block, /font-family: var\(--font-mono\);/);
  assert.doesNotMatch(css.match(/\.dimension[\s\S]*?(?=\n\.[a-z-]+ \{)/g)?.join('') ?? '', /animation|transition/, 'static');
});

test('DF-016: the solid shadows keep no blur', async () => {
  const css = await read('src/styles/main.css');
  for (const name of ['shadow-raised', 'shadow-panel', 'shadow-button']) {
    assert.match(css, new RegExp(`--${name}: \\d+px \\d+px 0 var\\(--color-[a-z-]+\\);`), `--${name} is offset-only`);
  }
});

test('DF-016: the built pages show the real counts in both languages', { skip: !existsSync(join(ROOT, 'dist/index.html')) }, async () => {
  const services = (await read('dist/servicios/index.html')).match(/class="dimension-label"><span translate="no">(\d+)<\/span>/)?.[1];
  assert.ok(services && Number(services) >= 10, `services count ${services}`);
  const es = await read('dist/index.html');
  const counts = [...es.matchAll(/class="dimension-label"><span translate="no">(\d+)<\/span> ([^<]+)</g)].map((m) => [Number(m[1]), m[2]]);
  assert.equal(counts.length, 3, 'three dimensions on the home');
  assert.ok(counts.some(([n, unit]) => n === Number(services) && unit === 'servicios'));
  assert.ok(counts.some(([n, unit]) => n === projects.length && unit === 'proyectos'));
  assert.ok(counts.some(([n, unit]) => n === selected && unit === 'proyectos seleccionados'));
  const en = await read('dist/en/index.html');
  assert.match(en, /class="dimension-label"><span translate="no">\d+<\/span> projects</);
  assert.match(en, /class="dimension-label"><span translate="no">\d+<\/span> selected projects</);
  assert.match(en, /class="dimension-label"><span translate="no">\d+<\/span> services</);
});
