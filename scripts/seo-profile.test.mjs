import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Search metadata aligned with the profile. See specs/013-seo-profile-alignment.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const OLD_POSITIONING = /Arquitectura Backend,? 3D e IA/;
const JOB_TITLE = 'Arquitecto de Software Full Stack';

test('SEO-011: the home title and description follow the current profile', async () => {
  const seo = await read('src/utils/seo.ts');
  assert.ok(seo.includes(`title: 'NainDev | Aitor Nain · ${JOB_TITLE}'`));
  const description = seo.match(/description: '([^']+)'/)[1];
  assert.match(description, /conformidad determinista/);
  assert.match(description, /Python/);
  assert.match(description, /\.NET/);
  assert.doesNotMatch(seo, OLD_POSITIONING);
});

test('SEO-012: the Person structured data carries the current job title', async () => {
  const component = await read('src/components/SEO.astro');
  assert.ok(component.includes(`"jobTitle": "${JOB_TITLE}"`));
});

test('SEO-013: the blog and service hubs drop the old positioning', async () => {
  for (const file of ['src/pages/blog/index.astro', 'src/pages/servicios/index.astro']) {
    const page = await read(file);
    assert.doesNotMatch(page, OLD_POSITIONING, file);
    assert.match(page, /\| NainDev"/, file);
  }
});
