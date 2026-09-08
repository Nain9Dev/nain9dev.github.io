import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { syncTranslations } from './sync-translations.mjs';
import { validateTranslation } from './lib/localization.mjs';

const { sources, catalog } = await syncTranslations();
let drafts = {};
try { drafts = JSON.parse(await readFile('.astro/translations/drafts.json', 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
let edits = {};
try { edits = JSON.parse(await readFile('.astro/translations/edits.json', 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
const candidates = sources.map(source => {
  const draft = catalog[source.id]?.status === 'reviewed' ? catalog[source.id] : drafts[source.id];
  const target = edits[source.id]?.source === source.source ? edits[source.id].target : draft?.target;
  const issues = [];
  if (draft?.source !== source.source && edits[source.id]?.source !== source.source) issues.push('Missing current source');
  try { validateTranslation(source.source, target); } catch (error) { issues.push(error.message); }
  if (/\((?:context|schema|meta):|(?:^|\n)DATA:|⟦[^⟧]*[a-z]/i.test(target ?? '')
    || (/\((?:p|div|h[1-6]|div:aria-label|Project Title)\)\s*$/i.test(target ?? '')
      && !/\((?:p|div|h[1-6]|div:aria-label|Project Title)\)\s*$/i.test(source.source))) {
    issues.push('Generated context leaked into prose');
  }
  if (/<\/?[a-z][^>]*>/i.test(target ?? '') && !/<\/?[a-z][^>]*>/i.test(source.source)) {
    issues.push('Generated markup leaked into prose');
  }
  return { ...source, target, issues };
});
const snapshot = candidates.map(({ id, source, target }) => ({ id, source, target }));
const digest = createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');
const findings = candidates.filter(item => item.issues.length);
const report = ['# English Translation Review', '', `Snapshot: ${digest}`, '',
  `${candidates.length} segments; ${findings.length} structural findings.`, '',
  'This report does not certify semantic equivalence or constitute owner approval.', '',
  ...candidates.map(item => `## ${item.id}\n\nPages: ${item.pages.join(', ')}\n\nSpanish:\n\n${item.source}\n\nEnglish:\n\n${item.target ?? '(missing)'}\n\nFindings: ${item.issues.join('; ') || 'No structural finding'}\n`)];
await writeFile('.astro/translations/review.md', report.join('\n') + '\n');
await writeFile('.astro/translations/review.json', JSON.stringify({ digest, candidates }, null, 2) + '\n');
console.log(`Review snapshot ${digest}: ${findings.length} structural findings.`);
const acceptIndex = process.argv.indexOf('--accept');
if (acceptIndex !== -1) {
  if (process.argv[acceptIndex + 1] !== digest) throw new Error('Approval snapshot changed; review the current report');
  if (findings.length) throw new Error('Structural findings must be resolved before accepting translations');
  for (const item of candidates) catalog[item.id] = { source: item.source, target: item.target, status: 'reviewed' };
  await mkdir('src/i18n', { recursive: true });
  await writeFile('src/i18n/en-US.json', JSON.stringify(catalog, null, 2) + '\n');
  console.log('The explicitly reviewed snapshot was saved. No commit or deployment was performed.');
}
if (findings.length) process.exitCode = 2;
