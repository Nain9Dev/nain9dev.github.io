# Tasks: CI workflow hardening

- [x] **T01** `[A]` Pin actions, scope permissions, disable persisted credentials and drop the `npm install` fallback.
  - **Covers**: CI-001 to CI-004
  - **Done when**: `scripts/workflows.test.mjs` passes, `zizmor .github/` reports no findings and `actionlint` passes.
  - **Result**: tests red before, green after; `zizmor` 13 findings → 0 (3 suppressed by its default persona); `actionlint` clean. Pins resolved on 2026-10-13 with `gh api`: checkout v4.4.0 and v6.1.0, setup-node v4.4.0 and v6.5.0, upload-pages-artifact v3.0.1, deploy-pages v4.0.5.
- [ ] **T02** `[A]` Verify the next deploy with the hardened workflows.
  - **Done when**: both workflow runs on the push succeed.
