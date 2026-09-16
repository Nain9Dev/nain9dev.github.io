# Remove Unverified Metrics Tasks

- [x] [H] Owner states no metric can be demonstrated today; remove them and the OSS badge.
- [x] [A] Specify CLM-003 to CLM-006.
- [x] [A] Extend `scripts/claims.test.mjs` and observe failure in `Hero.astro`, `ImpactMetrics.astro`, `recursos/gracias.astro` and `impact-metrics.json`.
- [x] [A] Extend `scripts/check-claims.mjs` patterns and scan runtime data.
- [x] [A] Remove metrics, badges and 13 unused English catalog entries.
- [x] [A] Run the full `npm run check`.
- [ ] [A] Confirm production home page (ES/EN) and thank-you page after deployment.

## Handoff

- Done: Metrics grid and heading removed, checklist CTA kept, `impact-metrics.json`
  emptied so the runtime renderer leaves the static markup, OSS and Zero Downtime
  badges removed, catalog pruned (zero pending segments after sync).
- Verified: Tests failed before the content change. Full `npm run check` passes:
  18 unit tests, `astro check` with 0 errors, both locale builds, brand icons,
  SEO contract (142 pages), localization contract (71 pairs) and claim scan.
  A first site-wide "Zero Downtime" pattern matched a legitimate blog post in
  `dist/`, so it was replaced by a page-level test.
- Next: Production check after deployment.
- Blocked: Nothing. Service and blog availability wording is tracked as OQ-008.
