import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { findConfidential, hashTerm, normalize } from './lib/confidential.mjs';

// The guard keeps the list of confidential terms out of this public repository: it stores only SHA-256
// hashes of normalized terms (scripts/confidential-hashes.json). These tests use made-up terms.

test('CONF-001: normalize ignores case, accents, punctuation and spacing', () => {
  assert.equal(normalize('  Álamo-Verde_01 '), 'alamo verde 01');
  assert.equal(normalize('ZEBRA   crossing'), 'zebra crossing');
});

test('CONF-002: spellings of one term share a hash, and a hash is 64 hex characters', () => {
  assert.equal(hashTerm('Alamo-Verde'), hashTerm('alamo verde'));
  assert.equal(hashTerm('Álamo'), hashTerm('alamo'));
  assert.match(hashTerm('x'), /^[0-9a-f]{64}$/);
  assert.notEqual(hashTerm('alamo'), hashTerm('alamo verde'));
});

test('CONF-003: a term is found inside prose, across punctuation and case', () => {
  const hashes = [hashTerm('zebra crossing')];
  assert.deepEqual(findConfidential('The Zebra-Crossing project ships today.', hashes), ['zebra crossing']);
  assert.deepEqual(findConfidential('zebra\ncrossing', hashes), ['zebra crossing']);
});

test('CONF-004: a term of up to four words is found; a longer one is refused when hashed', () => {
  const four = 'one two three four';
  assert.deepEqual(findConfidential('see one, two; three-four now', [hashTerm(four)]), [four]);
  assert.throws(() => hashTerm('one two three four five'), /four words/);
});

test('CONF-005: a numbered identifier is found with # standing for any number', () => {
  const hashes = [hashTerm('qx-#'), hashTerm('qx-fin-#')];
  assert.deepEqual(findConfidential('profile QX-42 and qx-fin-7', hashes), ['qx 42', 'qx fin 7']);
  assert.deepEqual(findConfidential('qx has no number', hashes), []);
});

test('CONF-006: whole words only, so a term does not match inside a longer word', () => {
  const hashes = [hashTerm('cat')];
  assert.deepEqual(findConfidential('concatenate cats category', hashes), []);
  assert.deepEqual(findConfidential('a cat sat', hashes), ['cat']);
});

test('CONF-007: clean text and an empty list report nothing', () => {
  assert.deepEqual(findConfidential('Nothing to see here.', [hashTerm('zebra crossing')]), []);
  assert.deepEqual(findConfidential('zebra crossing', []), []);
});

test('CONF-008: the committed list holds only unique SHA-256 hashes, no readable term', async () => {
  const file = fileURLToPath(new URL('./confidential-hashes.json', import.meta.url));
  const list = JSON.parse(await readFile(file, 'utf8'));
  assert.ok(Array.isArray(list) && list.length > 0, 'the list is a non-empty array');
  for (const entry of list) assert.match(entry, /^[0-9a-f]{64}$/, 'every entry is a 64-hex hash');
  assert.equal(new Set(list).size, list.length, 'no duplicates');
});
