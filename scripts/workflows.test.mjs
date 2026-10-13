// Guards for specs/024-ci-workflow-hardening.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const DIR = '.github/workflows';
const workflows = async () => Promise.all((await readdir(DIR))
  .filter((file) => /\.ya?ml$/.test(file))
  .map(async (file) => ({ file, text: await readFile(join(DIR, file), 'utf8') })));

// Splits a workflow into its top-level preamble and one block per job (two-space indented keys under `jobs:`).
function jobs(text) {
  const [, body = ''] = text.split(/^jobs:\s*$/m);
  return Object.fromEntries(body.split(/^(?=  [\w-]+:\s*$)/m).filter((block) => block.trim())
    .map((block) => [block.match(/^  ([\w-]+):/)[1], block]));
}

test('CI-001: every action is pinned to a commit SHA with a version comment', async () => {
  for (const { file, text } of await workflows()) {
    for (const [line] of text.matchAll(/^\s*(?:-\s*)?uses:.*$/gm)) {
      assert.match(line, /uses:\s*[\w.-]+\/[\w.-]+(?:\/[\w./-]+)?@[0-9a-f]{40}\s+#\s*v\d+\.\d+\.\d+\s*$/, `${file}: ${line.trim()}`);
    }
  }
});

test('CI-002: write permissions are granted only to the Pages deploy job', async () => {
  for (const { file, text } of await workflows()) {
    const preamble = text.split(/^jobs:\s*$/m)[0];
    assert.doesNotMatch(preamble, /:\s*write/, `${file}: workflow-level write permission`);
    assert.match(preamble, /^permissions:\s*\n\s+contents:\s*read\s*$/m, `${file}: workflow-level permissions must be contents: read`);
    for (const [name, block] of Object.entries(jobs(text))) {
      const deploysPages = /uses:\s*actions\/deploy-pages@/.test(block);
      if (!deploysPages) assert.doesNotMatch(block, /:\s*write/, `${file}/${name}: write permission outside the deploy job`);
      else {
        assert.match(block, /pages:\s*write/, `${file}/${name}`);
        assert.match(block, /id-token:\s*write/, `${file}/${name}`);
      }
    }
  }
});

test('CI-003: checkout never persists credentials', async () => {
  for (const { file, text } of await workflows()) {
    for (const match of text.matchAll(/uses:\s*actions\/checkout@[^\n]*\n((?:\s{8,}[^\n]*\n)*)/g)) {
      assert.match(match[1], /persist-credentials:\s*false/, `${file}: checkout without persist-credentials: false`);
    }
  }
});

test('CI-004: dependencies are installed with npm ci only', async () => {
  for (const { file, text } of await workflows()) {
    assert.doesNotMatch(text, /npm install\b/, `${file}: npm install ignores the lockfile`);
  }
});
