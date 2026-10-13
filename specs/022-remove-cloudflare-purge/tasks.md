# Tasks: Remove the Cloudflare cache purge step

- [x] **T01** `[A]` Remove the purge step from `deploy.yml`, guarded by a test.
  - **Covers**: DEP-001
  - **Done when**: `scripts/deploy-workflow.test.mjs` passes and `actionlint`/`zizmor` add no findings.
  - **Result**: test red before the change, green after; `actionlint` clean; `zizmor` 15 → 13 findings, all pre-existing (unpinned actions, broad permissions, `persist-credentials`), out of scope.
- [x] **T02** `[A]` Verify the next production deploy.
  - **Covers**: DEP-002
  - **Done when**: the deploy run passes and production HTML references the new bundle hashes.
  - **Result**: 2026-10-13, deploy run 38388585992 and static checks run 38388585954 for 08ac207 succeeded without a purge step; production HTML references the new entry bundle `BaseLayout.astro_astro_type_script_index_0_lang.qFUkMA2k.js`.
- [x] **T03** `[H]` Delete `CLOUDFLARE_ZONE` and `CLOUDFLARE_API_TOKEN` from GitHub if they exist (optional).
  - **Done when**: `gh secret list` and `gh secret list --env github-pages` show neither name.
  - **Result**: 2026-10-13, both commands return no secrets; nothing to delete.
