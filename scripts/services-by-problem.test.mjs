import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Services index grouped by client problem. See specs/next-services-by-problem.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8');
const PAGE = 'src/pages/servicios/index.astro';

async function publishedSlugs() {
  const slugs = [];
  for (const file of await readdir(join(ROOT, 'src/content/servicios'))) {
    if (!file.endsWith('.mdx')) continue;
    const source = await read(`src/content/servicios/${file}`);
    if (!/^draft:\s*true/m.test(source)) slugs.push(file.replace(/\.mdx$/, ''));
  }
  return slugs;
}

async function groups() {
  const page = await read(PAGE);
  const block = page.match(/const problemGroups = \[([\s\S]*?)\n\];/)?.[1] ?? '';
  const found = [...block.matchAll(/title:\s*'([^']+)'[\s\S]*?slugs:\s*\[([^\]]*)\]/g)].map((match) => ({
    title: match[1],
    slugs: [...match[2].matchAll(/'([^']+)'/g)].map((slug) => slug[1]),
  }));
  return found;
}

test('SVC-001: the index groups services under problem headings', async () => {
  const page = await read(PAGE);
  const found = await groups();
  assert.equal(found.length, 5);
  assert.match(page, /<h2[^>]*>\{group\.title\}<\/h2>/);
  assert.match(page, /<h3><a class="card-stretch" href=\{`\/servicios\/\$\{servicio\.id\}`\}>\{servicio\.data\.title\}<\/a><\/h3>/);
  for (const group of found) assert.match(group.title, /^(Mi|Tengo|Quiero)\b/, group.title);
});

test('SVC-002: every published service is assigned to exactly one group, with a fallback', async () => {
  const assigned = (await groups()).flatMap((group) => group.slugs);
  assert.equal(new Set(assigned).size, assigned.length, 'no slug is listed twice');
  assert.deepEqual([...assigned].sort(), (await publishedSlugs()).sort());
  assert.match(await read(PAGE), /Otros servicios/);
});

test('SVC-003: the page keeps one H1 and the booking call', async () => {
  const page = await read(PAGE);
  assert.equal(page.match(/<h1[\s>]/g)?.length, 1);
  assert.match(page, /Agendar llamada gratuita/);
});

test('SVC-005: group headings promise no figures or guarantees', async () => {
  for (const group of await groups()) {
    assert.doesNotMatch(group.title, /\d(?!D)|garant|100\s*%|sin ca[ií]das|inmediat/i, group.title);
  }
});
