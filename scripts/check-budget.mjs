// Runs Lighthouse against the built dist/ and fails when a page breaks the budget (spec 032, ADR-0005).
// Usage: npm run check:budget (after npm run build). Reports stay in .astro/budget/.
import { createServer } from 'node:http';
import { readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { extname, join, resolve, sep } from 'node:path';
import { gzipSync } from 'node:zlib';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { PAGES, RUNS, TARGET_BENCHMARK_INDEX, cpuSlowdownFor, evaluate } from './lib/performance-budget.mjs';

const ROOT = 'dist';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };

const ROOT_PATH = resolve(ROOT);

async function resolveFile(urlPath) {
  let file = resolve(ROOT_PATH, `.${decodeURIComponent(urlPath.split('?')[0])}`);
  if (file !== ROOT_PATH && !file.startsWith(ROOT_PATH + sep)) return null; // never serve outside dist/
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
  } catch {
    return null;
  }
  return file;
}

const server = createServer(async (request, response) => {
  const file = await resolveFile(request.url);
  try {
    if (!file) throw new Error('outside dist');
    const body = await readFile(file);
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    // Compress text like GitHub Pages and Cloudflare do, so transfer sizes match production.
    if (/^(text|application\/(json|xml)|image\/svg)/.test(type) && /gzip/.test(request.headers['accept-encoding'] ?? '')) {
      response.writeHead(200, { 'content-type': type, 'content-encoding': 'gzip' });
      response.end(gzipSync(body));
    } else {
      response.writeHead(200, { 'content-type': type });
      response.end(body);
    }
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox'] });
const results = {};
let calibration;
try {
  // Warm-up run: measures this machine's benchmarkIndex to calibrate the CPU slowdown.
  const { lhr: warmup } = await lighthouse(`${origin}/`, { port: chrome.port, onlyCategories: ['performance'], output: 'json', logLevel: 'error' });
  const benchmarkIndex = warmup.environment.benchmarkIndex;
  calibration = { benchmarkIndex, cpuSlowdownMultiplier: cpuSlowdownFor(benchmarkIndex) };
  console.log(`Host benchmarkIndex ${Math.round(benchmarkIndex)} → CPU slowdown ${calibration.cpuSlowdownMultiplier}x (target index ${TARGET_BENCHMARK_INDEX}).`);
  for (const page of PAGES) {
    results[page] = [];
    for (let run = 0; run < RUNS; run++) {
      const { lhr } = await lighthouse(`${origin}${page}`, { port: chrome.port, onlyCategories: ['performance'], output: 'json', logLevel: 'error' }, {
        extends: 'lighthouse:default',
        settings: { throttling: { cpuSlowdownMultiplier: calibration.cpuSlowdownMultiplier } }
      });
      results[page].push(lhr);
    }
  }
} finally {
  chrome.kill();
  server.close();
}

await mkdir('.astro/budget', { recursive: true });
await writeFile('.astro/budget/results.json', JSON.stringify({ calibration, pages: Object.fromEntries(Object.entries(results).map(([page, reports]) => [page, reports.map((r) => ({ score: r.categories.performance.score, audits: Object.fromEntries(['largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'total-byte-weight'].map((a) => [a, r.audits[a].numericValue])) }))])) }, null, 2));

// Per-run values make CI noise visible when a median fails.
for (const [page, reports] of Object.entries(results)) {
  const runs = reports.map((r) => `${Math.round(r.categories.performance.score * 100)}/${Math.round(r.audits['total-blocking-time'].numericValue)}ms`);
  console.log(`runs ${page.padEnd(12)} score/TBT: ${runs.join(', ')}`);
  // For runs with blocking time, name the long tasks so intermittent causes can be traced.
  for (const [index, r] of reports.entries()) {
    if (r.audits['total-blocking-time'].numericValue < 50) continue;
    const tasks = (r.audits['long-tasks']?.details?.items ?? []).slice(0, 4)
      .map((t) => `${String(t.url).replace(origin, '')} ${Math.round(t.duration)}ms@${Math.round(t.startTime)}`);
    console.log(`     run ${index + 1} long tasks: ${tasks.join(' | ') || 'none reported'}`);
  }
}

const rows = evaluate(results);
for (const row of rows) {
  const value = row.metric === 'performance' || row.metric === 'cls' ? row.value.toFixed(3) : Math.round(row.value);
  console.log(`${row.failed ? 'FAIL' : 'ok  '} ${row.page.padEnd(12)} ${row.metric.padEnd(12)} ${String(value).padStart(8)}  (limit ${row.limit})`);
}
const failures = rows.filter((row) => row.failed);
if (failures.length) {
  console.error(`Performance budget broken by ${failures.length} metric(s).`);
  process.exit(1);
}
console.log(`Performance budget passed: ${PAGES.length} pages × ${RUNS} runs.`);
