# Tasks: Low-end device performance

One task at a time, test first. Update the `Session state` block in `spec.md` after closing each one.

- [x] **T01** `[A]` Collapse font files and `@font-face` rules to one variable file per family.
  - **Covers**: PERF-001, PERF-002
  - **Done when**: the PERF-001 and PERF-002 tests pass.
  - **Result**: `src/assets/fonts/inter-var.woff2` (47 KiB) and `outfit-var.woff2` (32 KiB) replace twelve URLs; both preloads point at hashed files.
- [x] **T02** `[A]` Bundle client scripts through Astro from `src/scripts/`.
  - **Covers**: PERF-003
  - **Done when**: the PERF-003 test passes and existing unit tests import from `src/scripts/`.
  - **Result**: inline module scripts in the checklist and blog pages moved to `src/scripts/checklist-form.js` and `src/scripts/blog-share.js`; Three.js emitted unmodified via `?url`; `manualChunks` removed.
- [x] **T03** `[A]` Bundle `main.css`, `terminal.css` and `locales.css` through Astro.
  - **Covers**: PERF-004
  - **Done when**: the PERF-004 test passes.
- [x] **T04** `[A]` Move the WebGL probe out of the head and show the hero without JavaScript.
  - **Covers**: PERF-005, PERF-006
  - **Done when**: the PERF-005 and PERF-006 tests and `scripts/hardware-acceleration.test.mjs` pass.
- [x] **T05** `[A]` Compositor-only pulse and off-screen rendering skip.
  - **Covers**: PERF-007, PERF-008
  - **Done when**: the PERF-007 and PERF-008 tests pass.
- [x] **T06** `[A]` Serve the header logo at its rendered size.
  - **Covers**: PERF-009
  - **Done when**: the PERF-009 test passes against `dist/`.
  - **Result**: 268 and 536 px WebP variants (5 KiB and 11 KiB) instead of 1600 px (20 KiB).
- [x] **T07** `[A]` Measure the production build locally with Lighthouse and record results here.
  - **Covers**: acceptance criteria
  - **Done when**: mobile score and LCP are recorded and meet the acceptance criteria, or the gap is explained.
  - **Result**: see "Local measurement" below.
- [ ] **T08** `[H]` Create the Cloudflare Cache Rule described in B-016.
  - **Covers**: PERF-010
  - **Done when**: `curl -sI https://www.naindev.com/_astro/<file>` shows `max-age=31536000`.
- [ ] **T09** `[M]` Commit, deploy and re-measure production.
  - **Covers**: all
  - **Done when**: production Lighthouse mobile results are recorded here.
  - **Needs from owner**: approval of ADR-0002 and the commit request.

## Local measurement (2026-10-13)

Lighthouse 13, headless Chrome, `astro preview` on 127.0.0.1 for both builds (before: commit b3308b0 in a scratch worktree; after: working tree). Median of three runs by LCP. The local server adds no network latency or compression, so absolute values differ from production; the comparison is like for like.

| Profile | Build | Score | FCP | LCP | Speed Index | TBT | Weight | Requests |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile (default) | before | 84 | 2513 ms | 3935 ms | 3065 ms | 5 ms | 449 KiB | 42 |
| Mobile (default) | after | 99 | 1147 ms | 1957 ms | 1207 ms | 51 ms | 166 KiB | 18 |
| Low-end (CPU ×6) | before | 84 | 2506 ms | 3926 ms | 3181 ms | 25 ms | 449 KiB | 42 |
| Low-end (CPU ×6) | after | 98 | 1162 ms | 1659 ms | 1257 ms | 154 ms | 166 KiB | 18 |

Acceptance criteria met (score ≥ 90, LCP < 2.5 s). TBT rises because work that used to run before first paint now runs after it, in two tasks of about 75 ms (catalog and terminal initialisation); it stays under the 200 ms "good" threshold. Deferring non-critical initialisation to idle time is a possible follow-up.
