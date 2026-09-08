import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse } from 'parse5';
import { extractSegments, segmentId, normalize, mapData } from './lib/localization.mjs';

export async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? walk(join(directory, entry.name)) : [join(directory, entry.name)]))).flat();
}

export async function collectSources(directory = 'dist') {
  const source = new Map();
  function add(segment, page) {
    const prior = source.get(segment.id);
    if (prior && prior.source !== segment.source) throw new Error('Segment hash collision');
    if (prior) prior.pages = [...new Set([...prior.pages, page])];
    else source.set(segment.id, { id: segment.id, source: segment.source, context: segment.context, pages: [page] });
  }
  for (const file of (await walk(directory)).filter(file => file.endsWith('.html') && !relative(directory, file).startsWith(`en${process.platform === 'win32' ? '\\' : '/'}`))) {
    const html = await readFile(file, 'utf8');
    if (/http-equiv="refresh"/i.test(html)) continue;
    const page = relative(directory, file).replaceAll('\\', '/');
    for (const segment of extractSegments(parse(html, { scriptingEnabled: false }))) add(segment, page);
  }
  const projects = JSON.parse(await readFile('public/assets/data/projects.json', 'utf8'));
  mapData(projects, (value, key) => {
    const source = normalize(value);
    add({ id: segmentId(source), source, context: `project:${key}` }, 'assets/data/projects.json');
    return value;
  });
  const commands = JSON.parse(await readFile('public/assets/data/terminal-commands.json', 'utf8'));
  for (const [command, html] of Object.entries(commands)) {
    for (const segment of extractSegments(parse(html))) add(segment, `terminal:${command}`);
  }
  for (const file of ['case-studies.json', 'impact-metrics.json', 'tech-stack.json']) {
    const data = JSON.parse(await readFile(`public/assets/data/${file}`, 'utf8'));
    mapData(data, (value, key) => {
      const source = normalize(value);
      add({ id: segmentId(source), source, context: `data:${key}` }, file);
      return value;
    });
  }
  const runtime = JSON.parse(await readFile('src/i18n/runtime.json', 'utf8'));
  for (const [key, value] of Object.entries(runtime)) {
    const source = normalize(value);
    add({ id: segmentId(source), source, context: `interface:${key}` }, 'runtime.json');
  }
  return [...source.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export async function syncTranslations() {
  const sources = await collectSources();
  let catalog = {};
  try { catalog = JSON.parse(await readFile('src/i18n/en-US.json', 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const pending = sources.filter(segment => catalog[segment.id]?.source !== segment.source || catalog[segment.id]?.status !== 'reviewed');
  await mkdir('.astro/translations', { recursive: true });
  await writeFile('.astro/translations/source.json', JSON.stringify(sources, null, 2) + '\n');
  await writeFile('.astro/translations/pending.json', JSON.stringify(pending, null, 2) + '\n');
  console.log(`Translation catalog: ${sources.length} unique segments, ${pending.length} pending review.`);
  return { sources, pending, catalog };
}

if (process.argv[1]?.endsWith('sync-translations.mjs')) await syncTranslations();
