# Tasks: Instant navigation without a client router

- [x] **T01** `[A]` Remove `ClientRouter`, `astro:*` listeners and prefetch attributes; add view transitions and speculation rules; simplify module lifecycles.
  - **Covers**: NAV-001 to NAV-004
  - **Done when**: `scripts/navigation.test.mjs` and the NAV build test pass.
  - **Result**: tests red before, green after. Entry bundle 18.4 KiB → 17.1 KiB and the 16.4 KiB `ClientRouter` chunk is gone from every page. PERF-016 retired (code and tests removed).
- [x] **T02** `[A]` Browser check on the local build.
  - **Result**: home loads the terminal, catalog (19 cards), metrics and privacy banner with no console errors; the page exposes the speculation rules (`HTMLScriptElement.supports('speculationrules')` is true) and a `CSSViewTransitionRule`; navigating to `/servicios/` works and keeps `low-performance`. The app's embedded browser did not prerender on hover (`activationStart` 0), so prerendering is verified in desktop Chrome against production (T03).
- [ ] **T03** `[A]` Verify prerendering and transitions in desktop Chrome against production.
  - **Done when**: a hovered header link opens with `activationStart > 0`.
