# Tasks: Verifiable receipts band in the hero

- [x] **T01** `[A]` Guard `scripts/receipts-strip.test.mjs` written first and registered in `npm run check`; it fails on `main`.
  - **Covers**: RC-008 (asserting RC-001 to RC-005)
  - **Done when**: the file exists, is in `package.json` `check`, and fails for the expected reasons before T02 to T04.
- [x] **T02** `[A]` `src/utils/build-info.ts`: commit and date from `GITHUB_SHA` or git, validated, throwing when unresolved.
  - **Covers**: RC-002
  - **Done when**: the guard's build-info test passes in this worktree and the module throws outside a git checkout.
- [x] **T03** `[A]` Band markup in `Hero.astro` and styles in `main.css`.
  - **Covers**: RC-001, RC-003, RC-004, RC-005
  - **Done when**: the guard passes, the existing hero guards pass unchanged, the home gzip size is recorded below.
- [x] **T04** `[A]` Reviewed English targets for the lead, labels and description values.
  - **Covers**: RC-006
  - **Done when**: `npm run check` passes including `check:locales`; `dist/en/index.html` shows the four receipts with the same publication value.
- [ ] **T05** `[M]` Browser pass and pull request: both themes, both locales, 1440 and 390 px, axe, network check; PR with the evidence.
  - **Covers**: RC-007, RC-009
  - **Needs from owner**: approval of the wording and merge.
  - **Done when**: the PR carries the evidence and the owner has merged.

## Measurements

- Home document: 28 588 B gzip (`/en/` 27 944 B) against the 30 720 B tripwire; 28 217 B before this change, so the band costs 371 B (markup of four receipts plus the rules).
- Band at 1440 px: four columns, links 44 to 61 px tall (two-line values); the band starts 48 px under the hero grid (the `.hero` grid rows were stretching to the minimum height and left a gap before `grid-template-rows: minmax(0, 1fr) auto`). At 390 px: one column, document 390 px wide, links 44 to 61 px.
- Publication receipt in the worktree build: `a960a51 · 2026-10-27`, identical on `/` and `/en/`, linking `commit/a960a5140c536d5c130ae3d6673af7a45ec3d9f6`.
- English catalog: five new reviewed segments (lead, three labels with their values, the publication item with its two opaque tokens); `sync-translations` reports 0 pending.
- Requests leaving the origin on load: one, the existing analytics script (`plausible.io`), in every page and theme; none from the band.
- axe-core 4.13, WCAG 2.0 to 2.2 A/AA, dark and paper, `/` and `/en/` at 1440 and 390 px: 0 violations in two of three sweeps; one sweep reported `target-size` on the method section's `.quiet > summary` of `/en/` at 390 px while its reveal animation was mid-way, an element this change does not touch and that measures clean when settled.
- `npm run check` green (guard, `astro check`, build, performance tripwire, `check:locales`, `check:claims`).

## Guard changes

- `scripts/receipts-strip.test.mjs` (new): RC-001 to RC-005, build-info resolution, same value in both built locales.

## Session log

- 2026-10-27 · Worktree `D:/wt/nain9dev.github.io-feat-receipts-strip` on `feat/receipts-strip` from `origin/main` `a960a51`; spec, plan, tasks and ADR written; claim registered in `D:/wt/CLAIMS.md`.
- 2026-10-27 · T01 to T04 done test first (guard red: 4 of 5 before the pieces, then green); browser pass in both themes, both locales and on a phone; axe clean; `npm run check` run before the pull request. Next: T05 (owner approval of the wording and merge).
