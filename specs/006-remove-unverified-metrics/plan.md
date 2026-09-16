# Remove Unverified Metrics Plan

1. Extend `BLOCKED_CLAIMS` in `scripts/check-claims.mjs` with phrase-level
   patterns in Spanish and English. Patterns target the published claim
   wording, not the generic terms, so service descriptions are not matched.
   "Zero Downtime" is not blocked site-wide because a blog post uses it as a
   design goal in bold; the thank-you page badge has a page-level test instead.
2. Extend the scan to `public/assets/data/*.json`, which the home page renders
   at runtime.
3. Add test cases in `scripts/claims.test.mjs` for each pattern, a negative case
   for service wording, a data scan, and a CTA presence check. Observe failure.
4. Apply the content changes listed in `spec.md`.
5. Run `npm run translations:prepare` and remove catalog entries not referenced
   by any source segment (baseline before the change: zero unused entries).
6. Run `npm run check`, commit, push, verify production.

The `ImpactMetricsManager` renders only when the data list is not empty, so an
empty `impact-metrics.json` leaves the server-rendered CTA untouched.
