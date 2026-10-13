# Specification: CI workflow hardening

Status: Done

## Objective

On 2026-10-13 `zizmor` reported 13 findings on `.github/workflows/`: every action referenced by a mutable tag, `pages: write` and `id-token: write` granted to the whole deploy workflow (including the job that runs `npm ci` and the build), and `actions/checkout` persisting the token in the workspace. The deploy job also fell back to `npm install`, which ignores the lockfile. The owner asked to harden the workflows in a separate spec.

## Functional requirements (EARS)

- **CI-001**: When a workflow references an action, it shall pin a full 40-character commit SHA followed by a comment with the released version.
- **CI-002**: When a workflow runs, it shall grant only `contents: read` at workflow level; `pages: write` and `id-token: write` shall be granted only to the job that deploys to GitHub Pages.
- **CI-003**: When a workflow checks out the repository, it shall not persist credentials (`persist-credentials: false`).
- **CI-004**: When a workflow installs dependencies, it shall use `npm ci` only, so a lockfile mismatch fails the run.

## Edge cases and error handling

- Pinned SHAs do not update themselves; updating an action means resolving the new tag to its commit and editing the comment in the same change.

## Out of scope

- Running `zizmor` or `actionlint` inside CI (would add a CI dependency and needs an ADR).
- Removing the duplicated `npm run check` between `static-site-check.yml` and `deploy.yml` on pushes to `main`.
- Upgrading action major versions.

## Acceptance criteria

- `scripts/workflows.test.mjs` fails before the change and passes after it, inside `npm run check`.
- `zizmor .github/` reports no findings and `actionlint` passes.
- The next push to `main` deploys successfully with the hardened workflow.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01, T02.
- Next: none.
- Blocked: —
