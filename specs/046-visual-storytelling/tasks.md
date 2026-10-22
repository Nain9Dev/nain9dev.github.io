# Tasks: Visual storytelling

One task at a time, test first. Every PR waits for the owner's explicit approval before merge.

- [ ] **T01** `[M]` PR 6 · Quiet text, hero map, demo gallery (`visual/06-storytelling`, stacked on `visual/05-polish`).
  - **Covers**: VS-001, VS-002, VS-003, VS-006, VS-007, VS-009
  - **Done when**: `scripts/storytelling.test.mjs` and `npm run check` pass; axe clean; reduced-motion probe clean; Lighthouse recorded; captures shown.
  - **New accessible names** (the only new strings): `Más detalle` → `More detail` (summary `aria-label`).
  - **Needs from owner**: ADR-0013 (budget) and PR approval.
- [ ] **T02** `[M]` PR 7 · Stack map and method timeline (`visual/07-stack-method`).
  - **Covers**: VS-004, VS-005
  - **Done when**: guards pass; same audits.
  - **Status 2026-10-22**: implemented (CSS only, no markup change): stack as layer bands joined by a spine on wide screens; method on a horizontal rail drawn by a CSS scroll timeline. Verified: `npm run check` pass; axe 0 violations; reduced-motion probe clean; captures of the stack, method and contact sections reviewed.
  - **Needs from owner**: PR approval.
- [ ] **T03** `[A]` Consolidate VS-001 to VS-009 into `docs/10-requirements.md` and `docs/50-traceability.md`; changelog entry.

## Session log

- 2026-10-22 · Spec, plan and tasks written; PR 6 implementation started.
- 2026-10-22 · PR 6 implemented: `Quiet.astro` around 11 paragraphs (services, stack, projects, ecosystem, partnership, terminal, method intro and call to action, about, contact, resource); hero map rail with a travelling pulse (transform only, off under reduced motion and low-performance); demo gallery with the 14 captures; `.project-index` at full muted ink (Lighthouse contrast on `/en/`). ADR-0013 (Proposed) raises CSS-002 to 30 KiB: the home measures 25.9 KiB gzip. Verified: `npm run check` pass; axe 0 violations at 1440 and 390 px; reduced-motion probe clean; Lighthouse desktop performance 1.00 and accessibility 1.00 on `/`, `/en/`, `/servicios/`; details open and close with mouse and keyboard, summaries focusable with the accessible name "Más detalle". The 14 demo-tile segments and the new label are in the English catalog.
