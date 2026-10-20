import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Blog calls to action point to the checklist page. See specs/next-blog-lead-forms.
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BLOG = join(ROOT, 'src/content/blog');

async function posts() {
  const files = (await readdir(BLOG)).filter((file) => /\.mdx?$/.test(file));
  return Promise.all(files.map(async (file) => ({ file, source: await readFile(join(BLOG, file), 'utf8') })));
}

test('LEAD-010: no blog post embeds a form or a third-party form endpoint', async () => {
  for (const { file, source } of await posts()) {
    assert.doesNotMatch(source, /<form\b/i, `${file} has no form`);
    assert.doesNotMatch(source, /formsubmit\.co|_autoresponse/i, `${file} has no third-party endpoint`);
  }
});

test('LEAD-010: every lead-magnet block links to the checklist page', async () => {
  let blocks = 0;
  for (const { file, source } of await posts()) {
    for (const block of source.match(/<div class="blog-cta" id="lead-magnet">[\s\S]*?<\/div>/g) ?? []) {
      blocks += 1;
      assert.match(block, /href="\/recursos\/checklist-ia"/, `${file} links the checklist page`);
    }
  }
  assert.equal(blocks, 4);
});

test('LEAD-011: no blog post promises a PDF or source code the site does not serve', async () => {
  for (const { file, source } of await posts()) {
    assert.doesNotMatch(source, /assets\/pdf\//, `${file} links no PDF`);
    assert.doesNotMatch(source, /código fuente completo/i, `${file} promises no source code`);
  }
});
