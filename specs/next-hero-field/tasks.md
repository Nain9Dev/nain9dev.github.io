# Tasks: The hero's living surface is a 2D stroke field

- [x] **T01** `[A]` Guard `scripts/hero-field.test.mjs` first (red on all six tests): HERO-005 to HERO-009.
- [x] **T02** `[A]` `src/scripts/hero-field.js` with the pure helpers and the lifecycle.
  - **Covers**: HERO-005 to HERO-007
- [x] **T03** `[A]` Wire the canvas (`Hero.astro`), the CSS (`.hero-field`, fade-in, mask, low-performance), the idle loader (`app.js`); remove `hero-scene.js` and its test; move the guards that named the scene (english-standardization, performance-build, post-paint) and the `check` script.
  - **Covers**: HERO-008, HERO-009
- [x] **T04** `[A]` Requirements: HERO-001 to HERO-004 marked Superseded, HERO-005 to HERO-009 added; traceability and changelog updated.
- [x] **T05** `[A]` Browser pass in both themes.
- [ ] **T06** `[A]` Lighthouse budget run (`npm run check:budget`), result recorded below.
- [ ] **T07** `[M]` Pull request. **Needs from owner**: review and merge.

## Measurements

- `npm run check` green. Chunk `hero-field` 4 530 B (limit 8 KiB). Home document 29 058 B gzip (`/en/` 28 441 B) against the 30 720 B tripwire; 29 051 B before, so +7 B.
- Browser (headless Chrome with GPU flags, 1440 x 900): field canvas 1440 x 1032 drawn in both themes (about 81 000 painted pixels), stroke `#80ff00` on dark and `#0047ab` on paper, no console errors, display not hidden, `low-performance` unset. Idle animation frames arrive at the display rate (median 10 ms) because the page stays smooth; the field itself draws one frame in three. After a pointer move and a press the strokes shrink around the pointer and the ripple tints them red. Captures read correctly; the text column and the summary stay clear.

## Session log

- 2026-10-29 · Worktree `D:/wt/nain9dev.github.io-feat-hero-field` from `origin/main` `37b9bea`. Requirement, guard, module, wiring and docs done test first. First capture showed strokes behind the summary text, so the field now starts at 55% of the width. Next: Lighthouse budget, pull request, then the hybrid hero.
