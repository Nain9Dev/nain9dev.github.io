#!/usr/bin/env node
// Prototype check. Run from design/home-redesign with `node tools/check.mjs` before every push.
// No dependency is committed: it uses the Playwright already installed in the environment
// (`playwright` on the module path, /opt/node-tools, or PLAYWRIGHT_MODULE=/path/to/index.mjs).
// Flags: --no-exports skips the section captures; --quick checks only 1440 px ES in the browser.
// Exit code 1 on any failure.
import http from 'node:http';
import { execFileSync, spawnSync } from 'node:child_process';
import { readFile, readdir, stat, access, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import { join, normalize, extname, dirname, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARGS = new Set(process.argv.slice(2));
const QUICK = ARGS.has('--quick');
const EXPORTS = !ARGS.has('--no-exports') && !QUICK;
const PAGES = (await readdir(ROOT)).filter((f) => f.endsWith('.html')).sort();
const WIDTHS = QUICK ? [1440] : [390, 1440];
const LANGS = QUICK ? ['es'] : ['es', 'en'];
const NEW_JS = ['assets/boot.js', 'assets/motion.js'];   // round 3 JavaScript, budget 12 KB gz
const JS_BUDGET = 12 * 1024;
const LONG_TASK = 50;
const CSP = "default-src 'self'; base-uri 'self'; connect-src 'self' https://plausible.io; font-src 'self' https://fonts.gstatic.com; form-action 'self'; frame-src 'none'; img-src 'self' data: https:; object-src 'none'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; upgrade-insecure-requests";

const results = [];            // { id, name, ok, detail[] }
let current = null;
function section(id, name) { current = { id, name, ok: true, detail: [], info: [] }; results.push(current); }
const fail = (m) => { current.ok = false; current.detail.push(m); };
const info = (m) => current.info.push(m);
const t0 = Date.now();

async function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_MODULE, 'playwright', '@playwright/test', '/opt/node-tools/node_modules/playwright/index.mjs'].filter(Boolean);
  for (const m of tries) {
    try { return await import(m.startsWith('/') ? pathToFileURL(m).href : m); } catch { /* next */ }
  }
  console.error('Playwright not found. Set PLAYWRIGHT_MODULE to its index.mjs.');
  process.exit(1);
}

function serve() {
  const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png',
    '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8' };
  const srv = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    let p = normalize(decodeURIComponent(url.pathname)).replace(/^\/+/, '');
    if (!p || p.endsWith('/')) p += 'index.html';
    const file = join(ROOT, p);
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end(); return; }
    try {
      if (!(await stat(file)).isFile()) throw new Error('not a file');
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Content-Security-Policy': CSP,
        'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store' });
      res.end(await readFile(file));
    } catch { res.writeHead(404); res.end('not found'); }
  });
  return new Promise((r) => srv.listen(0, '127.0.0.1', () => r({ srv, base: `http://127.0.0.1:${srv.address().port}/` })));
}

const git = (...a) => execFileSync('git', a, { cwd: ROOT, encoding: 'utf8' }).trim();

// ============================================================ static checks
section(7, 'Claims, phone numbers and forbidden phrases');
let BLOCKED_CLAIMS = [];
try {
  const src = git('show', 'origin/main:scripts/check-claims.mjs');
  const tmp = join(tmpdir(), `naindev-check-claims-${process.pid}.mjs`);
  await writeFile(tmp, src);
  ({ BLOCKED_CLAIMS } = await import(pathToFileURL(tmp).href));
  await rm(tmp, { force: true });
  info(`${BLOCKED_CLAIMS.length} patterns from origin/main:scripts/check-claims.mjs`);
} catch (e) { fail('could not read BLOCKED_CLAIMS from origin/main (run `git fetch origin main`): ' + e.message.split('\n')[0]); }
const PHRASES = [/auditor[ií]a gratuita/i, /free audit/i];
const PHONES = [/(?:\+|\b00)\d{1,3}[\s.-]?\d{2,3}[\s.-]?\d{3}[\s.-]?\d{3}\b/, /\b[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}\b/, /wa\.me\/\d/i, /\btel:/i, /api\.whatsapp\.com\/send\?phone/i];
const TEXT_FILES = [...PAGES, 'README.md', 'brandbook-addendum.md', 'assets/nain.js', 'assets/motion.js', 'assets/boot.js', 'assets/fix.js', 'assets/fix.data.js', 'assets/nain.css'];
const sources = {};
for (const f of TEXT_FILES) sources[f] = await readFile(join(ROOT, f), 'utf8');
for (const f of TEXT_FILES) {
  const s = sources[f];
  const visible = f.endsWith('.html') ? s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ') : s;
  if (f.endsWith('.html') || f.endsWith('.js')) for (const re of BLOCKED_CLAIMS) if (re.test(s)) fail(`${f}: blocked claim ${re}`);
  if (f !== 'README.md' && f !== 'brandbook-addendum.md') for (const re of PHRASES) if (re.test(s)) fail(`${f}: forbidden phrase ${re}`);
  for (const re of PHONES) { const m = visible.match(re) || (f.endsWith('.html') && s.match(re)); if (m) fail(`${f}: phone-like text "${m[0]}"`); }
}

section(8, 'No inline handlers, javascript: URLs, eval or new Function');
for (const f of TEXT_FILES.filter((x) => /\.(html|js)$/.test(x))) {
  const s = sources[f];
  if (f.endsWith('.html')) {
    const on = s.replace(/<script[\s\S]*?<\/script>/g, '').match(/<[^>]+\son[a-z]+\s*=/gi);
    if (on) fail(`${f}: inline handler ${on[0].slice(0, 80)}`);
  }
  if (/javascript:/i.test(s)) fail(`${f}: javascript: URL`);
  if (/\beval\s*\(|new\s+Function\s*\(|set(?:Timeout|Interval)\s*\(\s*['"`]/.test(s)) fail(`${f}: eval-like code`);
  if (/\.innerHTML\s*=|insertAdjacentHTML|outerHTML\s*=|document\.write/.test(s)) fail(`${f}: HTML injection API`);
}
for (const f of PAGES) {
  const s = sources[f];
  if (/<iframe|<form\b|<object|<embed/i.test(s)) fail(`${f}: iframe, form, object or embed`);
  if (/<script[^>]+type=["']importmap/i.test(s)) fail(`${f}: import map`);
  for (const m of s.matchAll(/<(?:script|link)[^>]+(?:src|href)="(https?:)?\/\/[^"]+"/g)) fail(`${f}: third-party resource ${m[0].slice(0, 90)}`);
}

section(11, 'Motion budget: idle loop, long tasks, JavaScript weight');
let gz = 0;
for (const f of NEW_JS) { const n = gzipSync(await readFile(join(ROOT, f)), { level: 9 }).length; gz += n; info(`${f} ${n} B gz`); }
info(`new JavaScript this round: ${(gz / 1024).toFixed(2)} KB gz (budget ${JS_BUDGET / 1024} KB)`);
if (gz > JS_BUDGET) fail(`new JavaScript ${gz} B gz is over ${JS_BUDGET} B`);
if (/\b(?:let|const)\s|=>|`|\basync\s|\bclass\s+\w+\s*\{/.test(sources['assets/motion.js'] + sources['assets/boot.js'])) fail('boot.js or motion.js uses syntax newer than ES5');
if (/\.(?:at|findLast|replaceAll)\(|structuredClone|Object\.hasOwn\b/.test(sources['assets/motion.js'] + sources['assets/boot.js'] + sources['assets/nain.js'])) fail('API not available in iOS 15');
const css = sources['assets/nain.css'];
const gridCols = [...css.matchAll(/grid-template-columns:\s*([^;}]+)/g)].map((m) => m[1]).filter((v) => /\d+fr/.test(v) && !/minmax\(0,\s*\d*fr\)/.test(v.replace(/repeat\(\d+,\s*/g, '')));
// Round 3 rule: every fr track is minmax(0,Nfr). The round 3 block overrides the earlier ones, checked in the browser below.
info(`fr tracks in the stylesheet without minmax(0,…) before overrides: ${gridCols.length}`);

section(12, 'Secret scan of the files to upload');
const FORBIDDEN = [/(^|\/)CLAUDE\.md$/, /(^|\/)AGENTS\.md$/, /(^|\/)\.claude\//, /\.scratch\.md$/, /(^|\/)\.env/, /\.(pem|key|p12|pfx)$/, /(^|\/)id_(rsa|ed25519)/];
const files = git('ls-files', '--cached', '--others', '--exclude-standard', '--', '.').split('\n').filter(Boolean);
for (const f of files) for (const re of FORBIDDEN) if (re.test(f)) fail(`forbidden file in the upload set: ${f}`);
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
  if (m) fail(`${f}: secret-like string ${m[0].slice(0, 12)}…`);
}
info(`${files.length} files in the upload set, ${scanned} text files scanned by pattern`);
const gl = process.env.GITLEAKS || (spawnSync('sh', ['-c', 'command -v gitleaks'], { encoding: 'utf8' }).stdout.trim());
if (gl) {
  const r = spawnSync(gl, ['dir', ROOT, '--no-banner', '--redact', '--log-level', 'warn'], { encoding: 'utf8' });
  if (r.status === 0) info('gitleaks: no leaks found');
  else fail('gitleaks: ' + (r.stdout + r.stderr).trim().split('\n').slice(-3).join(' '));
} else info('gitleaks not on PATH (set GITLEAKS=/path/to/gitleaks); pattern scan only');
// Nothing outside the folder, and every commit ahead of the remote authored by David.
const top = git('rev-parse', '--show-toplevel');
const prefix = relative(top, ROOT).replaceAll('\\', '/') + '/';
const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: top, encoding: 'utf8' }).split('\n').filter(Boolean).map((l) => l.slice(3));
for (const f of dirty) if (!f.startsWith(prefix)) fail(`change outside ${prefix}: ${f}`);
try {
  const ahead = git('log', '@{u}..HEAD', '--format=%h %an <%ae>');
  for (const l of ahead.split('\n').filter(Boolean)) if (!l.endsWith('David Esteban <dsuarez@contrast3d.com>')) fail(`commit not authored by David: ${l}`);
  const touched = git('diff', '--name-only', '@{u}..HEAD');
  for (const f of touched.split('\n').filter(Boolean)) if (!f.startsWith(prefix)) fail(`commit touches a file outside ${prefix}: ${f}`);
  info(`commits ahead of the remote: ${ahead ? ahead.split('\n').length : 0}`);
} catch { info('no upstream branch: commit checks skipped'); }

// ============================================================ browser checks
const { chromium } = await loadPlaywright();
const { srv, base } = await serve();
const browser = await chromium.launch({ headless: true });
const ids = new Map();
const idsOf = async (f) => { if (!ids.has(f)) ids.set(f, new Set([...(await readFile(join(ROOT, f), 'utf8')).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))); return ids.get(f); };
const ALLOWED_FRAGMENTS = new Set(['whatsapp']);   // B-014: Aitor sets the WhatsApp link at build time

async function open(ctxOpts, file, query = '', { gate = true } = {}) {
  const ctx = await browser.newContext(ctxOpts);
  const page = await ctx.newPage();
  const log = { errors: [], broken: [], external: [] };
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
    window.__raf = 0;
    const o = window.requestAnimationFrame.bind(window);
    window.requestAnimationFrame = (f) => { window.__raf++; return o(f); };
  });
  page.on('console', (m) => { if (m.type() === 'error') log.errors.push(m.text()); });
  page.on('pageerror', (e) => log.errors.push('pageerror ' + e.message));
  page.on('dialog', (d) => { log.errors.push('dialog ' + d.message()); d.dismiss(); });
  page.on('request', (r) => { const u = r.url(); if (!u.startsWith(base) && !u.startsWith('data:') && !u.startsWith('blob:')) log.external.push(u); });
  page.on('response', (r) => { if (r.status() >= 400) log.broken.push(`${r.status()} ${r.url().replace(base, '')}`); });
  page.on('requestfailed', (r) => log.broken.push(`failed ${r.url().replace(base, '')}`));
  if (gate) await page.route('**/*', (route) => (route.request().url().startsWith(base) ? route.continue() : route.abort()));
  await page.goto(`${base}${file}${query}`, { waitUntil: 'networkidle' });
  return { ctx, page, log };
}
async function drain(page, log, where, ids1, ids2, ids3) {
  const csp = await page.evaluate(() => window.__csp.splice(0));
  if (log.errors.length) { results.find((r) => r.id === 1).ok = false; results.find((r) => r.id === 1).detail.push(`${where}: ${log.errors.join(' | ')}`); }
  if (log.broken.length) { results.find((r) => r.id === 1).ok = false; results.find((r) => r.id === 1).detail.push(`${where}: broken ${log.broken.join(' ')}`); }
  if (csp.length) { results.find((r) => r.id === 2).ok = false; results.find((r) => r.id === 2).detail.push(`${where}: ${csp.join(' | ')}`); }
  if (log.external.length) { results.find((r) => r.id === 3).ok = false; results.find((r) => r.id === 3).detail.push(`${where}: ${log.external.join(' ')}`); }
  log.errors.length = 0; log.broken.length = 0; log.external.length = 0;
}
section(1, 'Console errors and broken resources');
section(2, 'CSP violations (hardened CSP sent as a header), on load and during interactions');
section(3, 'Requests to other domains');
section(4, 'Overflow, one H1, heading order, one <main>');
const s4 = current;
section(5, 'Internal links and rel="noopener noreferrer" on every _blank');
const s5 = current;
section(6, 'width and height on every <img>');
const s6 = current;
const f4 = (m) => { s4.ok = false; s4.detail.push(m); };
const f5 = (m) => { s5.ok = false; s5.detail.push(m); };
const f6 = (m) => { s6.ok = false; s6.detail.push(m); };

let loads = 0;
for (const width of WIDTHS) for (const lang of LANGS) for (const file of PAGES) {
  const { ctx, page, log } = await open({ viewport: { width, height: 900 } }, file, `?lang=${lang}`);
  loads++;
  // Walk the page so lazy pieces (pattern blocks, console, filters) build under the CSP.
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(250);
  const r = await page.evaluate(() => {
    const vis = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length) || el.classList.contains('sr');
    const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => !h.closest('[hidden]') && vis(h)).map((h) => +h.tagName[1]);
    let skips = 0; for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) skips++;
    const grids = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).display.includes('grid')).length;
    return {
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length, first: hs[0], skips, grids,
      lang: document.documentElement.lang,
      imgs: [...document.querySelectorAll('img')].filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.getAttribute('src')),
      links: [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.getAttribute('href'), target: a.getAttribute('target'), rel: a.getAttribute('rel') || '' })),
    };
  });
  const where = `${file} ${width} ${lang}`;
  await drain(page, log, where);
  if (r.overflow > 0) f4(`${where}: horizontal overflow ${r.overflow}px`);
  if (r.h1 !== 1) f4(`${where}: ${r.h1} h1`);
  if (r.main !== 1) f4(`${where}: ${r.main} <main>`);
  if (r.first !== 1) f4(`${where}: first heading is h${r.first}`);
  if (r.skips) f4(`${where}: ${r.skips} skipped heading levels`);
  if (r.lang !== lang) f4(`${where}: lang="${r.lang}"`);
  for (const src of r.imgs) f6(`${where}: <img src="${src}"> without width or height`);
  if (width === WIDTHS[WIDTHS.length - 1] && lang === 'es') {
    for (const l of r.links) {
      if (l.target === '_blank' && (!/\bnoopener\b/.test(l.rel) || !/\bnoreferrer\b/.test(l.rel))) f5(`${file}: _blank without noopener noreferrer: ${l.href}`);
      if (/^(https?:|mailto:)/.test(l.href)) continue;
      const [path, frag] = l.href.split('#');
      const target = path || file;
      try { await access(join(ROOT, target)); } catch { f5(`${file}: broken link ${l.href}`); continue; }
      if (frag && !ALLOWED_FRAGMENTS.has(frag) && !(await idsOf(target)).has(frag)) f5(`${file}: missing anchor ${l.href}`);
    }
  }
  await ctx.close();
}
s4.info.push(`${loads} page loads (${PAGES.length} pages × ${WIDTHS.join('/')} px × ${LANGS.join('/').toUpperCase()})`);

// ---------- interactions under the CSP ----------
section(9, 'Console injection shows as text');
const s9 = current;
const behaviour = {};
{
  // Menu, privacy notice, console at 390.
  const { ctx, page, log } = await open({ viewport: { width: 390, height: 844 } }, 'index.html', '?lang=es&banner=1');
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
  await drain(page, log, 'console commands');
  await ctx.close();
  if (!behaviour.menuOpen || !behaviour.menuClosed) { current = results.find((x) => x.id === 2); fail('menu did not open and close cleanly'); }
  if (!behaviour.bannerClosed) { current = results.find((x) => x.id === 2); fail('privacy notice did not close'); }
  if (a.imgs || b.imgs || !a.text || !b.text) { s9.ok = false; s9.detail.push(JSON.stringify(behaviour.injection)); }
  else s9.info.push('payload printed as text after running and after reload; no <img> created, no dialog');
}
{
  // Hero hover and click, the mark spring, the running diagram, at 1440.
  const { ctx, page, log } = await open({ viewport: { width: 1440, height: 900 } }, 'index.html', '?lang=es');
  await page.mouse.move(900, 420); await page.mouse.move(1000, 460, { steps: 8 }); await page.mouse.down(); await page.mouse.up();
  await page.hover('#brandMark'); await page.waitForTimeout(300); await page.mouse.move(700, 600); await page.waitForTimeout(600);
  const fig = page.locator('[data-replay]').first();
  await fig.scrollIntoViewIfNeeded(); await page.waitForTimeout(1300); await fig.hover(); await fig.focus(); await page.waitForTimeout(400);
  // The page scrolls smoothly: jump instantly, then give the observer up to 1.5 s to react.
  const settle = (top, want) => page.evaluate(async ([top, want]) => {
    scrollTo({ top: top < 0 ? document.documentElement.scrollHeight : top, behavior: 'instant' });
    for (let k = 0; k < 15; k++) { await new Promise((r) => setTimeout(r, 100)); if (window.naindevField.running() === want) return true; }
    return false;
  }, [top, want]);
  behaviour.heroRunningInView = await settle(0, true);
  behaviour.heroStopsOffscreen = await settle(-1, false);
  await drain(page, log, 'hero, mark and diagram interactions');
  await ctx.close();
  current = results.find((x) => x.id === 2);
  if (!behaviour.heroRunningInView || !behaviour.heroStopsOffscreen) fail(`hero loop: running in view ${behaviour.heroRunningInView}, stops off screen ${behaviour.heroStopsOffscreen}`);
}
{
  // LAB replay buttons.
  const { ctx, page, log } = await open({ viewport: { width: 1440, height: 900 } }, 'lab.html', '?lang=es');
  const n = await page.locator('[data-replay-target]').count();
  for (let i = 0; i < n; i++) { const b = page.locator('[data-replay-target]').nth(i); await b.scrollIntoViewIfNeeded(); await b.click(); }
  await page.waitForTimeout(1400);
  behaviour.labReplays = n;
  const built = await page.evaluate(() => [...document.querySelectorAll('.lab-stage')].every((s) => s.classList.contains('aparece')));
  await drain(page, log, 'LAB replay buttons');
  await ctx.close();
  current = results.find((x) => x.id === 2);
  if (!built) fail('LAB: a stage did not end built after replay');
  info(`interactions checked: menu, privacy notice, console (6 commands + injection), hero hover and click, mark hover, diagram hover and focus, ${n} LAB replays`);
}
{
  // Mesh legend numbers match the marked defects.
  const { ctx, page, log } = await open({ viewport: { width: 1440, height: 900 } }, 'servicio-validacion-3d.html', '?lang=es');
  const m = await page.evaluate(() => ({ holes: document.querySelectorAll('#malla .m-hole').length, flips: document.querySelectorAll('#malla .m-flip').length,
    legHoles: +document.querySelector('#malla .m-n-holes').textContent, legFlips: +document.querySelector('#malla .m-n-flips').textContent }));
  await drain(page, log, 'mesh');
  await ctx.close();
  behaviour.mesh = m;
  current = results.find((x) => x.id === 6);
  if (m.holes !== m.legHoles || m.flips !== m.legFlips) { s6.ok = false; s6.detail.push(`mesh legend ${JSON.stringify(m)}`); }
}

// ---------- 10. reduced motion ----------
section(10, 'Reduced motion: final state, no animation frames');
for (const file of PAGES) {
  const { ctx, page, log } = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' }, file, '?lang=es');
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
  await drain(page, log, `${file} reduced motion`);
  await ctx.close();
  current = results.find((x) => x.id === 10);
  if (r.mo) fail(`${file}: motion class set with reduced motion`);
  if (r.raf) fail(`${file}: ${r.raf} animation frames in 2 s`);
  if (r.running) fail(`${file}: ${r.running} running animations`);
  if (r.unbuilt) fail(`${file}: ${r.unbuilt} sections not in their final state`);
  if (r.notFinal.length) fail(`${file}: elements not in final state: ${r.notFinal.join(', ')}`);
}
if (current.ok) info(`${PAGES.length} pages: no motion class, 0 animation frames, 0 running animations, every section built`);

// ---------- 11. idle loop, final state after construction, long tasks ----------
current = results.find((x) => x.id === 11);
for (const file of PAGES) {
  const { ctx, page, log } = await open({ viewport: { width: 1440, height: 900 } }, file, '?lang=es');
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
  await drain(page, log, `${file} idle`);
  await ctx.close();
  if (r.raf) fail(`${file}: ${r.raf} animation frames in 3 s at rest with the hero off screen`);
  if (r.unbuilt || r.off) fail(`${file}: after scrolling, ${r.unbuilt} sections and ${r.off} elements are not in their final state`);
}
info(`${PAGES.length} pages: 0 animation frames in the 3 s after 3 s at rest with the hero off screen; every section built after scrolling`);

async function budget(file) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => {
    window.__lt = [];
    new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push([e.startTime, e.duration]))).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(base + file, { waitUntil: 'load' });
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
const median = (a) => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
const perf = {};
for (const file of QUICK ? ['index.html'] : PAGES) {
  const runs = [await budget(file)];
  // Throttled timings are noisy: when a run is over budget, take the median of five.
  if (runs[0].load > LONG_TASK || runs[0].scroll > LONG_TASK) runs.push(await budget(file), await budget(file), await budget(file), await budget(file));
  perf[file] = { firstRender: median(runs.map((r) => r.firstRender)), load: median(runs.map((r) => r.load)), scroll: median(runs.map((r) => r.scroll)), runs: runs.length };
  const p = perf[file];
  if (p.load > LONG_TASK) fail(`${file}: long task of ${p.load} ms after first paint (390 px, 4× CPU, median of ${p.runs})`);
  if (p.scroll > LONG_TASK) fail(`${file}: long task of ${p.scroll} ms while scrolling (390 px, 4× CPU, median of ${p.runs})`);
}
info('390 px, DPR 2, 4× CPU via CDP, scroll at 3000 px/s. Longest task in ms — first render (parse and first layout, before first paint) / after first paint / scrolling:');
for (const [f, p] of Object.entries(perf)) info(`  ${f.padEnd(29)} ${String(p.firstRender).padStart(4)} / ${String(p.load).padStart(3)} / ${String(p.scroll).padStart(3)}${p.runs > 1 ? `  (median of ${p.runs})` : ''}`);
{
  const { ctx, page } = await open({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3 }, 'index.html');
  const c = await page.evaluate(() => { const f = document.getElementById('field'); return { ratio: f.width / f.getBoundingClientRect().width, ta: getComputedStyle(document.querySelector('.hero')).touchAction }; });
  await ctx.close();
  if (c.ratio > 2.001) fail(`hero canvas at DPR ${c.ratio.toFixed(2)}`);
  if (c.ta !== 'pan-y') fail(`hero touch-action is ${c.ta}`);
  const { ctx: c2, page: p2 } = await open({ viewport: { width: 1440, height: 900 } }, 'index.html');
  const h = await p2.evaluate(async () => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
    await new Promise((r) => setTimeout(r, 400));
    return window.naindevField.running();
  });
  await c2.close();
  if (h) fail('hero keeps running with the tab hidden');
  info(`hero canvas: backing ratio ${c.ratio.toFixed(2)} on a DPR 3 phone, touch-action ${c.ta}, stops with the tab hidden; no shadowBlur in the code: ${!/shadowBlur/.test(sources['assets/nain.js'])}`);
  if (/shadowBlur/.test(sources['assets/nain.js'])) fail('shadowBlur in nain.js');
}

// ============================================================ exports
let exported = 0;
if (EXPORTS) {
  const OUT = join(ROOT, 'exports');
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });
  for (const file of PAGES) {
    const name = file.replace(/\.html$/, '');
    await mkdir(join(OUT, name), { recursive: true });
    for (const width of [390, 1440]) for (const lang of ['es', 'en']) {
      const ctx = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await ctx.addInitScript(() => { try { localStorage.setItem('naindev-privacy-closed', '1'); } catch (e) { /* none */ } });
      const page = await ctx.newPage();
      await page.goto(`${base}${file}?lang=${lang}`, { waitUntil: 'networkidle' });
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
          const cls = e.className.split(' ').filter((c) => c && !/^(apar|aparece|on-|slim)/.test(c))[0];
          return (e.id || (by && by !== 'page' ? by : '') || cls || e.tagName.toLowerCase()).replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();
        });
        await el.screenshot({ path: join(OUT, name, `${String(i++).padStart(2, '0')}-${id}-${width}-${lang}.png`), animations: 'disabled' });
        exported++;
      }
      await ctx.close();
    }
  }
  // Optional: quantise to 256 colours and drop metadata when Python with Pillow is around.
  const py = spawnSync('python3', ['-c', `
import sys, pathlib
from PIL import Image
for p in pathlib.Path(sys.argv[1]).rglob('*.png'):
    im = Image.open(p).convert('RGB').quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    im.save(p, optimize=True)
`, OUT], { encoding: 'utf8' });
  const size = execFileSync('du', ['-sk', OUT], { encoding: 'utf8' }).split('\t')[0];
  results.push({ id: 13, name: 'Exports', ok: true, detail: [], info: [`${exported} section captures in exports/ (390 and 1440 px, ES and EN), ${(size / 1024).toFixed(1)} MB${py.status === 0 ? ', quantised to 256 colours' : ', not quantised (no Pillow)'}`] });
}

await browser.close();
srv.close();

// ============================================================ report
results.sort((a, b) => a.id - b.id);
let bad = 0;
for (const r of results) {
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${String(r.id).padStart(2)}. ${r.name}`);
  for (const m of r.info) console.log(`        ${m}`);
  for (const m of r.detail.slice(0, 25)) console.log(`      ✗ ${m}`);
  if (r.detail.length > 25) console.log(`      … ${r.detail.length - 25} more`);
  if (!r.ok) bad++;
}
console.log(`\n${bad ? `FAIL: ${bad} of ${results.length} checks` : `PASS: ${results.length} of ${results.length} checks`} · ${Math.round((Date.now() - t0) / 1000)} s`);
process.exit(bad ? 1 : 0);
