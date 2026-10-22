# Tasks: Visual polish and motion system

One task at a time, test first. Stop after each task. Update the `Session state` block in `spec.md` after closing each one. Every PR waits for the owner's explicit approval before merge.

## Phase 1 · Direction

- [x] **T00a** `[A]` Baseline captures and diagnosis.
  - **Covers**: spec "Baseline", "Diagnosis"
  - **Done when**: captures of every page type at 1440 px and 390 px exist in `.astro/visual-polish/before/` and the ten diagnosis points cite files.
  - **Closed**: 2026-10-21, including the English home after the translation fix (OQ-016).
- [x] **T00b** `[H]` Choose the visual direction (A, B or C) and answer OQ-013 to OQ-015.
  - **Covers**: direction choice; VP-010 (OQ-014), VP-015 (OQ-015)
  - **Done when**: the choice is written in this file and in `spec.md` "Session state".
  - **Resolved**: 2026-10-21, direction B chosen by the owner (OQ-013 closed by the choice). OQ-014 and OQ-015 still open.
- [ ] **T00c** `[A]` Write `docs/30-decisions/ADR-0012-visual-direction-*.md` in state `Proposed` for the chosen direction, the font swap and the retired effects; add the new requirements to `docs/10-requirements.md` and the test mapping to `docs/50-traceability.md`.
  - **Covers**: VP-014
  - **Done when**: the ADR exists and `docs/README.md` conventions are met.
  - **Progress**: ADR-0012 written 2026-10-21 (`Proposed`); requirements and traceability rows pending until PR 1 defines the tests.

## Phase 2 · Pull requests

- [ ] **T01** `[M]` PR 1 · Design tokens (`visual/01-tokens`): tokens block, literals removed, font swap, fallback metrics, guard tests updated.
  - **Covers**: VP-001, VP-002, VP-011, VP-015
  - **Done when**: `scripts/visual-tokens.test.mjs` and `npm run check` pass; home gzip ≤ 25 KiB; content diff empty; Lighthouse and captures in the PR.
  - **Status 2026-10-22**: PR #13 open. Verified: `npm run check`, budget (perf 1.00, CLS 0), desktop perf 1.00, axe 0 violations on 11 page types at 1440 and 390 px. Merged `origin/main` (#11, #12) into the branch and tokenized the colours it brought. Waiting for owner approval.
- [ ] **T02** `[M]` PR 2 · Hero and navigation (`visual/02-hero-nav`): compose sequence, phone disclosure menu, scroll progress, pointer-lit grid, scene fade-in, particles retired.
  - **Covers**: VP-005, VP-009, VP-006 (hero)
  - **Done when**: `scripts/hero-nav.test.mjs` passes; keyboard pass captured; reduced-motion probe clean on `/`.
  - **Status 2026-10-22**: implemented and verified: `npm run check` pass; budget pass (perf 0.98–1.00, CLS 0 after moving the menu fold to first paint via `html.motion-ready`); axe 0 violations; reduced-motion probe clean on 5 pages; menu opens, closes with Escape and returns focus; offer tiles compact on phones (detail line clipped, kept in HTML). Dead `comparison`/`mock-*` CSS removed (home 24.4 KiB gzip). Header shrink dropped: changing the sticky header height shifts the page (CLS). Remaining Lighthouse a11y items are pre-existing and scheduled: footer `h4` (PR 4) and small card links (PR 3).
  - **Needs from owner**: PR approval.
- [ ] **T03** `[M]` PR 3 · Cards and skills (`visual/03-cards`): card system, stagger without inline styles, tilt and dead code retired, focus states.
  - **Covers**: VP-004, VP-007, VP-008
  - **Done when**: `scripts/card-system.test.mjs` passes; axe clean at both widths; Lighthouse mobile ≥ 0.95 on `/`.
  - **Status 2026-10-22**: PR #15 open. Verified: `npm run check`, budget (perf 1.00, CLS 0), axe 0 violations, reduced-motion probe clean. Lighthouse `target-size` on phones comes from card controls covered by the fixed privacy notice (they measure 42 px / 24 px); scheduled for PR 5.
  - **Needs from owner**: PR approval.
- [ ] **T04** `[M]` PR 4 · Page transitions and footer (`visual/04-transitions-footer`).
  - **Covers**: VP-006 (transitions), VP-010
  - **Done when**: NAV-002 guard intact; transition keyframes scoped to `no-preference`; footer restyled without content change (OQ-014: no new channels).
  - **Status 2026-10-22**: implemented and verified: `npm run check` pass; budget pass (perf 1.00, TBT 0, CLS 0; a first run on a contended host showed TBT 114–170 ms with no JavaScript change, it cleared after stopping extra preview servers, as ADR-0011 describes); axe 0 violations; reduced-motion probe clean; Lighthouse desktop accessibility 1.00 on `/`, `/en/`, `/servicios/` after the footer `h4` became an `h2` (same text).
  - **Needs from owner**: PR approval.
- [ ] **T05** `[M]` PR 5 · Polish (`visual/05-polish`): 404, thank-you and checklist pages, terminal reduced-motion, icon and social image review.
  - **Covers**: VP-006 (terminal), VP-013, VP-016
  - **Done when**: full axe sweep, Lighthouse mobile and desktop on the three budget pages, final before/after set shown to the owner.
  - **Status 2026-10-22**: implemented and verified: terminal writes in one step under reduced motion (A11Y-005 kept); privacy notice is a compact corner card on desktop that steps aside after the first screen or when the footer is visible, and closes the page in the normal flow on phones; phone header logo 2.4 rem. `npm run check` pass; budget pass (perf 1.00, CLS 0); axe 0 violations on 11 page types at both widths; reduced-motion probe clean. The 404, thank-you and checklist pages already use the shared tokens and needed no change; favicon and social image stay (dark, brand-coherent).
  - **Known tool artefact**: Lighthouse mobile reports `target-size` on links inside `content-visibility: auto` sections (PERF-008) that are off screen at audit time; measured sizes are 37 px / 42 px and an axe sweep after a scroll pass reports none. Not changed: removing `content-visibility` would cost rendering time on every phone.
  - **Needs from owner**: PR approval.
- [ ] **T06** `[A]` Consolidate: move VP-001 to VP-016 into `docs/10-requirements.md` with their status, update `docs/90-changelog.md` and `docs/40-tasks.md`.
  - **Covers**: documentation flow
  - **Done when**: the spec status is `Implemented` and the index rows are updated.

## Phase 3 · Visual storytelling (owner request 2026-10-22; scope to be specified after PR 5)

Owner goal: the portfolio explains itself with visuals and as little visible text as possible. Decision: reduce visible text by moving it into progressive disclosure (details, reveal on interaction) while it stays in the HTML, so content, SEO and screen readers are unchanged (VP-010 holds). Rewriting copy is not authorised; it would need its own spec and approval.

- [ ] **T07** `[A]` Write the phase 3 spec (`specs/046-visual-storytelling/`) and ADR `Proposed`: animated SVG architecture diagram in the hero (data → backend → validated AI → frontend), demos as large captures with hover, stack as a layered visual map, method as an illustrated timeline, one dominant contact call to action, hidden-but-present text pattern, performance and CSS budget.
  - **Done when**: spec, plan and tasks exist; the text-disclosure pattern is tested for accessibility (content reachable by keyboard and screen reader, no hover-only information).
- [ ] **T08** `[M]` Implement phase 3 in small PRs after T05, each approved by the owner.
  - **Needs from owner**: copy approval if any wording changes; PR approvals.

## Session log

- 2026-10-22 · PR 1 opened as https://github.com/Nain9Dev/nain9dev.github.io/pull/13 (not merged). Owner asked for a more visual, less textual portfolio; phase 3 added above.

- 2026-10-21 · Phase 1 delivered: spec, plan, tasks, captures. Waiting for T00b.
- 2026-10-21 · T00b: direction B chosen; ADR-0012 written; OQ-013 to OQ-016 closed. Catalog fix committed on `main` (`b3a24c7`). PR 1 started in worktree `D:/wt/nain9dev.github.io-visual-01-tokens` (branch `visual/01-tokens`, claimed in `D:/wt/CLAIMS.md`). Note: branches `feat/portfolio-refresh` (1 commit) and `feat/portfolio-visual-3` (6 commits) are unmerged and touch `main.css`; check with the owner whether they are stale before PR 1 is merged.
- 2026-10-21 · T01 in progress (uncommitted in the worktree). Done: token block in `main.css` (`:root`, aliases for unmigrated names), every colour literal in `main.css`, `terminal.css` and `locales.css` mapped to tokens or `color-mix()`, Outfit replaced by Urbanist (`src/assets/fonts/urbanist-var.woff2`, 24 764 B, `OFL-urbanist.txt`, `Urbanist Fallback` local face with metrics), body vignette instead of three gradients, fluid heading scale, buttons and cards with explicit transitions and solid shadows, green focus ring; guards updated (`fonts.test.mjs`, `performance.test.mjs` PERF-001, `performance-build.test.mjs` marker `--color-bg:#070b16`), new `scripts/visual-tokens.test.mjs` added to `npm run check`. Verified: `npm run build` passes; home gzip 23 541 B (limit 25 600; was 22 732), `/en/` 23 003 B, `/servicios/` 17 348 B; 73 tests pass (visual-tokens, performance, fonts, portfolio-refresh, accessibility, navigation, post-paint, english-standardization, performance-build, home-clarity). Next: full `npm run check`, visual review in the browser (after captures with `~/.claude/tools/naindev-visual/capture-cdp.mjs`), Lighthouse mobile and desktop, axe sweep, content diff, then open the PR for the owner. Blocked: nothing; the session stopped at the usage limit.
