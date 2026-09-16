import test from 'node:test';
import assert from 'node:assert/strict';
import { findBlockedClaims, scanSources } from './check-claims.mjs';

test('matcher flags the unverified model count in both locales', () => {
  for (const text of ['<strong>+50M Modelos</strong>', '+50M models processed', 'validate 50M models']) {
    assert.notDeepEqual(findBlockedClaims(text), [], text);
  }
});

test('matcher ignores file sizes and unrelated numbers', () => {
  assert.deepEqual(findBlockedClaims('GLB files larger than 50MB'), []);
  assert.deepEqual(findBlockedClaims('millones de modelos 3D'), []);
});

test('tracked sources publish no blocked claims', async () => {
  assert.deepEqual(await scanSources(), []);
});
