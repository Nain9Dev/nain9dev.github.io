# Repository Security and File Exclusion Policy

## 1. Purpose
The `nain9dev.github.io` repository is public and serves as the personal and technical engineering portfolio of Aitor Nain Mendoza Vallejo. This policy enforces strict exclusion of sensitive credentials, private client data, internal configurations, and local AI assistant prompts from version control.

## 2. Excluded Categories and Rationale

The `.gitignore` configuration strictly excludes the following categories:

### 2.1. Environment Variables and Credentials
- **Included patterns**: `.env`, `.env.*` (excluding `.env.example`), `secrets.json`, `*.pem`, `*.key`, `*.pfx`, `*.crt`, `*credentials*.json`, `*token*.json`, `auth.json`, `.netrc`.
- **Rationale**: Prevents accidental exposure of API keys, database credentials, and service tokens.

### 2.2. Internal AI Agent Configurations
- **Included patterns**: `AGENTS.md`, `CLAUDE.md`, `.claude/`, `.agents/`, `.continue/`, `.gemini/`, `.cursor/`, `.cursorrules`, `.windsurf/`, `*.scratch.md`.
- **Rationale**: Isolates local developer configurations, agent system prompts, absolute workspace paths, and tool tokens from public source code.

### 2.3. Build Artifacts, Caches, and Dependencies
- **Included patterns**: `node_modules/`, `dist/`, `.astro/`, `*.tsbuildinfo`, `coverage/`, `__pycache__/`, `.venv/`, `venv/`, `*.pyc`, `test-results/`, `playwright-report/`, `*.cpuprofile`.
- **Rationale**: Automated outputs regenerated during local development and CI/CD pipelines (GitHub Actions).

### 2.4. Operating System and IDE Metadata
- **Included patterns**: `.vscode/`, `.idea/`, `.DS_Store`, `Thumbs.db`, `*.swp`.
- **Rationale**: Machine-specific artifacts that cause cross-platform merge collisions.

### 2.5. Binary Models and Strategic Private Notes
- **Included patterns**: `*.gguf`, `*.bin`, `*.safetensors`, `models/`, `docs/private/`.
- **Rationale**: Large binary weights must not bloat the repository, and private strategic drafts must stay local.

## 3. Incident Response for Accidental Disclosure

If sensitive data is committed to the repository:
1. **Do not create a normal deletion commit.** The data persists in Git history.
2. Remove the cached reference if not pushed:
   ```bash
   git rm --cached <path-to-file>
   git commit -m "chore: stop tracking sensitive file"
   ```
3. For pushed commits containing active credentials:
   - Revoke and regenerate all exposed keys immediately at the service provider.
   - Purge history using BFG Repo-Cleaner or git-filter-repo:
     ```bash
     bfg --delete-files .env
     git reflog expire --expire=now --all && git gc --prune=now --aggressive
     git push -f origin main
     ```

## 4. Continuous Auditing
Run local secret scans (e.g. `gitleaks`) before pushing code. All private planning notes must reside under `docs/private/`.
