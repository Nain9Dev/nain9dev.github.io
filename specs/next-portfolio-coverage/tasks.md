# Tasks: portfolio coverage

One task at a time, test first. Update the `Session state` block in `spec.md` after closing each one.

- [x] **T01** `[A]` Capture the three live sites and the five README pages; write the 640x360 and 400x225 WebP variants.
  - **Covers**: ECO-022, PRJ-024, PRJ-025
  - **Done when**: every file is under its weight limit and readable on a contact sheet.
- [x] **T02** `[A]` Catalog data: modernizer demo link, status and capture; nain-mcp-validator README capture.
  - **Covers**: PRJ-024, PRJ-025
  - **Done when**: `scripts/portfolio-refresh.test.mjs` (VIS-003 at 15 live demos, PRJ-024, PRJ-025) and `scripts/profile-coherence.test.mjs` pass.
- [x] **T03** `[A]` Open-ecosystem tiles with captures, site links and the GitHub chip; CSS block updated.
  - **Covers**: ECO-022, ECO-023
  - **Done when**: the new tests pass and the storytelling and card-system guards still pass.
- [x] **T04** `[A]` Suite bar catalog lists the modernizer demo.
  - **Covers**: ECO-024
  - **Done when**: `scripts/ecosystem-bar.test.mjs` passes with the new expected URL.
- [x] **T05** `[A]` Full `npm run check` and browser check of the home at desktop and phone widths.
  - **Covers**: acceptance criteria
  - **Done when**: check exits 0 and the captures are visible in the strip, the cards and the ecosystem section.
- [ ] **T06** `[H]` Decide whether to build a web page for the repositories without one (nain-mcp-validator, engineering-handbook, both templates) and whether to improve the first screen of NainTAI, NainOrder and ParametriCAD.
  - **Covers**: visual review in `spec.md`
  - **Needs from owner**: the decision and the order; each is work in its own repository.
- [ ] **T07** `[A]` Consolidate PRJ-024, PRJ-025 and ECO-022 to ECO-024 into `docs/10-requirements.md`, `docs/50-traceability.md`, `docs/40-tasks.md` and `docs/90-changelog.md` once pull request #23 is merged.
  - **Covers**: documentation flow
  - **Done when**: the four documents carry the rows and the spec status reads Consolidated.
