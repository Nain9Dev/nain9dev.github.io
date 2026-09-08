import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
if (!process.env.NAINWRITE_ROOT) throw new Error('Set NAINWRITE_ROOT to the existing local NainWrite checkout');
let queued = true;
let running = false;
let timer;
let activeChild;
let stopped = false;
const watchers = [];
const once = process.argv.includes('--once');
function run(command, args) {
  return new Promise((resolveExit, reject) => {
    const child = spawn(command, args, { cwd: root, stdio: 'inherit', shell: false });
    activeChild = child;
    child.once('error', reject);
    child.once('exit', code => {
      activeChild = undefined;
      if (code === 0) resolveExit();
      else reject(new Error(`${command} exited with ${code}`));
    });
  });
}
async function refresh() {
  if (running || !queued || stopped) return;
  running = true;
  queued = false;
  try {
    await run(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build']);
    await run(process.execPath, ['scripts/sync-translations.mjs']);
    await run(process.env.NAINWRITE_PYTHON || 'python', ['-B', 'scripts/translate-local.py']);
    await run(process.execPath, ['scripts/review-translations.mjs']);
    console.log('Updated proposals are ready for review; production remains unchanged.');
  } catch (error) {
    console.error(`Translation update stopped: ${error.message}`);
    if (once) process.exitCode = 1;
  } finally {
    running = false;
    if (queued && !stopped && !once) timer = setTimeout(refresh, 1000);
  }
}
for (const directory of once ? [] : ['src', 'public/assets/data']) {
  watchers.push(watch(resolve(root, directory), { recursive: true }, (_, file) => {
    if (!file || file.replaceAll('\\', '/') === 'i18n/en-US.json') return;
    if (!/\.(?:astro|mdx|md|json|ts|js)$/.test(file)) return;
    queued = true;
    clearTimeout(timer);
    timer = setTimeout(refresh, 1200);
  }));
}
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => {
  stopped = true;
  queued = false;
  clearTimeout(timer);
  watchers.forEach(watcher => watcher.close());
  activeChild?.kill();
});
console.log(once ? 'Preparing translation proposals once.' : 'Watching public source text for local translation proposals. Press Ctrl+C to stop.');
await refresh();
