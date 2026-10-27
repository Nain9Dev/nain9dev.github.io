# Tasks: Architecture diagrams for the private projects in production

- [ ] **T01** `[A]` Guard `scripts/private-diagrams.test.mjs` written first and registered in `npm run check`; it fails on `main`.
  - **Covers**: PD-008 (asserting PD-001 to PD-004, PD-006)
  - **Done when**: the file exists, is in `package.json` `check`, and fails for the expected reasons before T02 to T04.
- [ ] **T02** `[A]` Shared diagram stylesheet: rules out of `work.css` into `src/styles/diagram.css` (`.arch-diagram`), imported by `site.css`; `Architecture.astro` renamed class; WK-004 assertion repointed.
  - **Covers**: PD-006
  - **Done when**: `scripts/case-pages.test.mjs` passes, the work pages render their diagrams unchanged, the home gzip size is recorded below.
- [ ] **T03** `[A]` Three diagrams (`public/assets/diagrams/<id>.svg`) and their Mermaid sources; `diagram` field on the three entries; `check-claims` scope.
  - **Covers**: PD-001, PD-002, PD-003
  - **Done when**: the guard passes PD-001 to PD-003 and `check:claims` passes.
- [ ] **T04** `[A]` Client: `assetUrl` in `locale.js`, figure and fetch-on-open in `project-view.js`, two interface keys with reviewed English; localization pipeline (`sync-translations`, `build-locales`, `check-locales`) covers the SVG files.
  - **Covers**: PD-004, PD-005
  - **Done when**: `npm run check` passes including `check:locales`; `dist/en/assets/diagrams/*.svg` exist in English.
- [ ] **T05** `[M]` Browser pass and pull request: both themes, both locales, 1440 and 390 px, axe with the rows open, network check, work page unchanged; PR with the evidence.
  - **Covers**: PD-007, PD-009
  - **Needs from owner**: approval of the three diagrams and merge.
  - **Done when**: the PR carries the evidence and the owner has merged.

## Measurements

- Home document: 28 217 B gzip (`/en/` 27 609 B) against the 30 720 B tripwire; 28 140 B before this change, so the shared diagram rules cost 77 B.
- Diagram files: three SVGs of 720x320 units, seven boxes each (six solid, one dashed); widest label 185 of 200 units in Spanish (`SQLAlchemy · versión por entidad`) and 182 in English (`isolated Shadow DOM · ultralight`), measured in the browser after shortening two labels.
- English catalog: 48 new reviewed segments (three titles, three descriptions, the labels and the interface key); `build-locales` reports 0 pending; `dist/en/assets/diagrams/` holds the three English files.
- Network: no request to `/assets/diagrams/` on load; three requests (200) after opening the three disclosures; `aria-busy` cleared once each SVG is inlined.
- Phone (375 px): the figure is 343 px wide and scrolls sideways (SVG at 640 px, labels 15.3 px), the page stays at 375 px. First build overflowed the row because the disclosure, a grid item, widened to the SVG; fixed with `min-width: 0` on `.project-row .project-detail`.
- axe-core 4.13, WCAG 2.0 to 2.2 A/AA, dark and paper, with the three disclosures open: 0 violations on `/`, `/en/`, `/trabajo/parametricad-ai/` and `/en/work/nain3d-conformance-gateway/` at 1440 and 390 px.
- Work pages: the `.arch-diagram` figure renders with the token fill, 14 px labels and the 40rem floor, as before the move.

## Guard changes

- `scripts/private-diagrams.test.mjs` (new): PD-001 to PD-006.
- `scripts/case-pages.test.mjs` WK-004: the token-class assertion reads `src/styles/diagram.css` (`.arch-diagram`) instead of `work.css`.
- `scripts/check-claims.mjs`: `public/assets/diagrams` and `.svg` added to the source scan.
- `scripts/check-locales.mjs`: every `public/assets/diagrams/*.svg` has a translated copy under `dist/en/assets/diagrams/`.
- `scripts/sync-translations.mjs` and `scripts/build-locales.mjs`: the SVG files are collected and localized; a missing directory is tolerated so the localization fixture test is unchanged.

## Session log

- 2026-10-27 · Worktree `D:/wt/nain9dev.github.io-feat-private-diagrams` on `feat/private-diagrams` from `origin/main` `8229ff6`; spec, plan, tasks and ADR written; claim registered in `D:/wt/CLAIMS.md`.
- 2026-10-27 · T01 to T04 done test first (guard red: 6 of 6 before the pieces, then green); browser pass in both themes, both locales and on a phone; axe clean; `npm run check` run before the pull request. Next: T05 (owner approval of the three diagrams and merge).
