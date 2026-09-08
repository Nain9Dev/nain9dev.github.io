import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parse } from 'parse5';
import { extractSegments, makeCatalog, segmentId } from './lib/localization.mjs';

test('Release, preview and review CLIs enforce coverage without publishing drafts', async () => {
  await mkdir('.astro', { recursive: true });
  const root = await mkdtemp(resolve('.astro/localization-test-'));
  const scriptRoot = resolve('scripts');
  const write = async (path, value) => {
    await mkdir(join(root, path, '..'), { recursive: true });
    await writeFile(join(root, path), typeof value === 'string' ? value : JSON.stringify(value));
  };
  const run = (script, ...args) => spawnSync(process.execPath, [join(scriptRoot, script), ...args], { cwd: root, encoding: 'utf8' });
  const source = '<html lang="es-ES"><head><title>Inicio</title><link rel="canonical" href="https://www.naindev.com/"><meta name="robots" content="index, follow"><meta property="og:url" content="https://www.naindev.com/"><script id="localized-ui" type="application/json">{}</script></head><body><header class="header-layout"><a class="button" href="/">Inicio</a></header><main><h1>Texto oficial.</h1></main></body></html>';
  const values = { Inicio: 'Home', 'Texto oficial.': 'Official text.' };
  const segments = extractSegments(parse(source));
  const catalog = makeCatalog(segments, segments.map(item => values[item.source]));
  catalog[segmentId('Ayuda')] = { source: 'Ayuda', target: 'Help', status: 'reviewed' };
  try {
    await write('dist/index.html', source);
    await write('public/assets/data/projects.json', []);
    for (const file of ['case-studies', 'impact-metrics', 'tech-stack', 'terminal-commands']) await write(`public/assets/data/${file}.json`, {});
    await write('src/i18n/runtime.json', { terminalHint: 'Ayuda' });
    await write('src/i18n/en-US.json', catalog);
    const first = run('build-locales.mjs');
    assert.equal(first.status, 0, first.stderr);
    const release = await readFile(join(root, 'dist/en/index.html'), 'utf8');
    assert.ok(release.includes('<h1>Official text.</h1>'));
    const repeated = run('build-locales.mjs');
    assert.equal(repeated.status, 0, repeated.stderr);
    assert.equal(await readFile(join(root, 'dist/en/index.html'), 'utf8'), release, 'Repeated localization must be deterministic');

    await write('dist/index.html', source.replace('Texto oficial.', 'Texto nuevo.'));
    const missing = run('build-locales.mjs');
    assert.notEqual(missing.status, 0);
    assert.match(missing.stderr, /Missing translation/);
    assert.equal(await readFile(join(root, 'dist/en/index.html'), 'utf8'), release, 'Failed coverage must not partially replace English output');
    catalog[segmentId('Texto nuevo.')] = { source: 'Texto nuevo.', target: 'New text.', status: 'draft' };
    await write('src/i18n/en-US.json', catalog);
    assert.match(run('build-locales.mjs').stderr, /requires review/);

    await write('dist/index.html', source);
    const candidate = { id: segmentId('Texto oficial.'), source: 'Texto oficial.', target: 'Revised official text.', issues: [] };
    await write('.astro/translations/review.json', { candidates: [candidate] });
    await write('.astro/localized-preview/removed/index.html', 'stale preview');
    const preview = run('build-locales.mjs', '--preview');
    assert.equal(preview.status, 0, preview.stderr);
    const previewHTML = await readFile(join(root, '.astro/localized-preview/en/index.html'), 'utf8');
    assert.ok(previewHTML.includes('noindex, nofollow'));
    assert.ok(previewHTML.includes('<h1>Revised official text.</h1>'));
    await assert.rejects(readFile(join(root, '.astro/localized-preview/removed/index.html')), { code: 'ENOENT' });
    assert.equal(await readFile(join(root, 'dist/en/index.html'), 'utf8'), release);
    const beforeApproval = await readFile(join(root, 'src/i18n/en-US.json'), 'utf8');
    const stale = run('review-translations.mjs', '--accept', 'outdated-snapshot');
    assert.notEqual(stale.status, 0);
    assert.match(stale.stderr, /snapshot changed/);
    assert.equal(await readFile(join(root, 'src/i18n/en-US.json'), 'utf8'), beforeApproval);
  } finally {
    // The path comes directly from mkdtemp under the workspace's generated directory.
    assert.ok(root.startsWith(resolve('.astro/localization-test-')));
    await rm(root, { recursive: true, force: true });
  }
});
