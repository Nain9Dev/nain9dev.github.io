# Tasks: Single validation run per push to main

- [x] **T01** `[A]` Remove the `push` trigger from `static-site-check.yml`, guarded by a test.
  - **Covers**: CI-005
  - **Done when**: `scripts/workflows.test.mjs` passes, `actionlint` and `zizmor` stay clean.
  - **Result**: CI-005 red before, green after; `actionlint` clean; `zizmor` no findings.
- [x] **T02** `[A]` Verify the next push to `main`.
  - **Done when**: only the deploy workflow (and GitHub's Pages job) runs for the push.
  - **Result**: 2026-10-13, the push of 29766c9 triggered only "Deploy Astro site to GitHub Pages" and "pages build and deployment".
