// Guards for specs/022-remove-cloudflare-purge.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('DEP-001: the deploy workflow neither calls the Cloudflare API nor reads Cloudflare secrets', async () => {
  const workflow = await readFile('.github/workflows/deploy.yml', 'utf8');
  assert.doesNotMatch(workflow, /api\.cloudflare\.com/);
  assert.doesNotMatch(workflow, /secrets\.CLOUDFLARE_/);
  assert.doesNotMatch(workflow, /purge/i);
});
