# Tasks: Inner pages, visual first

- [ ] **T01** `[M]` PR 9 · Services hub and pages, blog index and article (`visual/09-inner-pages`, stacked on `visual/08-cards-first`).
  - **Covers**: IP-001 to IP-006
  - **Done when**: `scripts/inner-pages.test.mjs` and `npm run check` pass; axe and reduced-motion probe clean; Lighthouse recorded; captures shown.
  - **Needs from owner**: PR approval (after the spec 045 and 046 stack).
- [ ] **T02** `[A]` Consolidate IP-001 to IP-006 into `docs/10-requirements.md` and `docs/50-traceability.md`.

## Session log

- 2026-10-22 · Spec and implementation started.
- 2026-10-22 · Implemented: `ServiceIcon.astro` (7 glyphs, 3 emoji aliases), hub cards and intro, service page header and reading rules, blog covers by CSS counter with the description disclosed, article without inline styles, blog header in one column. `npm run check` pass; captures of the four page types reviewed; axe, reduced-motion probe and Lighthouse recorded in the PR comment.
