# Tasks: Inline styles

- [x] **T01** `[A]` Enable `build.inlineStylesheets: 'always'` and guard it with build tests.
  - **Covers**: CSS-001, CSS-002
  - **Done when**: the CSS-001 and CSS-002 tests pass.
  - **Result**: CSS-001 red before, green after (CSS-002 already held). Home page HTML 9.4 → 17.4 KiB compressed; no `/_astro/*.css` is published.
- [x] **T02** `[A]` Measure locally.
  - **Result**: Lighthouse 13 on `astro preview`, median of three, with specs 028 to 031 applied: mobile 100 (FCP 1.07 s, LCP 1.51 s, TBT 0 ms, 117 KiB, 15 requests), CPU ×6 100 (LCP 1.66 s). No render-blocking resource reported. Before specs 028 to 031: 167 KiB and 20 requests.
- [x] **T03** `[A]` Measure production after deploy (together with spec 032).
  - **Result**: Production 2026-10-13 after deploy of a6239a3 (Lighthouse 13, median of three): mobile score 98, FCP 1.28 s, LCP 2.14 s, Speed Index 2.80 s, TBT 0 ms, 122 KiB, 14 requests; CPU x6 score 98, LCP 2.00 s, TBT 0 ms. Morning baseline before spec 020: mobile 76, LCP 4.5 s, Speed Index 5.0 s, 469 KiB, 43 requests. Production HTML links no stylesheet.
