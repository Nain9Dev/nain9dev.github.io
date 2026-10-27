// Guards for specs/next-receipts-strip: the hero ends with four receipts a visitor can check by following
// a link (source, checks, the commit that produced the page, service status), with no third-party request.
import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { findBlockedClaims } from './check-claims.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (file) => readFile(join(ROOT, file), 'utf8').then((text) => text.replace(/\r\n/g, '\n'));
const exists = (file) => access(join(ROOT, file)).then(() => true, () => false);

const REPOSITORY = 'https://github.com/Nain9Dev/nain9dev.github.io';
const HERO = 'src/components/home/Hero.astro';
const BUILD_INFO = 'src/utils/build-info.ts';

const band = (hero) => hero.match(/<ul class="receipts"[\s\S]*?<\/ul>/)?.[0] ?? '';
const items = (list) => list.match(/<li>[\s\S]*?<\/li>/g) ?? [];

test('RC-001: the hero ends with a named list of four receipts, each one link to its evidence, in order', async () => {
  const hero = await read(HERO);
  const list = band(hero);
  assert.ok(list, 'Hero.astro renders <ul class="receipts">');
  assert.match(list, /<ul class="receipts" aria-labelledby="receipts-lead">/, 'the list is named by its lead');
  assert.match(hero, /<p class="eyebrow receipts-lead" id="receipts-lead">Comprobable<\/p>/, 'the visible lead names the band');
  const receipts = items(list);
  assert.equal(receipts.length, 4, 'exactly four receipts');
  // Astro expressions: {repository}, {`${repository}/actions`}, plain strings.
  const hrefs = receipts.map((item) => (item.match(/href=(\{`[^`]*`\}|\{[^}]*\}|"[^"]*")/)?.[1] ?? '')
    .replace(/^\{`?|`?\}$|^"|"$/g, '')
    .replace(/\$\{repository\}|^repository$/g, REPOSITORY));
  assert.deepEqual(hrefs, [
    REPOSITORY,
    `${REPOSITORY}/actions`,
    `${REPOSITORY}/commit/\${build.sha}`,
    'https://status.naindev.com/',
  ]);
  for (const item of receipts) {
    assert.equal((item.match(/<a /g) ?? []).length, 1, 'one link per receipt');
    assert.match(item, /target="_blank"/);
    assert.match(item, /rel="noopener noreferrer"/);
    assert.ok(item.indexOf('class="receipt-label"') < item.indexOf('class="receipt-value"'), 'label before value');
  }
  // The band is appended after the hero grid and its panel, so the existing reading order holds.
  const at = (needle) => hero.indexOf(needle);
  assert.ok(at('class="hero-panel"') < at('class="receipts"'), 'the band follows the hero grid');
  assert.ok(at('class="receipts"') < hero.lastIndexOf('</section>'), 'the band stays inside the hero section');
});

test('RC-002: the publication receipt is the commit being built, resolved by build-info.ts', async () => {
  const hero = await read(HERO);
  assert.match(hero, /import \{ buildInfo \} from '\.\.\/\.\.\/utils\/build-info';/);
  assert.match(hero, /const build = buildInfo\(\);/);
  const list = band(hero);
  assert.match(list, /<code translate="no">\{build\.shortSha\}<\/code>/);
  assert.match(list, /<time datetime=\{build\.date\} translate="no">\{build\.date\}<\/time>/);

  assert.ok(await exists(BUILD_INFO), `${BUILD_INFO} exists`);
  const source = await read(BUILD_INFO);
  assert.match(source, /process\.env\.GITHUB_SHA/, 'GitHub Actions provides the commit');
  assert.match(source, /git rev-parse HEAD/, 'git provides it elsewhere');
  assert.match(source, /git show -s --format=%cs/, 'the commit date is the ISO date of the commit');
  assert.match(source, /throw new Error\(/, 'an unresolved commit stops the build');

  const { buildInfo } = await import(`../${BUILD_INFO}`);
  const info = buildInfo();
  assert.match(info.sha, /^[0-9a-f]{40}$/);
  assert.equal(info.shortSha, info.sha.slice(0, 7));
  assert.match(info.date, /^\d{4}-\d{2}-\d{2}$/);
});

test('RC-003: receipts state facts, not scores or promises', async () => {
  const list = band(await read(HERO));
  assert.deepEqual(findBlockedClaims(list), []);
  assert.doesNotMatch(list, /\d+(?:[.,]\d+)?\s*%/, 'no percentage');
  assert.doesNotMatch(list, /Lighthouse\s*\d|\d\s*(?:tests?|pruebas)|uptime|zero downtime|garant/i, 'no score, count or guarantee');
  // The only figures are the identifier and the date, which come from git.
  const literal = list.replace(/\{build\.[a-zA-Z]+\}/g, '').replace(/https?:\/\/[^\s"'`}]+/g, '').replaceAll('Nain9Dev/nain9dev.github.io', '');
  assert.doesNotMatch(literal, /\d/, 'no hand-written figure');
});

test('RC-004: the band requests nothing from a third party', async () => {
  const list = band(await read(HERO));
  assert.doesNotMatch(list, /<img|<script|<iframe|<object|<embed|fetch\(|badge|shields\.io/i);
  assert.doesNotMatch(list, /url\(/);
});

test('RC-005: the band styles use tokens, keep 44 px targets and wrap', async () => {
  const css = await read('src/styles/main.css');
  const start = css.indexOf('.receipts {');
  assert.ok(start > css.indexOf('.scroll-cue {'), 'the band rules sit with the hero rules');
  const block = css.slice(start, css.indexOf('.hero-panel {', start));
  assert.ok(block.length > 0, 'the band block precedes the panel rules');
  assert.match(block, /\.receipts \{[^}]*display: flex;[^}]*flex-wrap: wrap;/s);
  assert.match(block, /\.receipts a \{[^}]*min-height: 44px;/s);
  assert.match(block, /\.receipt-label \{[^}]*font-family: var\(--font-mono\);/s);
  assert.match(block, /\.receipt-value \{[^}]*color: var\(--color-text\);/s);
  assert.match(block, /\.receipts a:hover \.receipt-value,\s*\.receipts a:focus-visible \.receipt-value \{[^}]*color: var\(--color-link\);/s);
  assert.doesNotMatch(block, /#[0-9a-fA-F]{3,8}\b/, 'no colour literal');
  assert.doesNotMatch(block, /transition: all/);
  assert.match(css, /@media \(max-width: 36rem\) \{[^@]*\.receipts li \{[^}]*flex: 1 1 100%;/s, 'one receipt per row on phones');
});

test('RC-002/RC-006: when the site is built, both locales show the same publication value', async (t) => {
  if (!(await exists('dist/index.html')) || !(await exists('dist/en/index.html'))) {
    t.skip('dist/ not built');
    return;
  }
  const receipt = (html) => html.match(/<code translate="no">([0-9a-f]{7})<\/code>[^<]*<time datetime="(\d{4}-\d{2}-\d{2})" translate="no">\2<\/time>/);
  const es = receipt(await read('dist/index.html'));
  const en = receipt(await read('dist/en/index.html'));
  assert.ok(es, 'the Spanish home shows the identifier and the date');
  assert.ok(en, 'the English home shows the identifier and the date');
  assert.deepEqual([es[1], es[2]], [en[1], en[2]]);
  assert.equal((await read('dist/index.html')).match(/class="receipts"/g)?.length, 1);
});
