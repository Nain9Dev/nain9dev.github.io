# Tasks: search and AI discovery

All tasks are [A] unless marked. Test first, then code.

- [ ] T-001 [A] Unit tests for `buildLlmsTxt` and `buildSitemap` (DISC-001, DISC-003, DISC-004). Done when they fail for the right reason.
- [ ] T-002 [A] Implement `src/utils/llms.ts`, `src/pages/llms.txt.ts`, `scripts/lib/sitemap.mjs` and wire the sitemap. Done when T-001 passes and `dist/llms.txt` exists.
- [ ] T-003 [A] Build-level checks in `check-seo.mjs` (DISC-002, DISC-005, DISC-006, DISC-007). Done when they fail on the old build output.
- [ ] T-004 [A] `robots.txt` crawler groups and `Person` entity fields (DISC-005, DISC-006). Done when `npm run check:seo` is green.
- [ ] T-005 [A] PR, merge, deploy; verify live files and that AI user agents are not blocked at the edge.
- [ ] T-006 [M] Submit the sitemap to Bing Webmaster Tools and request indexing of `llms.txt`-listed pages in Search Console.
