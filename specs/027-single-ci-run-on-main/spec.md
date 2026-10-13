# Specification: Single validation run per push to main

Status: Done

## Objective

Every push to `main` runs `npm run check` twice: once in `static-site-check.yml` and again in the build job of `deploy.yml`, which already blocks the deploy when it fails. On 2026-10-13 the owner asked to remove the duplicate. No ruleset or branch protection requires the `Validate portfolio structure` status (checked with `gh api` the same day).

## Functional requirements (EARS)

- **CI-005**: When a commit is pushed to `main`, `npm run check` shall run once, inside the deploy workflow; `static-site-check.yml` shall run only for pull requests.

## Edge cases and error handling

- A failing check on `main` still stops the deploy, because the build job runs `npm run check` before uploading the artifact.

## Out of scope

- Branch protection or required status checks.

## Acceptance criteria

- `scripts/workflows.test.mjs` covers CI-005, fails before the change and passes after it.
- The next push to `main` triggers only the deploy workflow (plus GitHub's own Pages job).

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01, T02.
- Next: none.
- Blocked: —
