#!/usr/bin/env node
// Prototype check, round 4 (brandbook v2.0: two expressions of the brand, deep blue and paper).
// Run from design/home-redesign with `node tools/check.mjs` before every push.
// No dependency is committed: it uses the Playwright already installed in the environment
// (`playwright` on the module path, /opt/node-tools, or PLAYWRIGHT_MODULE=/path/to/index.mjs).
// Helpers: tools/lib/motion-rules.mjs (CSS reader and the motion rules), tools/lib/probes.mjs (code
// that runs in the page: page facts, contrast walker, first-paint and animation recorders).
//
// It serves this folder with the hardened CSP as an HTTP header, blocks and counts every other host,
// and checks every root page plus brandbook/index.html (served at /brandbook/), in Spanish and English,
// at 390 and 1440 px, in both expressions: deep blue (system dark, the default) and paper (system light
// with no stored choice), plus a stored choice that contradicts the system on the home.
//
//   1–6   page loads in both expressions: console errors, CSP violations, other hosts, overflow, one H1,
//         heading order, one <main>, lang, internal links and anchors, rel="noopener noreferrer",
//         width/height on every <img>; interactions under the CSP (menu, notice, console, hero, LAB)
//   7     claims (BLOCKED_CLAIMS from origin/main), phone numbers, forbidden phrases
//   8     no inline handlers or inline scripts, javascript: URLs, eval, HTML injection, third parties
//   9     the console prints an injection payload as text
//   10    reduced motion: final state, 0 animation frames, 0 running animations
//   11    motion budget (deep blue): idle frames, long tasks at 390 px with 4× CPU, JavaScript weight
//         of boot.js + motion.js + theme.js (12 KB gz), ES5 syntax, hero canvas DPR
//   12    secret scan, forbidden files, commits ahead of the remote (author, no trailers, no AI mention)
//   13    exports/<page>/NN-<section>-<width>-<lang>-<theme>.png and exports/first-frame/
//   14    (A) every load renders the expected expression (data-theme, background, favicon, theme-color,
//         switch state) and the invariant elements stay deep blue
//   15    (B) WCAG AA contrast of every visible text pair in both expressions (4.5:1, 3:1 for large text)
//   16    (B) non-text boundaries of controls, 3:1 where the border is the only boundary (reported;
//         fails only for text fields)
//   17    (C) no flash of the wrong expression: theme.js first in <head>, classic, before any stylesheet,
//         no inline script; first painted frame captured with CDP screencast and sampled
//   18    (D) the home fits in 7 screens at 1440 × 900 (scrollHeight ≤ 6300), privacy notice visible
//   19    (E) 22 projects on proyectos.html matching origin/main projects.json, 6 on the home with a
//         public demo on *.naindev.com, filter chips filter correctly
//   20    (F) cache busting: ?v=N on every assets/ link equals tools/versions.json and the file hash
//   21    (G) motion rules, static: properties, 120–520 ms, two easings, keyframes, JavaScript
//   22    (G) motion rules, runtime: every animation seen by document.getAnimations()
//   23    (H) the expression switch: flips, persists after reload, works with storage blocked
//
// Flags: --no-exports skips the captures; --quick checks 1440 px ES only (and fewer pages where noted).
// CHECK_JOBS=N sets how many pages load in parallel (default 4); CHECK_PAGES=a.html,b.html limits the pages
// (development only); CHECK_EXPORTS_DIR=/path writes the captures elsewhere. Exit code 1 on any failure.
import http from 'node:http';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFile, readdir, stat, access, mkdir, rm, writeFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join, normalize, extname, dirname, relative, posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseCss, checkMotionCss, checkMotionJs, allowedProperty, allowedEasing, movements, MIN_MS, MAX_MS, CYCLE_MS } from './lib/motion-rules.mjs';
import { pageFacts, contrastProbe, firstPaintInit, animRecorderInit } from './lib/probes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARGS = new Set(process.argv.slice(2));
const QUICK = ARGS.has('--quick');
const EXPORTS = !ARGS.has('--no-exports') && !QUICK;
const JOBS = Math.max(1, +process.env.CHECK_JOBS || 4);
const ROOT_PAGES = (await readdir(ROOT)).filter((f) => f.endsWith('.html')).sort();
const BRANDBOOK = 'brandbook/index.html';
const HAS_BB = existsSync(join(ROOT, BRANDBOOK));
// The brandbook is a standalone document (in production it is its own site, brand.naindev.com): Spanish only, no
// theme.js, no switch, it follows prefers-color-scheme with CSS alone. It is served with its own policy, the site's
// CSP plus data: fonts, because it embeds its fonts to stay self-contained (it loads ../assets/fonts first).
const STANDALONE = (p) => p.file === BRANDBOOK;
// CHECK_PAGES=index.html,proyectos.html limits the browser and static page checks while developing.
const ONLY = process.env.CHECK_PAGES ? new Set(process.env.CHECK_PAGES.split(',').map((x) => x.trim())) : null;
const PAGES = [...ROOT_PAGES.map((f) => ({ file: f, url: f, name: f.replace(/\.html$/, '') })),
  ...(HAS_BB ? [{ file: BRANDBOOK, url: 'brandbook/', name: 'brandbook' }] : [])].filter((p) => !ONLY || ONLY.has(p.file) || p.file === 'index.html');
const HOME = PAGES.find((p) => p.file === 'index.html');
// Pages that load the shared system: theme.js (the expression switch) and nain.css (the invariant deep blue elements).
const HAS_THEME_JS = (p) => /<script[^>]+src="[^"]*assets\/theme\.js/.test(SRC_OF(p));
const USES_NAIN = (p) => /<link[^>]+href="[^"]*assets\/nain\.css/.test(SRC_OF(p));
const SRC_OF = (p) => (globalThis.__sources || {})[p.file] || '';
const byFile = (f) => PAGES.find((p) => p.file === f);
const WIDTHS = QUICK ? [1440] : [390, 1440];
const LANGS = QUICK ? ['es'] : ['es', 'en'];
// The two expressions, and a stored choice (localStorage "theme") that contradicts the system.
const THEMES = {
  deep: { scheme: 'dark', stored: null, expect: 'dark', label: 'deep blue: system dark, no choice' },
  paper: { scheme: 'light', stored: null, expect: 'light', label: 'paper: system light, no choice' },
  'chose-paper': { scheme: 'dark', stored: 'light', expect: 'light', label: 'paper chosen (theme=light) on a dark system' },
  'chose-deep': { scheme: 'light', stored: 'dark', expect: 'dark', label: 'deep blue chosen (theme=dark) on a light system' },
};
const EXPECT = { dark: { rgb: [7, 11, 22], hex: '#070B16', favicon: 'favicon-deep', name: 'deep' }, light: { rgb: [237, 241, 246], hex: '#EDF1F6', favicon: 'favicon-paper', name: 'paper' } };
const DEEP_RGB = 'rgb(0, 43, 102)';
const rgb = (a) => `rgb(${a.join(', ')})`;
// Surfaces painted with an image or gradient: the colour the contrast is measured against.
const DOCUMENTED = [['.hero', '#002B66']];
const NEW_JS = ['assets/boot.js', 'assets/motion.js', 'assets/theme.js'];   // rounds 3–4 JavaScript, budget 12 KB gz
const JS_BUDGET = 12 * 1024;
const LONG_TASK = 50;
const SCREENS = 7;
const CSP_SITE = "default-src 'self'; base-uri 'self'; connect-src 'self' https://plausible.io; font-src 'self' https://fonts.gstatic.com; form-action 'self'; frame-src 'none'; img-src 'self' data: https:; object-src 'none'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; upgrade-insecure-requests";
const CSP = CSP_SITE;
const CSP_BRANDBOOK = CSP_SITE.replace("font-src 'self'", "font-src 'self' data:");

// ============================================================ report
const SECTIONS = [
  [1, 'Console errors and broken resources (both expressions)'],
  [2, 'CSP violations (hardened CSP sent as a header), on load and during interactions'],
  [3, 'Requests to other domains'],
  [4, 'Overflow, one H1, heading order, one <main>, lang'],
  [5, 'Internal links and anchors; rel="noopener noreferrer" on every _blank'],
  [6, 'width and height on every <img>; mesh legend'],
  [7, 'Claims, phone numbers and forbidden phrases'],
  [8, 'No inline handlers or scripts, javascript: URLs, eval, HTML injection, third parties'],
  [9, 'Console injection shows as text'],
  [10, 'Reduced motion: final state, no animation frames'],
  [11, 'Motion budget: idle loop, long tasks, JavaScript weight (deep blue)'],
  [12, 'Secret scan, forbidden files, commits ahead of the remote'],
  [13, 'Exports in both expressions'],
  [14, 'Both expressions (A): each load in the expected expression; invariant elements stay deep blue'],
  [15, 'Contrast AA of every visible text pair, both expressions (B)'],
  [16, 'Non-text boundaries of controls, 3:1 (B; reported, fails for text fields)'],
  [17, 'No flash of the wrong expression before the first paint (C)'],
  [18, `The home fits in ${SCREENS} screens at 1440 × 900 (D)`],
  [19, 'Project counts and filters (E)'],
  [20, 'Cache busting: ?v=N on every assets/ link (F)'],
  [21, 'Motion rules, static: stylesheets and JavaScript (G)'],
  [22, 'Motion rules, runtime: document.getAnimations() on every page (G)'],
  [23, 'Expression switch: click, persistence, storage blocked (H)'],
];
const S = new Map(SECTIONS.map(([id, name]) => [id, { id, name, ok: true, skip: false, detail: [], info: [], warn: [], seen: new Set() }]));
const fail = (id, m) => { const s = S.get(id); if (s.seen.has(m)) return; s.seen.add(m); s.ok = false; s.detail.push(m); };
const info = (id, m) => S.get(id).info.push(m);
const warn = (id, m) => { const s = S.get(id); if (s.seen.has('w' + m)) return; s.seen.add('w' + m); s.warn.push(m); };
// Failures that repeat over widths, languages and expressions are grouped: one line per page and problem,
// followed by the loads where it happened.
const agg = new Map();
const failAgg = (id, msg, variant) => { if (!agg.has(id)) agg.set(id, new Map()); const m = agg.get(id); if (!m.has(msg)) m.set(msg, new Set()); m.get(msg).add(variant); };
const listOf = (set, n = 4) => { const a = [...set].filter(Boolean); return a.length > n ? `${a.slice(0, n).join(', ')} +${a.length - n}` : a.join(', '); };
const AGG_N = { 21: 10 };
function flushAgg() { for (const [id, m] of agg) for (const [msg, vs] of m) fail(id, listOf(vs, AGG_N[id]) ? `${msg} · ${listOf(vs, AGG_N[id])}` : msg); agg.clear(); }
const tidy = (m) => String(m).replace(/data:[^\s'")]{40,}/g, (d) => d.slice(0, 32) + '…');
const t0 = Date.now();
const phases = [];
let tp = Date.now();
const phase = (name) => { phases.push(`${name} ${((Date.now() - tp) / 1000).toFixed(0)} s`); tp = Date.now(); };

async function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_MODULE, 'playwright', '@playwright/test', '/opt/node-tools/node_modules/playwright/index.mjs'].filter(Boolean);
  for (const m of tries) {
    try { return await import(m.startsWith('/') ? pathToFileURL(m).href : m); } catch { /* next */ }
  }
  console.error('Playwright not found. Set PLAYWRIGHT_MODULE to its index.mjs.');
  process.exit(1);
}

function serve() {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.png': 'image/png',
    '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.ico': 'image/x-icon',
    '.json': 'application/json', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
  const srv = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, '');
    if (!p || p.endsWith('/')) p += 'index.html';
    const file = join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    try {
      if (!(await stat(file)).isFile()) throw new Error('not a file');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Content-Security-Policy': p.startsWith('brandbook/') ? CSP_BRANDBOOK : CSP,
        'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
      res.end(await readFile(file));
    } catch { res.writeHead(404); res.end('not found'); }
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r({ srv, base: `http://127.0.0.1:${srv.address().port}/` })));
}

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const exists = (f) => existsSync(join(ROOT, f));
async function walk(dir, re) {
  if (!exists(dir)) return [];
  const out = [];
  for (const e of await readdir(join(ROOT, dir), { withFileTypes: true })) {
    const f = posix.join(dir, e.name);
    if (e.isDirectory()) out.push(...await walk(f, re)); else if (re.test(e.name)) out.push(f);
  }
  return out.sort();
}

// ============================================================ static checks
const ASSET_JS = await walk('assets', /\.js$/);
const CSS_FILES = [...await walk('assets', /\.css$/), ...await walk('brandbook', /\.css$/)];
const BB_TEXT = (await walk('brandbook', /\.(css|js|md)$/));
const TEXT_FILES = [...PAGES.map((p) => p.file), 'README.md', 'brandbook-addendum.md', ...ASSET_JS, ...CSS_FILES, ...BB_TEXT, 'tools/stamp.mjs', 'tools/versions.json']
  .filter((f, i, a) => exists(f) && a.indexOf(f) === i);
const sources = {};
for (const f of TEXT_FILES) sources[f] = await readFile(join(ROOT, f), 'utf8');
globalThis.__sources = sources;

// ---------- 7. claims
let BLOCKED_CLAIMS = [];
try {
  const src = git('show', 'origin/main:scripts/check-claims.mjs');
  const tmp = join(tmpdir(), `naindev-check-claims-${process.pid}.mjs`);
  await writeFile(tmp, src);
  ({ BLOCKED_CLAIMS } = await import(pathToFileURL(tmp).href));
  await rm(tmp, { force: true });
  info(7, `${BLOCKED_CLAIMS.length} patterns from origin/main:scripts/check-claims.mjs over ${TEXT_FILES.filter((f) => /\.(html|js|mjs|json)$/.test(f)).length} files (pages, brandbook, assets/*.js, tools/stamp.mjs, tools/versions.json)`);
} catch (e) { fail(7, 'could not read BLOCKED_CLAIMS from origin/main (run `git fetch origin main`): ' + e.message.split('\n')[0]); }
// Split so this file does not contain the phrases it forbids.
const PHRASES = [new RegExp('auditor' + '[ií]a gratu' + 'ita', 'i'), new RegExp('free ' + 'aud' + 'it', 'i')];
const PHONES = [/(?:\+|\b00)\d{1,3}[\s.-]?\d{2,3}[\s.-]?\d{3}[\s.-]?\d{3}\b/, /\b[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/, /wa\.me\/\d/i, /\btel:/i, /api\.whatsapp\.com\/send\?phone/i];
for (const f of TEXT_FILES) {
  const s = sources[f];
  const visible = f.endsWith('.html') ? s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ') : f.endsWith('.json') ? s.replace(/"sha256":\s*"[0-9a-f]+"/g, '') : s;
  if (/\.(html|js|mjs|json)$/.test(f)) for (const re of BLOCKED_CLAIMS) if (re.test(s)) fail(7, `${f}: blocked claim ${re}`);
  for (const re of PHRASES) if (re.test(s)) fail(7, `${f}: forbidden phrase ${re}`);
  for (const re of PHONES) { const m = visible.match(re) || (f.endsWith('.html') && s.match(re)); if (m) fail(7, `${f}: phone-like text "${m[0]}"`); }
}

// ---------- 8. handlers, scripts, eval, third parties
for (const f of TEXT_FILES.filter((x) => /\.(html|js)$/.test(x))) {
  const s = sources[f];
  if (f.endsWith('.html')) {
    const on = s.replace(/<script[\s\S]*?<\/script>/g, '').match(/<[^>]+\son[a-z]+\s*=/gi);
    if (on) fail(8, `${f}: inline handler ${on[0].slice(0, 80)}`);
    for (const m of s.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc\s*=/.test(m[1])) { if (m[2].trim()) fail(8, `${f}: <script src> with inline content`); continue; }
      if (/type=["']?application\/ld\+json/i.test(m[1])) continue;
      fail(8, `${f}: inline <script> ${m[0].slice(0, 70).replace(/\s+/g, ' ')}`);
    }
  }
  if (/javascript:/i.test(s)) fail(8, `${f}: javascript: URL`);
  if (/\beval\s*\(|new\s+Function\s*\(|set(?:Timeout|Interval)\s*\(\s*['"`]/.test(s)) fail(8, `${f}: eval-like code`);
  if (/\.innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=|document\.write|createContextualFragment|DOMParser/.test(s)) fail(8, `${f}: HTML injection API`);
}
for (const p of PAGES) {
  const s = sources[p.file];
  if (/<iframe|<form\b|<object|<embed/i.test(s)) fail(8, `${p.file}: iframe, form, object or embed`);
  if (/<script[^>]+type=["']importmap/i.test(s)) fail(8, `${p.file}: import map`);
  for (const m of s.matchAll(/<script[^>]+src="(https?:)?\/\/[^"]+"/g)) fail(8, `${p.file}: third-party script ${m[0].slice(0, 90)}`);
  for (const m of s.matchAll(/<link[^>]+>/g)) {
    if (/rel="(?:stylesheet|preload|prefetch|modulepreload|icon|apple-touch-icon|manifest|preconnect|dns-prefetch)"/.test(m[0]) && /href="(https?:)?\/\//.test(m[0])) fail(8, `${p.file}: third-party resource ${m[0].slice(0, 90)}`);
  }
}
for (const f of CSS_FILES) {
  if (/url\(\s*["']?(https?:)?\/\//i.test(sources[f])) fail(8, `${f}: url() to another host`);
  if (/@import/i.test(sources[f])) fail(8, `${f}: @import`);
  for (const m of sources[f].matchAll(/@font-face\s*\{[^}]*\}/g)) if (!/url\(\s*["']?(?!https?:|\/\/)[^)]+\.woff2/.test(m[0])) fail(8, `${f}: @font-face that is not a self-hosted woff2`);
}

// ---------- 11. JavaScript weight and syntax
let gz = 0;
for (const f of NEW_JS) {
  if (!exists(f)) { fail(11, `${f} is missing`); continue; }
  const n = gzipSync(await readFile(join(ROOT, f)), { level: 9 }).length; gz += n; info(11, `${f} ${n} B gz`);
}
info(11, `JavaScript of rounds 3–4 (${NEW_JS.map((f) => f.split('/')[1]).join(' + ')}): ${(gz / 1024).toFixed(2)} KB gz (budget ${JS_BUDGET / 1024} KB)`);
if (gz > JS_BUDGET) fail(11, `new JavaScript ${gz} B gz is over ${JS_BUDGET} B`);
for (const f of ASSET_JS) {
  const m = sources[f].match(/\b(?:let|const)\s|=>|`|\basync\s|\bclass\s+\w+\s*\{/);
  if (m) fail(11, `${f} uses syntax newer than ES5: "${m[0]}"`);
  const api = sources[f].match(/\.(?:at|findLast|replaceAll)\(|structuredClone|Object\.hasOwn\b/);
  if (api) fail(11, `${f}: API not available in iOS 15: ${api[0]}`);
}
const css = sources['assets/nain.css'] || '';
const gridCols = [...css.matchAll(/grid-template-columns:\s*([^;}]+)/g)].map((m) => m[1]).filter((v) => /\d+fr/.test(v) && !/minmax\(0,\s*\d*\.?\d*fr\)/.test(v.replace(/repeat\(\d+,\s*/g, '')));
info(11, `fr tracks in the stylesheet without minmax(0,…) before overrides: ${gridCols.length} (the round 3 block overrides them; overflow is checked in the browser)`);

// ---------- 12. secrets, forbidden files, commits
const FORBIDDEN = [/(^|\/)CLAUDE\.md$/, /(^|\/)AGENTS\.md$/, /(^|\/)\.claude\//, /\.scratch\.md$/, /(^|\/)\.env/, /\.(pem|key|p12|pfx)$/, /(^|\/)id_(rsa|ed25519)/];
const files = git('ls-files', '--cached', '--others', '--exclude-standard', '--', '.').split('\n').filter(Boolean);
for (const f of files) for (const re of FORBIDDEN) if (re.test(f)) fail(12, `forbidden file in the upload set: ${f}`);
// Patterns are split so this file does not match itself.
const SECRET = new RegExp(['gh' + 'p_[A-Za-z0-9]{20,}', 'github' + '_pat_[A-Za-z0-9_]{20,}', 'gl' + 'pat-[A-Za-z0-9_-]{20}', '\\bs' + 'k-[A-Za-z0-9_-]{16,}', 'AK' + 'IA[0-9A-Z]{16}',
  '-----BEG' + 'IN [A-Z ]*PRIVATE', 'xo' + 'x[bp]-[A-Za-z0-9-]{10,}', 'tok' + 'en=[^&\\s"\']{8,}', 'pass' + 'word=[^&\\s"\']{4,}'].join('|'));
let scanned = 0;
for (const f of files) {
  if (/\.(png|jpe?g|woff2?|gif|webp|ico)$/i.test(f)) continue;
  const p = join(ROOT, f);
  if (!existsSync(p)) continue;
  const m = (await readFile(p, 'utf8')).match(SECRET);
  scanned++;
  if (m) fail(12, `${f}: secret-like string ${m[0].slice(0, 12)}…`);
}
info(12, `${files.length} files in the upload set, ${scanned} text files scanned by pattern`);
const gl = process.env.GITLEAKS || (spawnSync('sh', ['-c', 'command -v gitleaks'], { encoding: 'utf8' }).stdout.trim());
if (gl) {
  const r = spawnSync(gl, ['dir', ROOT, '--no-banner', '--redact', '--log-level', 'warn'], { encoding: 'utf8' });
  if (r.status === 0) info(12, 'gitleaks: no leaks found');
  else fail(12, 'gitleaks: ' + (r.stdout + r.stderr).trim().split('\n').slice(-3).join(' '));
} else info(12, 'gitleaks not on PATH (set GITLEAKS=/path/to/gitleaks); pattern scan only');
// Nothing outside the folder; every commit ahead of the remote by David, without trailers or a mention of AI.
const top = git('rev-parse', '--show-toplevel');
const prefix = relative(top, ROOT).replaceAll('\\', '/') + '/';
const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: top, encoding: 'utf8' }).split('\n').filter(Boolean).map((l) => l.slice(3));
for (const f of dirty) if (!f.startsWith(prefix)) fail(12, `change outside ${prefix}: ${f}`);
try {
  const raw = git('log', '@{u}..HEAD', '--format=%h%x1f%an <%ae>%x1f%B%x1e');
  const commits = raw.split('\x1e').map((c) => c.trim()).filter(Boolean).map((c) => { const [h, a, b] = c.split('\x1f'); return { h, a, b: (b || '').trim() }; });
  const AI = [/\b(AI|IA)\b/, /\b(claude|anthropic|chatgpt|openai|gpt-?\d|llm|copilot|gemini)\b/i, /generated (with|by)/i, /\u{1F916}/u];
  for (const c of commits) {
    if (c.a !== 'David Esteban <dsuarez@contrast3d.com>') fail(12, `commit ${c.h} not authored by David: ${c.a}`);
    const paras = c.b.split(/\n\s*\n/);
    const last = paras.length > 1 ? paras[paras.length - 1].split('\n') : [];
    if (/^(co-authored-by|signed-off-by|claude-session|[a-z-]+-by):/im.test(c.b) || (last.length && last.every((l) => /^[A-Za-z][\w-]*:\s+\S/.test(l)))) fail(12, `commit ${c.h} carries a trailer: ${c.b.split('\n').filter((l) => /^[A-Za-z][\w-]*:\s/.test(l)).slice(0, 2).join(' | ')}`);
    const ai = AI.map((re) => c.b.match(re)).find(Boolean);
    if (ai) fail(12, `commit ${c.h} message mentions AI ("${ai[0]}"): ${c.b.split('\n')[0].slice(0, 70)}`);
  }
  const touched = git('diff', '--name-only', '@{u}..HEAD');
  for (const f of touched.split('\n').filter(Boolean)) if (!f.startsWith(prefix)) fail(12, `commit touches a file outside ${prefix}: ${f}`);
  info(12, `commits ahead of the remote: ${commits.length}${commits.length ? ' (author, trailers and AI mentions checked)' : ''}`);
} catch { info(12, 'no upstream branch: commit checks skipped'); }

// ---------- 17 (structural). theme.js first in <head>, classic, before any stylesheet; no inline script
for (const p of PAGES) {
  const src = sources[p.file];
  const head = (src.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [null, ''])[1];
  const tags = [...head.matchAll(/<(script|link|style)\b([^>]*)>/gi)].map((m, i) => ({ i, tag: m[1].toLowerCase(), attrs: m[2] }));
  const scripts = tags.filter((t) => t.tag === 'script');
  const sheets = tags.filter((t) => t.tag === 'style' || (t.tag === 'link' && /\brel=["']?stylesheet/i.test(t.attrs)));
  const k = scripts.findIndex((t) => /\bsrc=["'][^"']*assets\/theme\.js(\?[^"']*)?["']/.test(t.attrs));
  if (k < 0) { fail(17, `${p.file}: assets/theme.js is not a <script> in <head>${/<script\b/i.test(src) ? '' : ' (the page has no script at all)'}`); continue; }
  const t = scripts[k];
  if (k !== 0) fail(17, `${p.file}: theme.js is script ${k + 1} in <head>; it must come before any other script`);
  if (/\b(async|defer)\b/i.test(t.attrs)) fail(17, `${p.file}: theme.js is async or defer; it must be a classic blocking script`);
  if (/\btype=["']?module/i.test(t.attrs)) fail(17, `${p.file}: theme.js is a module (modules are deferred)`);
  if (sheets.length && sheets[0].i < t.i) fail(17, `${p.file}: a stylesheet comes before theme.js`);
  if (/<script\b(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>/i.test(src)) fail(17, `${p.file}: inline <script>`);
}
info(17, `structure: ${PAGES.length} pages checked for theme.js as the first script in <head>, classic (no async, defer or module), before every stylesheet, and no inline script; ${S.get(17).detail.length ? `${S.get(17).detail.length} problem(s)` : 'all pass'}`);

// ---------- 20. cache busting
let manifest = {};
try { manifest = JSON.parse(await readFile(join(ROOT, 'tools/versions.json'), 'utf8')); } catch (e) { fail(20, 'tools/versions.json is missing or not JSON'); }
const hashes = {};
const sha = async (f) => (hashes[f] ??= createHash('sha256').update(await readFile(join(ROOT, f))).digest('hex'));
let linked = 0;
const linkedSet = new Set();
for (const p of PAGES) {
  for (const m of sources[p.file].matchAll(/<(link|script)\b[^>]*>/gi)) {
    const tag = m[0];
    if (/^<script/i.test(tag) ? !/\bsrc=/.test(tag) : !/\brel=["']?stylesheet/i.test(tag)) continue;
    const url = (tag.match(/\b(?:src|href)=["']([^"']+)["']/) || [])[1];
    if (!url || /^(https?:)?\/\//.test(url) || url.startsWith('data:')) continue;
    const path = posix.normalize(posix.join(posix.dirname(p.file), url.split('#')[0].split('?')[0]));
    if (!path.startsWith('assets/')) continue;
    linked++; linkedSet.add(path);
    const v = (url.match(/[?&]v=(\d+)(?:&|$)/) || [])[1];
    const entry = manifest[path];
    if (!v) { fail(20, `${p.file}: ${url} has no ?v=N`); continue; }
    if (!entry) { fail(20, `${p.file}: ${path} is not in tools/versions.json`); continue; }
    if (+v !== entry.v) fail(20, `${p.file}: ${url} carries v=${v}, tools/versions.json says v=${entry.v}`);
    if (!exists(path)) { fail(20, `${p.file}: ${path} does not exist`); continue; }
    if ((await sha(path)) !== entry.sha256) fail(20, `${path} changed since it was stamped (SHA-256 differs from tools/versions.json, still v=${entry.v})`);
  }
}
for (const k of Object.keys(manifest)) if (!linkedSet.has(k)) warn(20, `tools/versions.json lists ${k}, which no page links`);
info(20, `${linked} asset links in ${PAGES.length} pages, ${linkedSet.size} files, all compared with tools/versions.json (number and SHA-256)`);
if (!S.get(20).ok) info(20, '! fix: run `node tools/stamp.mjs` from design/home-redesign (it bumps N for changed files and rewrites the links in the root pages' + (HAS_BB ? '; brandbook/index.html links ../assets/ and needs the same ?v=N' : '') + ')');

// ---------- 21. motion rules, static
{
  const sheets = CSS_FILES.map((f) => ({ file: f, rules: parseCss(sources[f], f) }));
  for (const p of PAGES) {
    let n = 0;
    for (const m of sources[p.file].matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) sheets.push({ file: `${p.file} <style ${++n}>`, rules: parseCss(m[1]) });
    for (const m of sources[p.file].matchAll(/\sstyle="([^"]*\b(?:transition|animation)[^"]*)"/gi)) {
      const line = sources[p.file].slice(0, m.index).split('\n').length;
      sheets.push({ file: `${p.file}:${line} style=""`, rules: parseCss(`x{${m[1]}}`).map((r) => ({ ...r, selector: '[style]' })) });
    }
  }
  const { problems, facts } = checkMotionCss(sheets);
  // one line per file and problem, followed by the lines and selectors where it occurs
  const at = (pr) => { const m = pr.where.match(/^(.+?):(\d+) (.*)$/); return m ? [m[1], `${m[2]} ${m[3].slice(0, 44)}`] : [pr.where, '']; };
  for (const pr of problems) { const [file, loc] = at(pr); if (pr.soft) warn(21, `${pr.where}: ${pr.msg}`); else failAgg(21, `${file}: ${pr.msg}`, loc); }
  info(21, `${CSS_FILES.join(', ')}${sheets.length > CSS_FILES.length ? ` + ${sheets.length - CSS_FILES.length} inline style blocks/attributes` : ''}: ${facts.transitions} transition shorthands, ${facts.animations} animation shorthands, ${facts.keyframes} @keyframes; agenda (.agd) keyframes: ${[...facts.agdNames].join(', ') || 'none'}, cycle ${facts.agdCycle ?? '?'} ms`);
  info(21, `allowed: transform, opacity, clip-path, mask; ${MIN_MS}–${MAX_MS} ms (the .agd cycle ${CYCLE_MS} ms, made of ${MIN_MS}–${MAX_MS} ms movements); var(--ease-out) / var(--ease-std)`);
  const jsFiles = Object.fromEntries(ASSET_JS.concat(BB_TEXT.filter((f) => f.endsWith('.js'))).map((f) => [f, sources[f]]));
  const js = checkMotionJs(jsFiles);
  for (const pr of js.problems) (pr.soft ? (m) => warn(21, m) : (m) => fail(21, m))(`${pr.where}: ${pr.msg}`);
  flushAgg();
  info(21, `JavaScript: ${Object.keys(jsFiles).length} files; requestAnimationFrame in the hero field file: ${js.info.length} call sites`);
  for (const f of [...CSS_FILES, ...Object.keys(jsFiles)]) if (/steps\s*\(/.test(sources[f]) && !S.get(21).detail.some((d) => d.includes('steps'))) fail(21, `${f}: steps()`);
}
phase('static');

// ============================================================ browser checks
const { chromium } = await loadPlaywright();
const { srv, base } = await serve();
const ORIGIN = base.replace(/\/$/, '');
const browser = await chromium.launch({ headless: true });
const ids = new Map();
const idsOf = async (f) => { if (!ids.has(f)) ids.set(f, new Set([...(await readFile(join(ROOT, f), 'utf8')).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))); return ids.get(f); };
const ALLOWED_FRAGMENTS = new Set(['whatsapp']);   // B-014: Aitor sets the WhatsApp link at build time
const PRIVACY_CLOSED = () => { try { localStorage.setItem('naindev-privacy-closed', '1'); } catch (e) { /* none */ } };

function ctxOptions({ width = 1440, height = 900, theme = 'deep', reduced = false, extra = {} } = {}) {
  const t = THEMES[theme];
  const o = { viewport: { width, height }, colorScheme: t.scheme, reducedMotion: reduced ? 'reduce' : 'no-preference', ...extra };
  if (t.stored) o.storageState = { cookies: [], origins: [{ origin: ORIGIN, localStorage: [{ name: 'theme', value: t.stored }] }] };
  return o;
}
const urlOf = (p) => (typeof p === 'string' ? (byFile(p) || { url: p }).url : p.url);

async function open(ctxOpts, p, query = '', { gate = true, init = [] } = {}) {
  const ctx = await browser.newContext(ctxOpts);
  ctx.setDefaultTimeout(15000);
  const page = await ctx.newPage();
  const log = { errors: [], broken: [], external: [] };
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
    window.__raf = 0;
    const o = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (f) => { window.__raf++; return o(f); };
  });
  for (const f of init) await page.addInitScript(f);
  page.on('console', (m) => { if (m.type() === 'error') log.errors.push(m.text()); });
  page.on('pageerror', (e) => log.errors.push('pageerror ' + e.message));
  page.on('dialog', (d) => { log.errors.push('dialog ' + d.message()); d.dismiss(); });
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(base) && !u.startsWith('data:') && !u.startsWith('blob:')) log.external.push(u); });
  page.on('response', (r) => { if (r.status() >= 400) log.broken.push(`${r.status()} ${r.url().replace(base, '')}`); });
  page.on('requestfailed', (r) => { if (r.url().startsWith(base)) log.broken.push(`failed ${r.url().replace(base, '')}`); });
  if (gate) await page.route('**/*', (route) => (route.request().url().startsWith(base) ? route.continue() : route.abort()));
  await page.goto(`${base}${urlOf(p)}${query}`, { waitUntil: 'networkidle' });
  return { ctx, page, log };
}
async function drain(page, log, where) {
  const csp = await page.evaluate(() => (window.__csp || []).splice(0)).catch(() => []);
  const sp = where.match(/^(\S+\.html|brandbook)\s+(.*)$/);
  const [key, variant] = sp ? [sp[1], sp[2]] : [where, ''];
  const uniq = (a) => { const c = new Map(); for (const x of a) c.set(tidy(x), (c.get(tidy(x)) || 0) + 1); return [...c].map(([x, n]) => (n > 1 ? `${n}× ${x}` : x)).join(' | '); };
  if (log.errors.length) failAgg(1, `${key}: ${uniq(log.errors).slice(0, 260)}`, variant);
  if (log.broken.length) failAgg(1, `${key}: broken ${uniq(log.broken).slice(0, 260)}`, variant);
  if (csp.length) failAgg(2, `${key}: ${uniq(csp).slice(0, 260)}`, variant);
  if (log.external.length) failAgg(3, `${key}: ${uniq(log.external).slice(0, 260)}`, variant);
  const n = log.errors.length;
  log.errors.length = 0; log.broken.length = 0; log.external.length = 0;
  return n;
}
// A block that crashes (a page changed under the check) fails its section instead of stopping the run.
async function guard(id, label, fn) { try { await fn(); } catch (e) { fail(id, `${label}: the check crashed: ${String(e.message || e).split('\n')[0]}`); } }
async function pool(items, fn, n = JOBS) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) {
      const k = i++;
      try { out[k] = await fn(items[k], k); } catch (e) { fail(1, `${items[k].where || JSON.stringify(items[k]).slice(0, 80)}: the check crashed: ${String(e.message || e).split('\n')[0]}`); }
    }
  }));
  return out;
}
const scrollThrough = (page, step = 0.8, pause = 60) => page.evaluate(async ([step, pause]) => {
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * step) { scrollTo(0, y); await new Promise((r) => setTimeout(r, pause)); }
  scrollTo(0, 0);
}, [step, pause]);

// ---------- 11. long tasks at 390 px with 4× CPU (deep blue), first so nothing else runs alongside
async function budget(p) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, colorScheme: 'dark' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.__lt = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([e.startTime, e.duration]))).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(base + urlOf(p), { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const load = await page.evaluate(() => {
    const fcp = (performance.getEntriesByName('first-contentful-paint')[0] || { startTime: 0 }).startTime;
    const lt = window.__lt.splice(0);
    return { fcp, before: lt.filter(([s]) => s < fcp).map(([, d]) => d), after: lt.filter(([s]) => s >= fcp).map(([, d]) => d) };
  });
  // A fast fling: Chrome's own scroll gesture moves the page frame by frame at 3000 px/s, top to bottom.
  for (let k = 0; k < 80; k++) {
    await cdp.send('Input.synthesizeScrollGesture', { x: 195, y: 600, yDistance: -500, speed: 3000, gestureSourceType: 'mouse' });
    if (await page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight - 2)) break;
  }
  await page.waitForTimeout(1200);
  const scroll = await page.evaluate(() => window.__lt.splice(0).map(([, d]) => d));
  await ctx.close();
  const max = (a) => Math.round(a.length ? Math.max(...a) : 0);
  return { firstRender: max(load.before), load: max(load.after), scroll: max(scroll) };
}
{
  const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  const perf = {};
  for (const p of QUICK ? [HOME] : PAGES.filter((x) => !STANDALONE(x))) {
    const runs = [await budget(p)];
    // Throttled timings are noisy: when a run is over budget, take the median of five.
    if (runs[0].load > LONG_TASK || runs[0].scroll > LONG_TASK) runs.push(await budget(p), await budget(p), await budget(p), await budget(p));
    perf[p.file] = { firstRender: median(runs.map((r) => r.firstRender)), load: median(runs.map((r) => r.load)), scroll: median(runs.map((r) => r.scroll)), runs: runs.length };
    const r = perf[p.file];
    if (r.load > LONG_TASK) fail(11, `${p.file}: long task of ${r.load} ms after first paint (390 px, 4× CPU, median of ${r.runs})`);
    if (r.scroll > LONG_TASK) fail(11, `${p.file}: long task of ${r.scroll} ms while scrolling (390 px, 4× CPU, median of ${r.runs})`);
  }
  info(11, '390 px, DPR 2, 4× CPU via CDP, deep blue, scroll at 3000 px/s. Longest task in ms — first render (before first paint) / after first paint / scrolling:');
  for (const [f, r] of Object.entries(perf)) info(11, `  ${f.padEnd(29)} ${String(r.firstRender).padStart(4)} / ${String(r.load).padStart(3)} / ${String(r.scroll).padStart(3)}${r.runs > 1 ? `  (median of ${r.runs})` : ''}`);
}
phase('long tasks');

// ---------- 1–6 and 14 (A). page loads in both expressions
{
  const jobs = [];
  for (const theme of ['deep', 'paper']) for (const width of WIDTHS) for (const lang of LANGS) for (const p of PAGES) if (!STANDALONE(p) || lang === 'es') jobs.push({ theme, width, lang, p });
  for (const theme of ['chose-paper', 'chose-deep']) for (const width of QUICK ? [1440] : [390, 1440]) for (const lang of LANGS) jobs.push({ theme, width, lang, p: HOME });
  for (const j of jobs) j.where = `${j.p.file} ${j.width} ${j.lang} ${j.theme}`;
  const counts = {};
  await pool(jobs, async ({ theme, width, lang, p, where }) => {
    const { ctx, page, log } = await open(ctxOptions({ width, theme }), p, `?lang=${lang}`);
    // Walk the page so lazy pieces (pattern blocks, console, filters) build under the CSP.
    await scrollThrough(page);
    await page.waitForTimeout(250);
    const r = await page.evaluate(pageFacts);
    await drain(page, log, where);
    await ctx.close();
    counts[theme] = (counts[theme] || 0) + 1;
    const v = `${width} ${lang} ${theme}`;
    if (r.overflow > 0) failAgg(4, `${p.file}: horizontal overflow ${r.overflow}px`, v);
    if (r.h1 !== 1) failAgg(4, `${p.file}: ${r.h1} h1`, v);
    if (r.main !== 1) failAgg(4, `${p.file}: ${r.main} <main>`, v);
    if (r.first !== 1) failAgg(4, `${p.file}: first heading is h${r.first}`, v);
    if (r.skips) failAgg(4, `${p.file}: ${r.skips} skipped heading levels`, v);
    if (r.lang !== lang) failAgg(4, `${p.file}: lang="${r.lang}" with ?lang=${lang}`, v);
    for (const src of r.imgs) fail(6, `${p.file}: <img src="${src}"> without width or height`);
    for (const l of r.links) if (l.target === '_blank' && (!/\bnoopener\b/.test(l.rel) || !/\bnoreferrer\b/.test(l.rel))) fail(5, `${p.file}: _blank without noopener noreferrer: ${l.href}`);
    if (width === 1440 && lang === 'es' && theme === 'deep') {
      for (const l of r.links) {
        if (/^(https?:|mailto:)/.test(l.href) && !l.abs.startsWith(base)) continue;
        const u = new URL(l.abs);
        let target = decodeURIComponent(u.pathname).replace(/^\/+/, '');
        if (!target || target.endsWith('/')) target += 'index.html';
        try { await access(join(ROOT, target)); } catch { fail(5, `${p.file}: broken link ${l.href}`); continue; }
        const frag = decodeURIComponent(u.hash.slice(1));
        if (frag && !ALLOWED_FRAGMENTS.has(frag) && !(await idsOf(target)).has(frag)) fail(5, `${p.file}: missing anchor ${l.href}`);
      }
    }
    // 14: the expected expression
    const t = THEMES[theme], e = EXPECT[t.expect], th = r.theme;
    const f14 = (m) => failAgg(14, `${p.file}: ${m}`, v);
    if (th.body !== rgb(e.rgb)) f14(`${theme}: body background ${th.body}, expected ${e.hex}`);
    if (STANDALONE(p)) { /* follows prefers-color-scheme with CSS only */ } else if (!HAS_THEME_JS(p)) f14('does not load assets/theme.js: no stored choice, no switch, no favicon or theme-color swap (see 17)');
    else {
      if (th.dataTheme !== t.stored) f14(`${theme}: data-theme="${th.dataTheme}", expected ${t.stored ? `"${t.stored}"` : 'none'}`);
      if (th.get !== t.expect) f14(`${theme}: naindevTheme.get() is ${th.get}, expected ${t.expect}`);
      if (!th.jsTheme) f14('theme.js did not run (no js-theme class)');
      if (th.header && th.header !== rgb(e.rgb)) f14(`${theme}: header background ${th.header}, expected ${e.hex}`);
      if (!th.favicon || !th.favicon.includes(e.favicon)) f14(`${theme}: favicon ${th.favicon}, expected ${e.favicon}.svg`);
      if (!th.themeColor || th.themeColor.toUpperCase() !== e.hex) f14(`${theme}: theme-color ${th.themeColor}, expected ${e.hex}`);
      if (!th.pressed.length) f14('no [data-theme-toggle] switch');
      else if (th.pressed.some((x) => x !== (t.expect === 'light' ? 'true' : 'false'))) f14(`${theme}: switch aria-pressed ${th.pressed.join('/')}, expected ${t.expect === 'light'}`);
    }
    if (USES_NAIN(p)) for (const [sel, bgc] of th.invariants) if (bgc !== DEEP_RGB) f14(`${theme}: ${sel} background ${bgc}; it is deep blue (#002B66) in both expressions`);
  });
  info(4, `${jobs.length} page loads: ${PAGES.length} pages × ${WIDTHS.join('/')} px × ${LANGS.join('/').toUpperCase()} × deep/paper, plus the home with a stored choice`);
  if (!HAS_BB) fail(14, `${BRANDBOOK} not found: the brandbook page is expected in round 4`);
  info(14, `loads per expression: ${Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ')}`);
  for (const [k, t] of Object.entries(THEMES)) info(14, `  ${k.padEnd(12)} ${t.label} → expects ${EXPECT[t.expect].hex}, favicon ${EXPECT[t.expect].favicon}, switch pressed ${t.expect === 'light'}`);
  info(14, `invariant elements checked for #002B66 in every load of a page that uses nain.css: footer, .hero, .on-deep, .term, pre.panel, .diagram, .mesh-box, .fic`);
}
phase('page loads (A)');

// ---------- 15–16 (B). contrast of every text pair, both expressions
{
  const variants = QUICK ? [[1440, 'es']] : [[1440, 'es'], [1440, 'en'], [390, 'es']];
  const jobs = [];
  for (const theme of ['deep', 'paper']) for (const p of PAGES) for (const [width, lang] of variants) if (!STANDALONE(p) || lang === 'es') jobs.push({ theme, p, width, lang, where: `${p.name} ${width} ${lang}` });
  const C = Object.fromEntries(['deep', 'paper'].map((t) => [t, { pairs: new Map(), fails: new Map(), unm: new Map(), doc: new Map(), bnd: new Map(), measured: 0, loads: 0 }]));
  const merge = (c, r, where) => {
    c.measured += r.measured; c.loads++;
    for (const x of r.pairs) {
      const k = `${x.fg}|${x.bg}|${x.large}`;
      const e = c.pairs.get(k);
      if (!e) c.pairs.set(k, { ...x, ex: `${where} ${x.sel}` });
      else { e.count += x.count; if (x.ratio < e.ratio) { e.ratio = x.ratio; e.ex = `${where} ${x.sel}`; e.text = x.text; } }
    }
    for (const f of r.fails) { const k = `${f.fg}|${f.bg}|${f.sel}`; if (!c.fails.has(k)) c.fails.set(k, { ...f, where: new Set() }); c.fails.get(k).where.add(where); }
    for (const u of r.unmeasurable) { const k = `${u.sel}|${u.why}`; if (!c.unm.has(k)) c.unm.set(k, { ...u, where: new Set() }); c.unm.get(k).where.add(where); }
    for (const [sel, via] of r.documented) c.doc.set(sel, via);
    for (const b of r.boundaries) { const k = `${b.sel}|${b.kind}|${b.border || ''}|${b.bg || ''}`; if (!c.bnd.has(k)) c.bnd.set(k, { ...b, where: new Set() }); c.bnd.get(k).where.add(where); }
  };
  await pool(jobs, async ({ theme, p, width, lang, where }) => {
    const { ctx, page, log } = await open(ctxOptions({ width, theme, reduced: true }), p, `?lang=${lang}`);
    await page.addStyleTag({ content: '*{content-visibility:visible!important}' });
    await page.evaluate(() => document.fonts.ready);
    await scrollThrough(page, 0.8, 40);
    await page.waitForTimeout(200);
    merge(C[theme], await page.evaluate(contrastProbe, { documented: DOCUMENTED, maxFails: 80 }), where);
    if (width === 390 && (await page.locator('#menuOpen').count())) {
      await page.click('#menuOpen');
      await page.waitForTimeout(100);
      merge(C[theme], await page.evaluate(contrastProbe, { documented: DOCUMENTED, maxFails: 80 }), `${where} menu open`);
    }
    await drain(page, log, `${p.file} ${width} ${lang} ${theme} contrast`);
    await ctx.close();
  });
  const pageList = (set) => { const a = [...set]; return a.slice(0, 3).join(', ') + (a.length > 3 ? ` +${a.length - 3}` : ''); };
  for (const theme of ['deep', 'paper']) {
    const c = C[theme];
    const rows = [...c.pairs.values()].sort((a, b) => a.ratio / a.min - b.ratio / b.min);
    const bad = rows.filter((x) => x.ratio < x.min - 0.005).length;
    info(15, `${theme === 'deep' ? 'DEEP BLUE' : 'PAPER'}: ${c.measured} text runs measured in ${c.loads} renders (${variants.map((v) => v.join(' ')).join(', ')}; reduced motion, content-visibility forced); ${rows.length} distinct pairs, ${bad} under the threshold`);
    info(15, `    ratio   need  text     on        count  lowest at`);
    for (const x of rows) info(15, `  ${x.ratio < x.min - 0.005 ? '✗' : ' '} ${x.ratio.toFixed(2).padStart(5)}  ${x.min.toFixed(1).padStart(3)}${x.large ? 'L' : ' '}  ${x.fg}  ${x.bg}  ${String(x.count).padStart(5)}  ${x.ex.slice(0, 90)}${x.text ? ` "${x.text.slice(0, 24)}"` : ''}`);
    for (const f of c.fails.values()) fail(15, `${theme}: ${f.fg} on ${f.bg} = ${f.ratio.toFixed(2)}:1 < ${f.min}:1 · ${f.sel} "${f.text.slice(0, 40)}" (${f.size}px/${f.weight}) · ${pageList(f.where)}`);
    for (const u of c.unm.values()) warn(15, `${theme}: unmeasurable ${u.sel} "${(u.text || '').slice(0, 30)}": ${u.why} · ${pageList(u.where)}`);
    for (const [sel, via] of c.doc) info(15, `  ${theme}: measured against a documented surface: ${sel} (${via})`);
    // 16
    const bnd = [...c.bnd.values()];
    const fields = bnd.filter((b) => b.field && b.kind === 'border');
    for (const b of fields) fail(16, `${theme}: text field ${b.sel}: border ${b.border} on ${b.bg} = ${b.ratio.toFixed(2)}:1 < 3:1 · ${pageList(b.where)}`);
    const borders = bnd.filter((b) => !b.field && b.kind === 'border').sort((a, b) => a.ratio - b.ratio);
    const none = bnd.filter((b) => b.kind === 'none');
    const fills = bnd.filter((b) => b.kind === 'fill').sort((a, b) => a.ratio - b.ratio);
    info(16, `${theme === 'deep' ? 'DEEP BLUE' : 'PAPER'}: ${borders.length} controls whose border is the only boundary and is under 3:1 (report), ${fills.length} whose fill is the only boundary and is under 3:1 (report), ${none.length} with no boundary of their own (text or icon only)`);
    for (const b of borders) info(16, `  ! border ${b.ratio.toFixed(2)}:1  ${b.border} on ${b.bg}  ${b.sel} · ${pageList(b.where)}`);
    for (const b of fills) info(16, `  ! fill   ${b.ratio.toFixed(2)}:1  ${b.fill} on ${b.bg}  ${b.sel} · ${pageList(b.where)}`);
    for (const b of none.slice(0, 12)) info(16, `    no boundary: ${b.sel} (fill ${b.fill} on ${b.bg}) · ${pageList(b.where)}`);
    for (const b of bnd.filter((x) => x.kind === 'unmeasurable')) warn(16, `${theme}: unmeasurable ${b.sel}: ${b.why}`);
  }
  info(15, 'thresholds: 4.5:1; 3:1 for text ≥ 24 px or ≥ 18.66 px at weight ≥ 600 (L). Hidden text (.sr, [hidden], display:none, visibility:hidden, opacity 0, [data-demo="no"]) is skipped; SVG text, placeholders and ::before/::after text are included');
}
phase('contrast (B)');

// ---------- 17 (C). the first painted frame
{
  const COMBOS = [['system-dark', 'deep'], ['system-light', 'paper'], ['chose-light-on-dark', 'chose-paper'], ['chose-dark-on-light', 'chose-deep']];
  const FF_DIR = join(tmpdir(), `naindev-first-frame-${process.pid}`);
  await mkdir(FF_DIR, { recursive: true });
  const decoder = await browser.newPage();
  const decode = (data, pts = [[4, 4], [1435, 4]]) => decoder.evaluate(async ([d, pts]) => {
    const i = new Image(); i.src = 'data:image/png;base64,' + d; await i.decode();
    const c = document.createElement('canvas'); c.width = i.width; c.height = i.height;
    const x = c.getContext('2d'); x.drawImage(i, 0, 0);
    const at = (px, py) => [...x.getImageData(Math.min(px, i.width - 1), Math.min(py, i.height - 1), 1, 1).data].slice(0, 3);
    return { w: i.width, h: i.height, header: at(pts[0][0], pts[0][1]), right: at(pts[1][0], pts[1][1]) };
  }, [data, pts]);
  const near = (a, b, tol = 3) => a.every((v, i) => Math.abs(v - b[i]) <= tol);
  const hexOf = (a) => '#' + a.map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  const pages = QUICK ? [HOME] : PAGES.filter((p) => !STANDALONE(p));
  const rows = [];
  for (const p of pages) for (const [combo, theme] of COMBOS) try {
    const t = THEMES[theme], e = EXPECT[t.expect];
    const ctx = await browser.newContext(ctxOptions({ width: 1440, height: 900, theme }));
    await ctx.addInitScript(firstPaintInit);
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    const frames = [];
    cdp.on('Page.screencastFrame', (f) => { frames.push({ ts: f.metadata.timestamp * 1000, data: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
    await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1, maxWidth: 1440, maxHeight: 900 });
    await page.goto(`${base}${p.url}?lang=es`, { waitUntil: 'load' });
    await page.waitForTimeout(700);
    await cdp.send('Page.stopScreencast').catch(() => {});
    // sample the page background where the header bar is (it uses --color-bg), at its two ends
    const tm = await page.evaluate(() => {
      const h = document.querySelector('header.top');
      const r = h ? h.getBoundingClientRect() : { left: 0, top: 0, right: innerWidth };
      return { origin: performance.timeOrigin, fp: window.__fp, pts: [[Math.round(r.left + 4), Math.round(r.top + 4)], [Math.round(r.right - 5), Math.round(r.top + 4)]] };
    });
    await ctx.close();
    const where = `${p.file} ${combo}`;
    const fp = (tm.fp.paints || []).find((x) => x.name === 'first-paint') || (tm.fp.paints || [])[0];
    if (!fp) { fail(17, `${where}: no first-paint entry`); continue; }
    // The frame that shows the first paint: the first one swapped at or after first-paint (paint timing is
    // reported a few ms after the swap, hence the 15 ms window). Earlier frames are the browser's blank canvas.
    const rel = frames.map((f) => ({ ...f, rel: f.ts - tm.origin }));
    const k = rel.findIndex((f) => f.rel >= fp.t - 15);
    if (k < 0) { fail(17, `${where}: no screencast frame at the first paint (${frames.length} frames)`); continue; }
    const px = await decode(rel[k].data, tm.pts);
    const pre = [];
    for (const f of rel.slice(0, k).filter((x) => x.rel >= 0)) pre.push(hexOf((await decode(f.data)).header));
    const ok = near(px.header, e.rgb) && near(px.right, e.rgb);
    const theMark = (tm.fp.marks || []).find((m) => m.attr === 'class' && /\bjs-theme\b/.test(m.value || ''));
    const file = p === HOME ? `${combo}.png` : `${combo}-${p.name}.png`;
    if (p === HOME || !ok) await writeFile(join(FF_DIR, file), Buffer.from(rel[k].data, 'base64'));
    rows.push(`  ${p.file.padEnd(28)} ${combo.padEnd(20)} first paint ${fp.t.toFixed(0).padStart(4)} ms · frame at ${rel[k].rel.toFixed(0).padStart(4)} ms ${hexOf(px.header)} (expected ${e.hex}) · theme.js ran at ${theMark ? theMark.t.toFixed(0) : '?'} ms · data-theme ${fp.dataTheme ?? 'none'}${pre.length ? ` · ${pre.length} blank canvas frame(s) before: ${[...new Set(pre)].join(' ')}` : ''}`);
    if (!ok) fail(17, `${where}: the first painted frame shows ${hexOf(px.header)} / ${hexOf(px.right)} in the header bar, expected ${e.hex} (${t.label}); saved ${file}`);
    const atFp = [];
    if (fp.dataTheme !== t.stored) atFp.push(`data-theme ${fp.dataTheme ?? 'none'} (expected ${t.stored ?? 'none'})`);
    for (const k2 of ['html', 'body', 'header']) if (fp[k2] && fp[k2] !== rgb(e.rgb)) atFp.push(`${k2} ${fp[k2]}`);
    if (atFp.length) fail(17, `${where}: recorded at first paint (PerformanceObserver 'paint'): ${atFp.join(', ')}; expected ${e.hex}`);
    if (HAS_THEME_JS(p) && (!theMark || theMark.t > fp.t)) fail(17, `${where}: theme.js ran ${theMark ? `at ${theMark.t.toFixed(0)} ms, after` : 'not before'} the first paint (${fp.t.toFixed(0)} ms)`);
  } catch (err) { fail(17, `${p.file} ${combo}: the capture crashed: ${String(err.message || err).split('\n')[0]}`); }
  await decoder.close();
  info(17, `runtime: ${pages.length} page(s) × 4 combinations at 1440, first painted frame from CDP Page.startScreencast (every frame), decoded in a canvas and sampled in the header bar (4 px in from its left and right ends):`);
  for (const r of rows) info(17, r);
  info(17, `first frames of the home: ${EXPORTS ? 'exports/first-frame/' : FF_DIR + '/'} (system-dark, system-light, chose-light-on-dark, chose-dark-on-light)`);
  globalThis.FF_DIR = FF_DIR;
}
phase('first frame (C)');

// ---------- 18 (D). the home in 7 screens
await guard(18, 'seven screens', async () => {
  const limit = SCREENS * 900;
  for (const theme of ['deep', 'paper']) for (const lang of QUICK ? ['es'] : ['es', 'en']) {
    const where = `index.html 1440 ${lang} ${theme}`;
    const { ctx, page, log } = await open(ctxOptions({ width: 1440, height: 900, theme, reduced: true }), HOME, `?lang=${lang}`);
    await page.addStyleTag({ content: '*{content-visibility:visible!important}' });
    await page.evaluate(() => document.fonts.ready);
    await scrollThrough(page, 0.8, 40);
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => ({
      h: document.documentElement.scrollHeight,
      banner: (() => { const b = document.getElementById('pbanner'); return !!b && !b.hidden && b.getBoundingClientRect().height > 0; })(),
      parts: [...document.querySelectorAll('body > header, body > aside, main > section, main > article, body > footer')].map((e) => ({
        id: e.tagName === 'HEADER' || e.tagName === 'FOOTER' ? e.tagName.toLowerCase() : (e.id || (e.getAttribute('aria-labelledby') || '').replace(/Title$/, '') || e.className.split(' ')[0] || e.tagName.toLowerCase()),
        h: Math.round(e.getBoundingClientRect().height), pos: getComputedStyle(e).position })),
    }));
    await drain(page, log, where);
    await ctx.close();
    if (!r.banner) fail(18, `${where}: the privacy notice is not visible for a fresh visitor`);
    if (r.h > limit) fail(18, `${where}: scrollHeight ${r.h} px = ${(r.h / 900).toFixed(2)} screens > ${SCREENS} (${limit} px), ${r.h - limit} px over`);
    info(18, `${where}: ${r.h} px = ${(r.h / 900).toFixed(2)} screens (limit ${limit})${r.banner ? ', privacy notice visible' : ''}`);
    info(18, `    ${r.parts.filter((x) => x.h > 0 && x.pos !== 'fixed').map((x) => `${x.id} ${x.h}`).join(' · ')}`);
  }
});
phase('seven screens (D)');

// ---------- 19 (E). counts and filters
await guard(19, 'counts and filters', async () => {
  let json = null;
  try { json = JSON.parse(git('show', 'origin/main:public/assets/data/projects.json')); } catch (e) { fail(19, 'could not read origin/main:public/assets/data/projects.json (run `git fetch origin main`)'); }
  const mainIds = json ? json.map((x) => x.id) : [];
  const P = byFile('proyectos.html');
  if (!P) fail(19, 'proyectos.html not found');
  else {
    const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), P, '?lang=es');
    await page.evaluate(() => { const l = document.getElementById('projList') || document.querySelector('[data-project]'); if (l) l.scrollIntoView(); });
    await page.waitForTimeout(400);
    const cards = await page.evaluate(() => [...document.querySelectorAll('[data-project]')].map((c) => ({ id: c.getAttribute('data-project'), cats: (c.getAttribute('data-cats') || '').split(/\s+/).filter(Boolean) })));
    const idsP = cards.map((c) => c.id);
    if (cards.length !== 22) fail(19, `proyectos.html lists ${cards.length} [data-project] elements, expected 22`);
    const dup = idsP.filter((x, i) => idsP.indexOf(x) !== i);
    if (dup.length) fail(19, `proyectos.html: repeated ids ${[...new Set(dup)].join(', ')}`);
    if (json) {
      const miss = mainIds.filter((x) => !idsP.includes(x)), extra = idsP.filter((x) => !mainIds.includes(x));
      if (miss.length) fail(19, `proyectos.html misses projects.json ids: ${miss.join(', ')}`);
      if (extra.length) fail(19, `proyectos.html has ids not in projects.json: ${extra.join(', ')}`);
      if (!miss.length && !extra.length && idsP.join() !== mainIds.join()) warn(19, 'proyectos.html lists the 22 ids in a different order than projects.json');
      const diff = cards.map((c) => { const m = json.find((x) => x.id === c.id); if (!m) return null; const a = [...c.cats].sort().join(' '), b = [...m.categories].sort().join(' '); return a === b ? null : `${c.id} (${a} | main: ${b})`; }).filter(Boolean);
      if (diff.length) warn(19, `data-cats differ from projects.json categories on ${diff.length} cards: ${diff.slice(0, 4).join('; ')}${diff.length > 4 ? ' …' : ''}`);
    }
    // the filter chips
    const bar = await page.evaluate(() => { const b = document.querySelector('.pfilters'); return b ? { hidden: b.hidden, filters: [...b.querySelectorAll('[data-filter]')].map((x) => ({ f: x.getAttribute('data-filter'), cnt: (x.querySelector('.cnt') || {}).textContent || null })) } : null; });
    if (!bar) fail(19, 'proyectos.html: no .pfilters bar');
    else {
      if (bar.hidden) fail(19, 'proyectos.html: the filter bar is still hidden after scrolling to the list');
      const res = [];
      for (const { f, cnt } of bar.filters) {
        await page.click(`.pfilters [data-filter="${f}"]`);
        await page.waitForTimeout(60);
        const st = await page.evaluate((f) => ({
          visible: [...document.querySelectorAll('[data-project]')].filter((c) => !c.hidden && c.getClientRects().length).map((c) => c.getAttribute('data-project')),
          pressed: [...document.querySelectorAll('.pfilters [data-filter]')].filter((x) => x.getAttribute('aria-pressed') === 'true').map((x) => x.getAttribute('data-filter')),
          count: (document.getElementById('projCount') || {}).textContent || null,
        }), f);
        const expected = cards.filter((c) => f === 'all' || c.cats.includes(f)).map((c) => c.id);
        res.push(`${f} ${st.visible.length}/${expected.length}`);
        if (st.visible.length !== expected.length || expected.some((x) => !st.visible.includes(x))) fail(19, `filter "${f}": ${st.visible.length} cards visible, expected ${expected.length} from data-cats`);
        if (cnt != null && +cnt !== expected.length) fail(19, `filter "${f}": the chip says ${cnt}, data-cats give ${expected.length}`);
        if (st.pressed.join() !== f) fail(19, `filter "${f}": aria-pressed on ${st.pressed.join(', ') || 'nothing'}`);
        if (st.count && !st.count.includes(String(expected.length))) fail(19, `filter "${f}": counter says "${st.count}"`);
      }
      await page.click('.pfilters [data-filter="all"]').catch(() => {});
      info(19, `proyectos.html: ${cards.length} projects, ids ${json && !S.get(19).detail.some((d) => d.includes('ids')) ? 'match' : 'checked against'} origin/main projects.json; filters (visible/expected): ${res.join(' · ')}`);
    }
    await drain(page, log, 'proyectos.html filters');
    await ctx.close();
  }
  {
    const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), HOME, '?lang=es');
    const home = await page.evaluate(() => [...document.querySelectorAll('[data-project]')].map((c) => ({ id: c.getAttribute('data-project'),
      demos: [...c.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => { try { const u = new URL(h); return u.protocol === 'https:' && /\.naindev\.com$/.test(u.hostname) && u.hostname !== 'www.naindev.com'; } catch (e) { return false; } }) })));
    await drain(page, log, 'index.html projects');
    await ctx.close();
    if (home.length !== 6) fail(19, `index.html lists ${home.length} [data-project] elements, expected 6`);
    for (const h of home) {
      if (!h.demos.length) fail(19, `index.html: ${h.id} has no public demo link on a *.naindev.com host`);
      if (json && !mainIds.includes(h.id)) fail(19, `index.html: ${h.id} is not in projects.json`);
      const m = json && json.find((x) => x.id === h.id);
      if (m && h.demos.length && !h.demos.some((d) => m.links.some((l) => new URL(l.url).hostname === new URL(d).hostname))) warn(19, `index.html: ${h.id} demo ${h.demos[0]} is not among its projects.json links`);
    }
    info(19, `index.html: ${home.length} projects: ${home.map((h) => `${h.id} → ${h.demos.map((d) => new URL(d).hostname).join(', ') || 'no demo'}`).join(' · ')}`);
  }
});
phase('counts (E)');

// ---------- 23 (H). the expression switch
await guard(23, 'expression switch', async () => {
  const state = (page) => page.evaluate(() => ({
    dt: document.documentElement.getAttribute('data-theme'),
    pressed: [...document.querySelectorAll('[data-theme-toggle]')].map((b) => b.getAttribute('aria-pressed')),
    fav: document.getElementById('favicon') ? document.getElementById('favicon').getAttribute('href') : null,
    tc: document.getElementById('themeColor') ? document.getElementById('themeColor').getAttribute('content') : null,
    bg: getComputedStyle(document.body).backgroundColor,
    ls: (() => { try { return window.localStorage.getItem('theme'); } catch (e) { return 'blocked'; } })(),
    get: window.naindevTheme ? window.naindevTheme.get() : null,
  }));
  const expectState = (s, want, where, { stored } = {}) => {
    const e = EXPECT[want];
    const probs = [];
    if (s.get !== want) probs.push(`naindevTheme.get() ${s.get}`);
    if (s.bg !== rgb(e.rgb)) probs.push(`background ${s.bg}`);
    if (s.pressed.some((x) => x !== (want === 'light' ? 'true' : 'false'))) probs.push(`aria-pressed ${s.pressed.join('/')}`);
    if (!s.fav || !s.fav.includes(e.favicon)) probs.push(`favicon ${s.fav}`);
    if (!s.tc || s.tc.toUpperCase() !== e.hex) probs.push(`theme-color ${s.tc}`);
    if (stored !== undefined && s.ls !== stored) probs.push(`localStorage theme=${s.ls}`);
    if (probs.length) fail(23, `${where}: expected ${e.name} (${e.hex}); got ${probs.join(', ')}`);
    return !probs.length;
  };
  const steps = [];
  {
    const { ctx, page, log } = await open(ctxOptions({ width: 1440, theme: 'deep' }), HOME, '?lang=es');
    const named = await page.getByRole('button', { name: 'Modo claro' }).count();
    if (!named) fail(23, 'index.html ES: no button named "Modo claro"');
    expectState(await state(page), 'dark', 'index.html, fresh visitor on a dark system', { stored: null });
    await page.click('header.top [data-theme-toggle]');
    const s1 = await state(page);
    if (s1.dt !== 'light') fail(23, `after one click data-theme is ${s1.dt}, expected light`);
    expectState(s1, 'light', 'after one click', { stored: 'light' });
    await page.reload({ waitUntil: 'networkidle' });
    const s2 = await state(page);
    if (s2.dt !== 'light') fail(23, `after reload data-theme is ${s2.dt}: the choice did not survive`);
    expectState(s2, 'light', 'after reload');
    await page.click('header.top [data-theme-toggle]');
    const s3 = await state(page);
    if (s3.dt !== 'dark') fail(23, `after a second click data-theme is ${s3.dt}, expected dark (an explicit choice)`);
    expectState(s3, 'dark', 'after a second click', { stored: 'dark' });
    await page.reload({ waitUntil: 'networkidle' });
    expectState(await state(page), 'dark', 'after the second reload');
    await drain(page, log, 'switch on index.html');
    await ctx.close();
    steps.push('header switch at 1440: deep → paper (data-theme, aria-pressed, favicon, theme-color, storage) → reload keeps paper → deep → reload keeps deep');
  }
  {
    const { ctx, page, log } = await open(ctxOptions({ width: 1440, theme: 'paper' }), HOME, '?lang=en');
    if (!(await page.getByRole('button', { name: 'Light mode' }).count())) fail(23, 'index.html EN: no button named "Light mode"');
    expectState(await state(page), 'light', 'index.html EN, fresh visitor on a light system', { stored: null });
    await page.click('header.top [data-theme-toggle]');
    expectState(await state(page), 'dark', 'EN, one click on a light system', { stored: 'dark' });
    await drain(page, log, 'switch on index.html EN');
    await ctx.close();
    steps.push('EN on a light system: paper → deep, accessible name "Light mode"');
  }
  if (!QUICK) {
    const { ctx, page, log } = await open(ctxOptions({ width: 390, height: 844, theme: 'deep' }), HOME, '?lang=es');
    await page.click('#menuOpen');
    await page.click('#sheet [data-theme-toggle]');
    expectState(await state(page), 'light', '390, the switch in the menu', { stored: 'light' });
    await drain(page, log, 'switch in the menu at 390');
    await ctx.close();
    steps.push('390: the switch in the menu sheet flips to paper');
  }
  {
    // Storage blocked: reading localStorage throws. No console error, and the switch works for this page view.
    const block = () => {
      const thrower = { configurable: true, get() { throw new DOMException('The operation is insecure.', 'SecurityError'); } };
      try { Object.defineProperty(window, 'localStorage', thrower); } catch (e) { /* none */ }
      try { Object.defineProperty(Window.prototype, 'localStorage', thrower); } catch (e) { /* none */ }
    };
    const { ctx, page, log } = await open(ctxOptions({ width: 1440, theme: 'deep' }), HOME, '?lang=es', { init: [block] });
    const blocked = await page.evaluate(() => { try { window.localStorage.getItem('x'); return false; } catch (e) { return true; } });
    if (!blocked) fail(23, 'could not block localStorage in the test (the init script did not take)');
    const errs = log.errors.slice();
    expectState(await state(page), 'dark', 'storage blocked, dark system');
    await page.click('header.top [data-theme-toggle]');
    const s = await state(page);
    if (s.dt !== 'light') fail(23, `storage blocked: after a click data-theme is ${s.dt}, expected light`);
    expectState(s, 'light', 'storage blocked, after a click');
    await page.click('header.top [data-theme-toggle]');
    expectState(await state(page), 'dark', 'storage blocked, after a second click');
    if (errs.length || log.errors.length) fail(23, `storage blocked: console errors ${[...errs, ...log.errors].join(' | ').slice(0, 200)}`);
    await drain(page, log, 'switch with storage blocked');
    await ctx.close();
    steps.push('localStorage throwing: loads without console errors, the switch flips both ways for the page view');
  }
  if (!QUICK) {
    await pool(PAGES.filter((p) => p !== HOME && !STANDALONE(p)), async (p) => {
      const { ctx, page, log } = await open(ctxOptions({ width: 1440, theme: 'deep' }), p, '?lang=es');
      if (!(await page.locator('header.top [data-theme-toggle]').isVisible().catch(() => false))) fail(23, `${p.file}: no visible expression switch in header.top at 1440`);
      else {
        await page.click('header.top [data-theme-toggle]');
        expectState(await state(page), 'light', `${p.file}: one click on the header switch`, { stored: 'light' });
      }
      await drain(page, log, `${p.file} switch`);
      await ctx.close();
    });
    steps.push(`every other page (${PAGES.length - 1}): one click on the header switch flips to paper`);
  }
  for (const s of steps) info(23, s);
});
phase('switch (H)');

// ---------- 9 and interactions under the CSP (deep blue)
const behaviour = {};
await guard(2, 'menu, notice and console', async () => {
  // Menu, privacy notice, console at 390.
  const { ctx, page, log } = await open(ctxOptions({ width: 390, height: 844 }), HOME, '?lang=es&banner=1');
  const opener = page.locator('#menuOpen');
  await opener.click();
  behaviour.menuOpen = (await opener.getAttribute('aria-expanded')) === 'true' && !(await page.evaluate(() => document.getElementById('sheet').hidden));
  await page.keyboard.press('Escape');
  behaviour.menuClosed = (await opener.getAttribute('aria-expanded')) === 'false' && (await page.evaluate(() => document.activeElement.id === 'menuOpen'));
  await drain(page, log, 'menu open/close');
  await page.click('#pbannerClose');
  behaviour.bannerClosed = await page.evaluate(() => document.getElementById('pbanner').hidden);
  await drain(page, log, 'privacy notice');
  const payload = '<img src=x onerror=alert(1)>';
  if (await page.locator('#termIn').count()) {
    await page.locator('#termIn').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    for (const c of ['ayuda', 'stack', 'servicios', 'contacto', 'ir proyectos', payload]) { await page.fill('#termIn', c); await page.press('#termIn', 'Enter'); }
    await page.waitForTimeout(200);
    const a = await page.evaluate((p) => ({ imgs: document.querySelectorAll('#termOut img').length, text: document.getElementById('termOut').textContent.includes(p) }), payload);
    await page.reload({ waitUntil: 'networkidle' });
    await page.locator('#termIn').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    const b = await page.evaluate((p) => ({ imgs: document.querySelectorAll('#termOut img').length, text: document.getElementById('termOut').textContent.includes(p) }), payload);
    await page.fill('#termIn', 'limpiar'); await page.press('#termIn', 'Enter');
    behaviour.injection = { imgsAfterRun: a.imgs, shownAsText: a.text, imgsAfterReload: b.imgs, shownAfterReload: b.text };
    if (a.imgs || b.imgs || !a.text || !b.text) fail(9, JSON.stringify(behaviour.injection));
    else info(9, 'payload printed as text after running and after reload; no <img> created, no dialog');
  } else fail(9, 'index.html has no console (#termIn)');
  await drain(page, log, 'console commands');
  await ctx.close();
  if (!behaviour.menuOpen || !behaviour.menuClosed) fail(2, 'menu did not open and close cleanly');
  if (!behaviour.bannerClosed) fail(2, 'privacy notice did not close');
});
await guard(2, 'hero and mark', async () => {
  // Hero hover and click, the mark on hover, the hero loop on and off screen, at 1440.
  const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), HOME, '?lang=es');
  await page.mouse.move(900, 420); await page.mouse.move(1000, 460, { steps: 8 }); await page.mouse.down(); await page.mouse.up();
  await page.hover('#brandMark'); await page.waitForTimeout(300); await page.mouse.move(700, 600); await page.waitForTimeout(600);
  // The page scrolls smoothly: jump instantly, then give the observer up to 1.5 s to react.
  const settle = (top, want) => page.evaluate(async ([top, want]) => {
    scrollTo({ top: top < 0 ? document.documentElement.scrollHeight : top, behavior: 'instant' });
    for (let k = 0; k < 15; k++) { await new Promise((r) => setTimeout(r, 100)); if (window.naindevField.running() === want) return true; }
    return false;
  }, [top, want]);
  behaviour.heroRunningInView = await settle(0, true);
  behaviour.heroStopsOffscreen = await settle(-1, false);
  await drain(page, log, 'hero and mark interactions');
  await ctx.close();
  if (!behaviour.heroRunningInView || !behaviour.heroStopsOffscreen) fail(2, `hero loop: running in view ${behaviour.heroRunningInView}, stops off screen ${behaviour.heroStopsOffscreen}`);
});
await guard(11, 'agenda loop', async () => {
  // The mark that becomes an agenda: the living surface of the inner pages runs on screen and pauses off it.
  const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), 'servicios.html', '?lang=es');
  const st = () => page.evaluate(() => [...new Set(document.querySelector('.agd').getAnimations({ subtree: true }).map((a) => a.playState))].join(','));
  await page.waitForTimeout(300);
  const onScreen = await st();
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(400);
  const offScreen = await st();
  await drain(page, log, 'agenda loop');
  await ctx.close();
  const { ctx: c2, page: p2 } = await open(ctxOptions({ width: 1440 }), 'servicios.html', '?vivo=0');
  const still = await p2.evaluate(() => document.querySelector('.agd').getAnimations({ subtree: true }).length);
  await c2.close();
  behaviour.agenda = { onScreen, offScreen, stillAnimations: still };
  if (onScreen !== 'running' || offScreen !== 'paused') fail(11, `agenda loop: ${onScreen} on screen, ${offScreen} off screen`);
  if (still) fail(11, `agenda loop: ${still} animations with ?vivo=0`);
  info(11, 'agenda loop in the page heads: running on screen, paused off screen, still with ?vivo=0');
});
await guard(2, 'LAB', async () => {
  // LAB: the diagram that runs (hover and focus) and the replay buttons.
  const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), 'lab.html', '?lang=es');
  const fig = page.locator('[data-replay]').first();
  if (await fig.count()) { await fig.scrollIntoViewIfNeeded(); await page.waitForTimeout(1300); await fig.hover(); await fig.focus(); await page.waitForTimeout(400); }
  const n = await page.locator('[data-replay-target]').count();
  for (let i = 0; i < n; i++) { const b = page.locator('[data-replay-target]').nth(i); await b.scrollIntoViewIfNeeded(); await b.click(); }
  await page.waitForTimeout(1400);
  behaviour.labReplays = n;
  const built = await page.evaluate(() => [...document.querySelectorAll('.lab-stage')].every((s) => s.classList.contains('aparece')));
  await drain(page, log, 'LAB diagram and replay buttons');
  await ctx.close();
  if (!built) fail(2, 'LAB: a stage did not end built after replay');
  info(2, `interactions checked: menu, privacy notice, console (6 commands + injection), hero hover and click, mark hover, the pulse diagram in lab.html (hover and focus), ${n} LAB replays, the expression switch (23)`);
});
await guard(6, 'mesh legend', async () => {
  // Mesh legend numbers match the marked defects.
  const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), 'servicio-validacion-3d.html', '?lang=es');
  const m = await page.evaluate(() => ({ holes: document.querySelectorAll('#malla .m-hole').length, flips: document.querySelectorAll('#malla .m-flip').length,
    legHoles: +document.querySelector('#malla .m-n-holes').textContent, legFlips: +document.querySelector('#malla .m-n-flips').textContent }));
  await drain(page, log, 'mesh');
  await ctx.close();
  behaviour.mesh = m;
  if (m.holes !== m.legHoles || m.flips !== m.legFlips) fail(6, `mesh legend ${JSON.stringify(m)}`);
  else info(6, `mesh legend matches the marks: ${m.holes} holes, ${m.flips} flipped faces`);
});
phase('interactions');

// ---------- 10. reduced motion (deep blue)
await pool(PAGES.map((p) => ({ p, where: `${p.file} reduced motion` })), async ({ p, where }) => {
  const { ctx, page, log } = await open(ctxOptions({ width: 1440, reduced: true }), p, '?lang=es');
  await page.waitForTimeout(800);
  const r = await page.evaluate(async () => {
    const r0 = window.__raf;
    await new Promise((res) => setTimeout(res, 2000));
    const notFinal = [...document.querySelectorAll('.cae,.linea,.cota,.cota-lbl,.brk-l i,.trama-blk,.pl,.dp,.m-scan')].filter((e) => {
      const cs = getComputedStyle(e);
      return cs.opacity !== '1' && !e.classList.contains('pl') && !e.classList.contains('m-scan') || (cs.transform !== 'none' && !e.closest('svg'));
    }).map((e) => e.className.baseVal ?? e.className).slice(0, 4);
    return { mo: document.documentElement.classList.contains('mo'), raf: window.__raf - r0, running: document.getAnimations().filter((a) => a.playState === 'running').length,
      unbuilt: [...document.querySelectorAll('.apar')].filter((s) => !s.classList.contains('aparece')).length, notFinal };
  });
  await drain(page, log, where);
  await ctx.close();
  if (r.mo) fail(10, `${p.file}: motion class set with reduced motion`);
  if (r.raf) fail(10, `${p.file}: ${r.raf} animation frames in 2 s`);
  if (r.running) fail(10, `${p.file}: ${r.running} running animations`);
  if (r.unbuilt) fail(10, `${p.file}: ${r.unbuilt} sections not in their final state`);
  if (r.notFinal.length) fail(10, `${p.file}: elements not in final state: ${r.notFinal.join(', ')}`);
});
if (S.get(10).ok) info(10, `${PAGES.length} pages: no motion class, 0 animation frames, 0 running animations, every section built`);
phase('reduced motion');

// ---------- 11. idle loop and final state after construction (deep blue)
await pool(PAGES.map((p) => ({ p, where: `${p.file} idle` })), async ({ p, where }) => {
  const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), p, '?lang=es');
  const r = await page.evaluate(async () => {
    const wait = (ms) => new Promise((res) => setTimeout(res, ms));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight * 0.6) { scrollTo(0, y); await wait(120); }
    scrollTo(0, document.documentElement.scrollHeight);
    // Content skipped by content-visibility gets its style only when read; read it now so any
    // transition it starts has finished before the final-state check below.
    document.querySelectorAll('.cae,.linea').forEach((e) => getComputedStyle(e).opacity);
    await wait(3000);
    const r0 = window.__raf;
    await wait(3000);
    // Final state within 1 % opacity and half a pixel: the tail of an ease-out curve counts as arrived.
    const off = [...document.querySelectorAll('.cae,.linea')].filter((e) => {
      const cs = getComputedStyle(e), m = new DOMMatrix(cs.transform === 'none' ? undefined : cs.transform);
      return +cs.opacity < 0.99 || Math.abs(m.m41) > 0.5 || Math.abs(m.m42) > 0.5 || Math.abs(m.a - 1) > 0.01 || Math.abs(m.d - 1) > 0.01;
    });
    return { raf: window.__raf - r0, unbuilt: [...document.querySelectorAll('.apar')].filter((s) => !s.classList.contains('aparece')).length, off: off.length,
      running: document.getAnimations().filter((a) => a.playState === 'running' && isFinite(a.effect.getComputedTiming().endTime)).length };
  });
  await drain(page, log, where);
  await ctx.close();
  if (r.raf) fail(11, `${p.file}: ${r.raf} animation frames in 3 s at rest with the hero off screen`);
  if (r.unbuilt || r.off) fail(11, `${p.file}: after scrolling, ${r.unbuilt} sections and ${r.off} elements are not in their final state`);
});
info(11, `${PAGES.length} pages: 0 animation frames in the 3 s after 3 s at rest with the hero off screen; every section built after scrolling`);
await guard(11, 'hero canvas', async () => {
  const { ctx, page } = await open(ctxOptions({ width: 390, height: 844, extra: { deviceScaleFactor: 3 } }), HOME);
  const c = await page.evaluate(() => { const f = document.getElementById('field'); return { ratio: f.width / f.getBoundingClientRect().width, ta: getComputedStyle(document.querySelector('.hero')).touchAction }; });
  await ctx.close();
  if (c.ratio > 2.001) fail(11, `hero canvas at DPR ${c.ratio.toFixed(2)}`);
  if (c.ta !== 'pan-y') fail(11, `hero touch-action is ${c.ta}`);
  const { ctx: c2, page: p2 } = await open(ctxOptions({ width: 1440 }), HOME);
  const h = await p2.evaluate(async () => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    await new Promise((r) => setTimeout(r, 400));
    return window.naindevField.running();
  });
  await c2.close();
  if (h) fail(11, 'hero keeps running with the tab hidden');
  info(11, `hero canvas: backing ratio ${c.ratio.toFixed(2)} on a DPR 3 phone, touch-action ${c.ta}, stops with the tab hidden; no shadowBlur in the code: ${!/shadowBlur/.test(sources['assets/nain.js'])}`);
  if (/shadowBlur/.test(sources['assets/nain.js'])) fail(11, 'shadowBlur in nain.js');
});
phase('idle');

// ---------- 22 (G). motion rules at runtime
await guard(22, 'motion runtime', async () => {
  const kebab = (p) => { const k = p.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()); return k.startsWith('webkit-') ? '-' + k : k === 'css-offset' ? 'offset' : k; };
  const table = new Map();
  let total = 0;
  await pool(PAGES.map((p) => ({ p, where: `${p.file} motion` })), async ({ p, where }) => {
    const { ctx, page, log } = await open(ctxOptions({ width: 1440 }), p, '?lang=es', { init: [animRecorderInit] });
    await page.evaluate(async () => {
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      window.__recAll('load');
      for (let y = 0; y <= document.documentElement.scrollHeight; y += innerHeight * 0.5) { scrollTo({ top: y, behavior: 'instant' }); await wait(160); window.__recAll('scroll'); }
      await wait(700); window.__recAll('end');
      scrollTo({ top: 0, behavior: 'instant' }); await wait(500); window.__recAll('top');
    });
    // responses: hover the controls that answer; then flip the expression twice (colour changes are instant)
    for (const sel of ['header.top [data-theme-toggle]', 'header.top a.btn', 'main a.btn', '.card.resp', '.chip', 'nav.main a', '.tlink', '.pbanner-x']) {
      const l = page.locator(sel).first();
      if (!(await l.count()) || !(await l.isVisible().catch(() => false))) continue;
      await l.scrollIntoViewIfNeeded().catch(() => {});
      await l.hover().catch(() => {});
      await page.waitForTimeout(160);
      await page.evaluate(() => window.__recAll('hover'));
    }
    if (await page.locator('header.top [data-theme-toggle]').isVisible().catch(() => false)) {
      for (let k = 0; k < 2; k++) { await page.click('header.top [data-theme-toggle]'); await page.waitForTimeout(60); await page.evaluate(() => window.__recAll('switch')); }
    }
    const anims = await page.evaluate(() => window.__anims);
    await drain(page, log, where);
    await ctx.close();
    total += anims.length;
    for (const a of anims) {
      const props = a.type === 'CSSTransition' ? [a.prop] : [...new Set(a.kf.flatMap((k) => Object.keys(k.v)))].map(kebab);
      const probs = [];
      const badP = props.filter((x) => !allowedProperty(x));
      if (badP.length) probs.push(`animates ${badP.join(', ')}`);
      const d = a.duration;
      if (typeof d !== 'number' || !(d < 1 || (d >= MIN_MS && d <= MAX_MS) || (a.agd && d === CYCLE_MS))) probs.push(`lasts ${typeof d === 'number' ? Math.round(d) : d} ms`);
      let easings;
      if (a.type === 'CSSAnimation') easings = a.kf.slice(0, -1).map((k) => k.e);
      else if (a.type === 'CSSTransition') easings = [a.easing];
      else easings = [a.easing, ...a.kf.slice(0, -1).map((k) => k.e).filter((e) => e !== 'linear')];
      const badE = [...new Set(easings.filter((e) => !allowedEasing(e)))];
      if (badE.length) probs.push(`easing ${badE.join(', ')}`);
      if (a.iterations === 'Infinity' && !a.agd) probs.push('runs forever outside the living surface');
      if (a.agd && a.type === 'CSSAnimation' && typeof d === 'number') {
        const mv = movements(a.kf.map((k) => ({ o: k.o, props: k.v })), d).filter((m) => m.ms < MIN_MS || m.ms > MAX_MS);
        if (mv.length) probs.push(`movements outside ${MIN_MS}–${MAX_MS} ms in the cycle: ${mv.slice(0, 3).map((m) => `${kebab(m.prop)} ${Math.round(m.ms)} ms`).join(', ')}${mv.length > 3 ? ' …' : ''}`);
      }
      const kind = a.type === 'CSSTransition' ? 'transition' : a.type === 'CSSAnimation' ? 'animation' : 'WAAPI';
      const dr = typeof d === 'number' ? Math.round(d) : d;
      const key = [kind, a.name || a.prop, props.join('+'), dr, easings.join(' '), a.agd, probs.join('; ')].join('|');
      if (!table.has(key)) table.set(key, { kind, what: a.name || props.join('+'), props, d: dr, easing: [...new Set(easings)].join(' / '), agd: a.agd, probs, count: 0, pages: new Set(), sel: a.sel });
      const e = table.get(key);
      e.count++; e.pages.add(p.name);
    }
  });
  const rows = [...table.values()].sort((a, b) => (b.probs.length > 0) - (a.probs.length > 0) || b.count - a.count);
  info(22, `${total} animations recorded on ${PAGES.length} pages (1440 ES, deep blue, motion on: scroll through, hover the controls, flip the expression twice); ${rows.length} distinct kinds:`);
  info(22, '    kind        what                     duration  easing                               count  pages / example');
  for (const r of rows) {
    const pages = [...r.pages];
    info(22, `  ${r.probs.length ? '✗' : ' '} ${r.kind.padEnd(10)}  ${String(r.what).slice(0, 24).padEnd(24)} ${String(r.d).padStart(6)} ms  ${r.easing.replace(/cubic-bezier/g, 'cb').slice(0, 36).padEnd(36)} ${String(r.count).padStart(5)}  ${pages.slice(0, 3).join(',')}${pages.length > 3 ? ` +${pages.length - 3}` : ''} · ${r.sel.slice(0, 50)}`);
    if (r.probs.length) fail(22, `${r.kind} ${r.what} on ${r.sel.slice(0, 60)} (${pages.slice(0, 4).join(', ')}${pages.length > 4 ? ' …' : ''}): ${r.probs.join('; ')}`);
  }
});
phase('motion runtime (G)');

// ============================================================ 13 (I). exports
if (EXPORTS) {
  const OUT = process.env.CHECK_EXPORTS_DIR || join(ROOT, 'exports');   // CHECK_EXPORTS_DIR: try the captures elsewhere
  // Delete the old captures, inside exports/ only.
  await mkdir(OUT, { recursive: true });
  for (const e of await readdir(OUT)) await rm(join(OUT, e), { recursive: true, force: true });
  let exported = 0;
  const jobs = [];
  for (const p of PAGES) for (const theme of ['deep', 'paper']) for (const width of [390, 1440]) for (const lang of ['es', 'en']) if (!STANDALONE(p) || lang === 'es') jobs.push({ p, theme, width, lang, where: `${p.file} export ${width} ${lang} ${theme}` });
  for (const p of PAGES) await mkdir(join(OUT, p.name), { recursive: true });
  await pool(jobs, async ({ p, theme, width, lang }) => {
    const ctx = await browser.newContext(ctxOptions({ width, height: 900, theme, reduced: true }));
    await ctx.addInitScript(PRIVACY_CLOSED);
    const page = await ctx.newPage();
    await page.goto(`${base}${p.url}?lang=${lang}`, { waitUntil: 'networkidle' });
    await page.addStyleTag({ content: 'header.top{position:relative!important}*{content-visibility:visible!important}' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const parts = await page.$$('body > header, main > section, main > article, body > footer');
    let i = 0;
    for (const el of parts) {
      const box = await el.boundingBox();
      if (!box || box.height < 4) continue;
      const id = await el.evaluate((e) => {
        if (e.tagName === 'HEADER' || e.tagName === 'FOOTER') return e.tagName.toLowerCase();
        const by = (e.getAttribute('aria-labelledby') || '').replace(/Title$/, '');
        const cls = (typeof e.className === 'string' ? e.className : '').split(' ').filter((c) => c && !/^(apar|aparece|on-|slim)/.test(c))[0];
        return (e.id || (by && by !== 'page' ? by : '') || cls || e.tagName.toLowerCase()).replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
      });
      await el.screenshot({ path: join(OUT, p.name, `${String(i++).padStart(2, '0')}-${id}-${width}-${lang}-${theme === 'deep' ? 'deep' : 'paper'}.png`), animations: 'disabled' });
      exported++;
    }
    await ctx.close();
  });
  await cp(globalThis.FF_DIR, join(OUT, 'first-frame'), { recursive: true });
  const ff = (await readdir(join(OUT, 'first-frame'))).length;
  // Quantise to 256 colours (a palette that keeps the brand accents, tools/lib/quantise.py) and drop metadata,
  // when Python with Pillow and NumPy is around.
  const py = spawnSync('python3', [join(ROOT, 'tools', 'lib', 'quantise.py'), OUT], { encoding: 'utf8' });
  const size = execFileSync('du', ['-sk', OUT], { encoding: 'utf8' }).split('\t')[0];
  if (py.status !== 0) warn(13, `not quantised: ${(py.stderr || '').trim().split('\n').pop()}`);
  info(13, `${exported} section captures in exports/<page>/NN-<section>-<width>-<lang>-<theme>.png (${PAGES.length} pages × 390/1440 × ES/EN × deep/paper) + ${ff} first frames in exports/first-frame/; ${exported + ff} files, ${(size / 1024).toFixed(1)} MB${py.status === 0 ? ', quantised to 256 colours, metadata stripped' : ''}`);
  phase('exports (I)');
} else { S.get(13).skip = true; info(13, `skipped (${QUICK ? '--quick' : '--no-exports'}); first frames of check 17 are in ${globalThis.FF_DIR}`); }

await browser.close();
srv.close();

// ============================================================ report
flushAgg();
let bad = 0, counted = 0;
for (const r of [...S.values()].sort((a, b) => a.id - b.id)) {
  const status = r.skip ? 'SKIP' : r.ok ? 'PASS' : 'FAIL';
  console.log(`${status}  ${String(r.id).padStart(2)}. ${r.name}${r.ok && r.warn.length ? `  (${r.warn.length} to review)` : ''}`);
  for (const m of r.info) console.log(`        ${m}`);
  for (const m of r.warn.slice(0, 30)) console.log(`      ! ${m}`);
  if (r.warn.length > 30) console.log(`      … ${r.warn.length - 30} more to review`);
  for (const m of r.detail.slice(0, 40)) console.log(`      ✗ ${m}`);
  if (r.detail.length > 40) console.log(`      … ${r.detail.length - 40} more`);
  if (!r.skip) { counted++; if (!r.ok) bad++; }
}
console.log(`\ntime: ${phases.join(' · ')}`);
console.log(`${bad ? `FAIL: ${bad} of ${counted} checks` : `PASS: ${counted} of ${counted} checks`} · ${Math.round((Date.now() - t0) / 1000)} s`);
process.exit(bad ? 1 : 0);
