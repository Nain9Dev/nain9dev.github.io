# Tasks: Clients and collaborators bar

One task at a time, test first. Update the `Session state` block in `spec.md` after closing each one.

- [x] **T01** `[A]` Guard `scripts/collaborators.test.mjs`, registered in `npm run check`.
  - **Covers**: CLB-011
  - **Done when**: the guard fails for the missing pieces (9 of 9 red on 2026-11-13) and passes after T02 to T04.
- [x] **T02** `[A]` Collections `collaborators` and `reviewSources` with their data files; rules module `src/utils/collaborators.ts`.
  - **Covers**: CLB-001, CLB-003, CLB-006, CLB-008
  - **Done when**: the schema and unit tests of the guard pass; an entry without authorization fails the build.
- [x] **T03** `[A]` `CollaboratorsBar.astro`, the `--color-plate` token and the section in `Testimonials.astro` (bar, recommendations, sources line).
  - **Covers**: CLB-002, CLB-003, CLB-004, CLB-005, CLB-006, CLB-007, CLB-012
  - **Done when**: the guard passes, the existing testimonials, home-order and token guards pass unchanged, and the empty build renders no section.
- [x] **T04** `[A]` Runbook section, ADR (`Proposed`), blockers B-027 and B-028, open question OQ-019.
  - **Covers**: CLB-011
  - **Done when**: the guard's documentation test passes.
- [x] **T05** `[A]` Owner's revision of 2026-11-13: brands only (no caption), optional link, logo with the name for an isotype, moving strip with a pause control.
  - **Covers**: CLB-001, CLB-003, CLB-004, CLB-009, CLB-012
  - **Done when**: the rewritten guard is red for the new behaviour (6 of 11) and green after the change; the browser pass below is recorded.
- [x] **T06** `[M]` First entries: three brands on the owner's confirmation of 2026-11-13, their logo files and the three English strings of the bar.
  - **Covers**: CLB-003, CLB-008, CLB-010
  - **Done when**: `npm run check` passes in both locales with the entries.
  - **Owner's part**: the companies' own answers stay with the owner (B-027).
- [ ] **T07** `[M]` Pull request.
  - **Needs from owner**: approval of the wording (eyebrow, H2, pause control) and of the ADR; merge.
  - **Done when**: the pull request carries the measurements below and the owner has merged. The owner saw the captures in the session and gave the go-ahead to open it on 2026-11-13.
- [ ] **T08** `[A]` Consolidation after the merge: CLB-001 to CLB-012 into `docs/10-requirements.md` and `docs/50-traceability.md`, the two collections into `docs/21-data-model.md`, changelog entry, numbers for the spec and the ADR, the brief's "no client logos" line in `design/README.md`.

## Measurements

Taken on 2026-11-13 in this worktree, with the three committed entries.

- Home document: 27 994 B gzip (`/en/` 27 456 B) against the 30 720 B tripwire; 27 196 B before this change. The bar costs about 0.8 kB: the rules, the list drawn twice and the pause control.
- After merging `main` at `5d26ecd` (installable site, #93) into the branch: 28 108 B (`/en/` 27 568 B), and `npm run check` exit 0 on the merged tree. The only conflict was the `check` line of `package.json`; both guards are registered.
- Logo files: 16 772 B, 1 940 B and 5 360 B, lazy loaded from this origin; the guard checks the 20 kB limit and that the declared size is the file's own.
- `npm run check` exit 0 (guards, `astro check`, bilingual build, size tripwire, `check:locales` with 0 pending, `check:case-studies`, `check:claims`).
- Strip at 1440 px: each of the two groups is 1 248 px wide, plates 208 by 88 px, one loop in 30 s (42 px/s measured), edges faded by the mask. Under the pointer the play state is `paused` and the strip does not move; leaving it resumes. The pause control toggles `paused` and `running`; its target is 174 by 44 px.
- Keyboard: Tab from the pause control reaches the first brand link; while it has focus the strip is the plain list (no animation, copy hidden, nothing clipped), the link is inside the viewport with its outline, and two more Tab presses leave the strip (the copy's links are never focused). The strip moves again afterwards and was never scrolled (`scrollLeft` 0).
- Low-performance mode (class set by the site's own detection): static list, copy hidden, pause control hidden. The emulated phone of this session falls into that mode by itself and shows two columns at 375 px; with the class removed the strip moves there too (group 505 px, plates 158 px). The document stays 375 px wide in both cases.
- Reduced motion was not emulated in the browser; it takes the same CSS path as low-performance mode (the moving rules sit inside `prefers-reduced-motion: no-preference`), which the guard asserts.
- Both themes: the plate computes to white in both; in the light theme the page is `rgb(237, 241, 246)` and the plate border the strong line token.
- English home: eyebrow "Clients and collaborators", H2 "We work with these brands", control "Pause the motion"; brand names untouched.
- Console: no error. Requests leaving the origin on load: none from the section.
- An automated axe pass was not run in this session; the accessibility checks above were made by hand.

## First version, replaced the same day

A static list with a caption under each logo ("Cliente" or "Socio" and one line of the work done), 27 421 B with no entry and 27 915 B with four temporary entries. Replaced by T05 at the owner's request; kept here only so the measurements of the two versions are not mixed up.

## Guard changes

- `scripts/collaborators.test.mjs` (new): CLB-001 to CLB-009, CLB-011 and CLB-012.
- `scripts/testimonials.test.mjs`: unchanged and green; the section keeps the literals it asserts.

## Session log

- 2026-11-13 · Worktree `D:/wt/nain9dev.github.io-feat-collaborators-bar` on `feat/collaborators-bar` from `origin/main` `2ee1595`; claim registered in `D:/wt/CLAIMS.md`. Spec, plan and tasks written; guard red (9 of 9), then T02 to T04 green. Browser pass of the first version with temporary local entries (preview entry `wt-collab-preview`, port 4330, in the untracked `.claude/launch.json` of the main checkout).
- 2026-11-13 · Owner's revision (T05, T06): guard rewritten and red (6 of 11), then the schema, the rules module, the component and the entries. Found in the browser and fixed: the pointer did not stop the strip because the `animation` shorthand of the more specific rule reset the play state, so the pause rules now repeat that rule's gate; the pause label filled its grid cell and is now sized to its content. `npm run check` exit 0. Next: T07.
