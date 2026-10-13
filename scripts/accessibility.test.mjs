// Guards for specs/033-accessibility-wcag22.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const read = (path) => readFile(path, 'utf8');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)])))).flat();
}

test('A11Y-002: code examples use a theme whose tokens reach 4.5:1', async () => {
  assert.match(await read('astro.config.mjs'), /shikiConfig:\s*\{\s*theme:\s*'github-dark-default'\s*\}/);
});

test('A11Y-003: the skip link target can receive focus', async () => {
  const pages = (await walk('src/pages')).filter((file) => file.endsWith('.astro'));
  for (const file of pages) {
    const text = await read(file);
    for (const [tag] of text.matchAll(/<main\b[^>]*id="main-content"[^>]*>/g)) {
      assert.match(tag, /tabindex="-1"/, `${file}: <main id="main-content"> needs tabindex="-1"`);
    }
  }
});

test('A11Y-003: the terminal input shows a focus indicator', async () => {
  const css = await read('src/styles/terminal.css');
  const rule = css.match(/\.terminal-input:focus-visible\s*\{([^}]*)\}/);
  assert.ok(rule, 'missing :focus-visible rule');
  assert.doesNotMatch(rule[1], /outline:\s*none/);
  assert.match(rule[1], /outline:\s*\d+px solid/);
});

test('A11Y-003: Tab never traps keyboard users in the terminal (WCAG 2.1.2)', async () => {
  const { tabCompletion, blocksKeyWhileTyping } = await import('../src/scripts/terminal-keys.js');
  const commands = ['help', 'about', 'contact', 'clear'];
  assert.equal(tabCompletion('', commands), null, 'empty input: Tab moves focus');
  assert.equal(tabCompletion('he', commands), 'help', 'partial command: Tab completes');
  assert.equal(tabCompletion('help', commands), null, 'complete command: Tab moves focus');
  assert.equal(tabCompletion('zzz', commands), null, 'no match: Tab moves focus');
  assert.equal(blocksKeyWhileTyping('Tab'), false, 'Tab is never blocked during the typing animation');
  assert.equal(blocksKeyWhileTyping('Enter'), true);
  const terminal = await read('src/scripts/terminal.js');
  assert.match(terminal, /from '\.\/terminal-keys\.js'/);
  assert.doesNotMatch(terminal, /e\.key === 'Tab'\) \{\s*e\.preventDefault\(\);/, 'Tab must not be prevented unconditionally');
});

test('A11Y-005: the typing animation neither drops nor steals focus, and announces text once', async () => {
  const terminal = await read('src/scripts/terminal.js');
  const typewriter = terminal.match(/async function typewriterAsync[\s\S]*?\n  \}\n/);
  assert.ok(typewriter, 'typewriterAsync not found');
  assert.doesNotMatch(typewriter[0], /input\.disabled/, 'disabling the input drops keyboard focus to <body>');
  assert.doesNotMatch(typewriter[0], /\.focus\(/, 'the animation must not move focus (WCAG 3.2.1)');
  assert.match(typewriter[0], /input\.readOnly = true/);
  assert.match(typewriter[0], /setAttribute\('aria-busy', 'true'\)/);
  assert.match(typewriter[0], /setAttribute\('aria-busy', 'false'\)/);
});
