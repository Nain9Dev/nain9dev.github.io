# Tasks: Intermittent long tasks after first paint

- [x] **T01** `[A]` Diagnose the intermittent TBT seen on GitHub runners.
  - **Result**: per-run long-task logs from deploy run for 8af159a named one task of the entry bundle (210–325 ms simulated at about 1.2–1.36 s). DevTools traces of `/servicios/` under real 6x CPU throttling (headless Chrome, plausible.io blocked) showed a 69 ms task whose 47 ms were `SVGImage::DataChanged` → `IsolatedSVGDocumentHost`: the SVG favicon, the only SVG on that page. Web Vitals sampling was ruled out by an A/B run (sampling forced on and off showed the same tasks).
- [x] **T02** `[A]` Run deferred work one module per idle slot.
  - **Covers**: PERF-017
  - **Result**: `runQueueWhenIdle` in `src/scripts/idle.js`; test red before (missing function), green after.
- [x] **T03** `[A]` Stop declaring the SVG favicon (owner decision 2026-10-13).
  - **Covers**: PERF-018
  - **Result**: test red before, green after; `check-brand-icons` now asserts that no `image/svg+xml` icon is declared; the SVG file stays at its URL. Under 6x throttling, 10 loads of `/servicios/` showed one 52 ms late task (was 3 of 8 before, up to 191 ms).
- [x] **T04** `[A]` Check the home page under the same conditions.
  - **Finding, no change**: each home load at 6x shows one long task of 600–1,200 ms at about 2.5–3 s. Traces attribute it to `AIPageContentAgent::ContentBuilder::Build`, a Chrome-internal page-content extraction that forces layout of the whole document (including `content-visibility` sections); 80–90 % of it is text shaping. A first-layout task at about 1.3 s is also mostly shaping (242 of 342 ms). An A/B of `text-rendering: auto`, `optimizeSpeed` and system fonts did not reduce shaping (1,161 ms baseline vs 1,303–1,436 ms), so the cost is the amount of text, not the fonts. It falls after Lighthouse's TTI, so it does not affect the budget; it is a browser feature outside the site's control.
- [ ] **T05** `[A]` Confirm the next deploy passes the budget.
