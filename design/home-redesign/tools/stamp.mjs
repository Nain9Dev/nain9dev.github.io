// Cache busting for the prototype: every page links its CSS and JS as assets/<file>?v=N, and N goes up
// each time the file changes, so a browser never serves an old copy after an update.
// tools/versions.json keeps, per asset, its version number and the SHA-256 of the content it was
// stamped with. Run `node tools/stamp.mjs` after editing an asset; tools/check.mjs fails if a link has
// no ?v=, if N does not match the manifest, or if a file changed without its number going up.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST = join(ROOT, 'tools', 'versions.json');
const LINK = /(\s(?:href|src)=")(assets\/[^"?#]+\.(?:css|js))(?:\?v=\d+)?(")/g;

export async function pages() {
  return (await readdir(ROOT)).filter((f) => f.endsWith('.html')).sort();
}

export async function sha(file) {
  return createHash('sha256').update(await readFile(join(ROOT, file))).digest('hex');
}

export async function loadManifest() {
  try { return JSON.parse(await readFile(MANIFEST, 'utf8')); } catch { return {}; }
}

async function main() {
  const manifest = await loadManifest();
  const used = new Set();
  const list = await pages();
  for (const f of list) for (const m of (await readFile(join(ROOT, f), 'utf8')).matchAll(LINK)) used.add(m[2]);
  const bumped = [];
  for (const a of [...used].sort()) {
    const h = await sha(a);
    const prev = manifest[a];
    if (!prev) { manifest[a] = { v: 1, sha256: h }; bumped.push(`${a} v1 (new)`); }
    else if (prev.sha256 !== h) { manifest[a] = { v: prev.v + 1, sha256: h }; bumped.push(`${a} v${prev.v} → v${prev.v + 1}`); }
  }
  for (const k of Object.keys(manifest)) if (!used.has(k)) delete manifest[k];
  let rewritten = 0;
  for (const f of list) {
    const src = await readFile(join(ROOT, f), 'utf8');
    const out = src.replace(LINK, (_, a, path, z) => `${a}${path}?v=${manifest[path].v}${z}`);
    if (out !== src) { await writeFile(join(ROOT, f), out); rewritten++; }
  }
  const sorted = Object.fromEntries(Object.keys(manifest).sort().map((k) => [k, manifest[k]]));
  await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
  console.log(bumped.length ? bumped.join('\n') : 'no asset changed');
  console.log(`${rewritten} page(s) rewritten, ${used.size} assets linked`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) await main();
