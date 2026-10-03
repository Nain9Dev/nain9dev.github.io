import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

function isIgnored(relativePath) {
  try {
    execFileSync('git', ['check-ignore', '-q', relativePath], { cwd: ROOT, stdio: 'ignore' });
    return true;
  } catch (error) {
    if (error.status === 1) return false;
    throw error;
  }
}

test('SEC-001: cryptographic keys, credentials, and tokens are ignored by git', () => {
  const secretPaths = [
    'server.key',
    'cert.pem',
    'bundle.pfx',
    'auth.json',
    'google-credentials.json',
    'my-token.json',
    '.netrc',
  ];

  for (const path of secretPaths) {
    assert.ok(isIgnored(path), `Expected ${path} to be ignored by git`);
  }
});

test('SEC-002: Python caches, virtual environments, and test reports are ignored', () => {
  const runtimePaths = [
    '__pycache__/module.pyc',
    '.venv/bin/activate',
    'venv/lib/pkg.py',
    'test-results/summary.json',
    'playwright-report/index.html',
    'profile.cpuprofile',
  ];

  for (const path of runtimePaths) {
    assert.ok(isIgnored(path), `Expected ${path} to be ignored by git`);
  }
});

test('SEC-003: AI assistant contexts, local model weights, and scratch files are ignored', () => {
  const aiPaths = [
    '.cursor/rules',
    '.cursorrules',
    '.windsurf/config.json',
    'model.gguf',
    'weights.safetensors',
    'notes.scratch.md',
    'scratch/test.txt',
  ];

  for (const path of aiPaths) {
    assert.ok(isIgnored(path), `Expected ${path} to be ignored by git`);
  }
});

test('SEC-004: gitignore contains only English comments and maintains essential ignores', async () => {
  const content = await readFile(join(ROOT, '.gitignore'), 'utf8');

  const spanishPatterns = [
    /\bEntorno\b/i,
    /\bSistema Operativo\b/i,
    /\bArchivos\b/i,
    /\bSeguridad\b/i,
    /\bPrivacidad\b/i,
    /\bCachés\b/i,
    /\bDirectorios\b/i,
  ];

  for (const pattern of spanishPatterns) {
    assert.doesNotMatch(content, pattern, `Found Spanish pattern ${pattern} in .gitignore`);
  }

  const essentialPatterns = [
    'node_modules/',
    'dist/',
    '.astro/',
    'AGENTS.md',
    'CLAUDE.md',
    '.portfolio-private/',
  ];

  for (const pattern of essentialPatterns) {
    assert.ok(content.includes(pattern), `Missing essential pattern ${pattern} in .gitignore`);
  }
});
