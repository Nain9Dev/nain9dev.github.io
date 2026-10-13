# Tasks: Post-paint main-thread work

One task at a time, test first. Tests live in `scripts/post-paint.test.mjs` (sources) and `scripts/performance-build.test.mjs` (built `dist/`).

- [x] **T01** `[A]` Exclude the decorative terminal prompt from Cloudflare email obfuscation.
  - **Covers**: PERF-011
  - **Done when**: the PERF-011 tests pass on sources and on both built home pages.
  - **Result**: `<!--email_off-->` markers around the prompt; the span is `translate="no"` because the English build dropped the markers when it re-wrote the translated segment (caught by the build test).
- [x] **T02** `[A]` Load home-only modules on demand.
  - **Covers**: PERF-012
  - **Done when**: the PERF-012 tests pass.
  - **Result**: entry bundle 27 KiB → 18 KiB; `home-catalog` (4.5 KiB), `impact-metrics` (1.5 KiB) and `three-hero` (4.9 KiB) load only where their section exists; `three-hero` is skipped entirely in low-performance mode.
- [x] **T03** `[A]` Initialise project filters without layout reads.
  - **Covers**: PERF-013
  - **Done when**: the PERF-013 test passes and filtering still works in the browser.
- [x] **T04** `[A]` Remove reveal-motion observers in low-performance mode and the layout-reading fallback timer.
  - **Covers**: PERF-014
  - **Done when**: the PERF-014 tests pass.
- [x] **T05** `[A]` Start decorative effects and the WebGL probe when idle.
  - **Covers**: PERF-015
  - **Done when**: the PERF-015 tests pass.
- [x] **T06** `[A]` Restore the performance mode after client-side navigation.
  - **Covers**: PERF-016
  - **Done when**: the PERF-016 tests pass and the class survives SPA navigation in the browser.
- [x] **T07** `[A]` Measure locally.
  - **Done when**: results are recorded below.
- [ ] **T08** `[M]` Commit, deploy and measure production.
  - **Done when**: production home HTML has no `email-decode.min.js` and Lighthouse results are recorded below.
  - **Needs from owner**: commit and push authorisation.

## Browser verification (2026-10-13, local production build)

Home: catalog renders 19 cards, `.NET / C#` filter shows 8 and back to 19, indicator measured once the toolbar is visible, metrics and terminal initialise; the entry page loads `home-catalog` and `impact-metrics` chunks only on the home page; `three-hero` is not requested in low-performance mode. SPA navigation home → services → home keeps `low-performance` on `<html>` and re-renders the catalog.

## Local measurement (2026-10-13)

Lighthouse 13, `astro preview` on 127.0.0.1, median of three runs by LCP. Spec 020 rows are the "after" rows recorded in `specs/020-low-end-device-performance/tasks.md`.

| Profile | Build | Score | FCP | LCP | Speed Index | TBT | Weight | Requests |
| :--- | :--- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Mobile (default) | spec 020 | 99 | 1147 ms | 1957 ms | 1207 ms | 51 ms | 166 KiB | 18 |
| Mobile (default) | spec 021 | 100 | 1068 ms | 1656 ms | 1068 ms | 0 ms | 167 KiB | 20 |
| Low-end (CPU ×6) | spec 020 | 98 | 1162 ms | 1659 ms | 1257 ms | 154 ms | 166 KiB | 18 |
| Low-end (CPU ×6) | spec 021 | 100 | 1083 ms | 1655 ms | 1127 ms | 0 ms | 167 KiB | 20 |

The local server has no Cloudflare in front, so PERF-011 is verified on the built HTML only until the production measurement.
