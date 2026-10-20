import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { addEntry, approveEntry, removeEntry, serialize, validateEntry } from './lib/testimonials.mjs';

// Safe authoring of testimonial entries. See specs/next-testimonials and docs/06-runbook/testimonials.md.
const CLI = fileURLToPath(new URL('./testimonial.mjs', import.meta.url));

const valid = () => ({
  id: 'contrast3d-partner-2026',
  name: 'Full Name',
  role: 'Role',
  company: 'Company',
  companyUrl: 'https://example.com/',
  relationship: 'partner',
  date: '2026-10-20',
  quote: 'The author wrote this text in their own words.',
  consent: { granted: true, date: '2026-10-20', evidence: 'Email of 2026-10-20 confirming publication' },
});

test('validateEntry accepts a complete entry and rejects each missing or invalid part', () => {
  assert.deepEqual(validateEntry(valid()), []);
  const cases = [
    ['no consent', (entry) => { delete entry.consent; }],
    ['consent not granted', (entry) => { entry.consent.granted = false; }],
    ['short evidence', (entry) => { entry.consent.evidence = 'ok'; }],
    ['bad relationship', (entry) => { entry.relationship = 'friend'; }],
    ['short quote', (entry) => { entry.quote = 'Great.'; }],
    ['bad date', (entry) => { entry.date = 'yesterday'; }],
    ['bad id', (entry) => { entry.id = 'Not A Slug'; }],
    ['missing name', (entry) => { entry.name = ''; }],
    ['insecure url', (entry) => { entry.sourceUrl = 'http://example.com/'; }],
    ['unknown status', (entry) => { entry.status = 'published'; }],
  ];
  for (const [label, mutate] of cases) {
    const entry = valid();
    mutate(entry);
    assert.notDeepEqual(validateEntry(entry), [], label);
  }
});

test('addEntry stores new entries as pending, never as approved, and rejects duplicates', () => {
  const added = addEntry([], { ...valid(), status: 'approved' });
  assert.equal(added.length, 1);
  assert.equal(added[0].status, 'pending');
  assert.throws(() => addEntry(added, valid()), /already exists/);
  assert.throws(() => addEntry([], { ...valid(), consent: undefined }), /consent/);
});

test('approveEntry flips one pending entry and fails for unknown ids', () => {
  const list = addEntry([], valid());
  const approved = approveEntry(list, 'contrast3d-partner-2026');
  assert.equal(approved[0].status, 'approved');
  assert.equal(list[0].status, 'pending', 'the input list is not mutated');
  assert.throws(() => approveEntry(list, 'nobody'), /not found/);
});

test('removeEntry drops one entry (a rejected recommendation) and fails for unknown ids', () => {
  const list = addEntry([], valid());
  assert.deepEqual(removeEntry(list, 'contrast3d-partner-2026'), []);
  assert.equal(list.length, 1, 'the input list is not mutated');
  assert.throws(() => removeEntry(list, 'nobody'), /not found/);
});

test('serialize writes LF, two-space JSON and a final newline', () => {
  const text = serialize(addEntry([], valid()));
  assert.ok(text.endsWith('\n'));
  assert.ok(!text.includes('\r'));
  assert.match(text, /^\[\n  \{\n    "id"/);
  assert.equal(serialize([]), '[]\n');
});

test('the CLI adds a pending entry from a file, then approves it with an explicit command', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'testimonials-'));
  try {
    const data = join(dir, 'testimonials.json');
    const input = join(dir, 'entry.json');
    await writeFile(data, '[]\n');
    await writeFile(input, JSON.stringify(valid()));
    const run = (...args) => execFileSync(process.execPath, [CLI, ...args, '--data', data], { encoding: 'utf8' });

    assert.match(run('add', input), /pending/);
    assert.equal(JSON.parse(await readFile(data, 'utf8'))[0].status, 'pending');

    assert.match(run('approve', 'contrast3d-partner-2026'), /approved/);
    assert.equal(JSON.parse(await readFile(data, 'utf8'))[0].status, 'approved');

    await writeFile(input, JSON.stringify({ ...valid(), id: 'other', consent: undefined }));
    assert.throws(() => run('add', input), /consent/);
    assert.equal(JSON.parse(await readFile(data, 'utf8')).length, 1, 'a rejected entry changes nothing');
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
