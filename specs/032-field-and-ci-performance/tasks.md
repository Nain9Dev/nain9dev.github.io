# Tasks: Field Web Vitals and Lighthouse CI budget

- [x] **T01** `[A]` Field Web Vitals: `vitals-sampling.js`, `web-vitals-report.js`, lazy load from `app.js`, `web-vitals` 6.2.2 pinned.
  - **Covers**: RUM-001 to RUM-003
  - **Done when**: the RUM tests pass and a forced-sample visit sends one event.
  - **Result**: tests red before, green after. Headless Chrome with `Math.random` forced to 0.1 and plausible.io blocked: the reporter chunk loaded, and two simulated `visibilitychange` to hidden produced exactly one call `Web Vitals` with `interactive: false` and props `lcp: good`, `inp: good`, `cls: good`, `lcp_ms: 250-500`, `inp_ms: 0-50`, `cls_value: 0.00-0.05`, `device: desktop`. Plausible's script sends with `fetch(..., { keepalive: true })`, so events survive page unload. Reporter chunk 8.7 KiB raw, downloaded only on sampled views.
- [x] **T02** `[A]` Performance budget: `scripts/check-budget.mjs`, `scripts/lib/performance-budget.mjs`, `lighthouse` 13.5.0 and `chrome-launcher` 1.2.2 pinned, step in both workflows before the upload.
  - **Covers**: LHCI-001
  - **Done when**: the LHCI test passes and `npm run check:budget` passes locally.
  - **Result**: `@lhci/cli` 0.15.1 was installed first and removed: it added more than fifteen high-severity advisories; `lighthouse` 13.5.0 alone audits clean (the nine advisories that remain predate this spec, in Astro and sharp dependencies). Local budget with gzip: `/` score 0.99, LCP 1,815 ms, 117 KiB; `/en/` 0.99, 1,821 ms; `/servicios/` 1.00, 1,655 ms; TBT 0 and CLS 0 everywhere. `actionlint` clean, `zizmor` no findings; PR job timeout raised from 5 to 15 minutes.
- [ ] **T03** `[A]` Verify the budget step in the next deploy run and the event in production.
- [ ] **T04** `[M]` Register the Plausible custom properties (B-017) in the owner's browser, with confirmation before saving.
