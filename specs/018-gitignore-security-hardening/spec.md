# Specification: Gitignore Security Hardening

## Overview
Harden `.gitignore` to prevent inadvertent tracking of cryptographic keys, API credentials, Python virtual environments, AI assistant contexts, local LLM weights, and test/profiling artifacts. Translate all sections and comments to professional English to maintain workspace consistency.

## Requirements (EARS)
- **SEC-001**: When private keys, SSL certificates, tokens, or credential files are placed in the workspace (`*.pem`, `*.key`, `*.pfx`, `*.crt`, `*credentials*.json`, `*token*.json`, `auth.json`, `.netrc`), git shall ignore them.
- **SEC-002**: When Python execution artifacts, virtual environments (`__pycache__/`, `.venv/`, `venv/`, `*.pyc`), or test/profiling outputs (`test-results/`, `playwright-report/`, `*.cpuprofile`) are generated, git shall ignore them.
- **SEC-003**: When local AI assistant configurations, agent scratch files (`.cursor/`, `.cursorrules`, `.windsurf/`, `*.scratch.md`), or local model weights (`*.gguf`, `*.bin`, `*.safetensors`, `models/`) are created, git shall ignore them.
- **SEC-004**: When `.gitignore` is maintained, all comments, section dividers, and annotations shall be written in professional English without non-English prose.

## Acceptance Criteria
1. Automated test `scripts/gitignore.test.mjs` asserts that a representative matrix of sensitive filepaths across SEC-001, SEC-002, and SEC-003 are ignored by `git check-ignore`.
2. Existing essential ignores (`node_modules/`, `dist/`, `.astro/`, `AGENTS.md`, `CLAUDE.md`, `.portfolio-private/`) are retained.
3. All text in `.gitignore` is in English.
4. `npm run check` passes with zero errors.
