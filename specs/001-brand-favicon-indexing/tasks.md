# Brand Favicon Indexing Tasks

- [x] `[A]` Confirm the root cause in source and production.
- [x] `[A]` Add a failing favicon contract test.
- [x] `[A]` Generate and wire the NainDev favicon asset set.
- [x] `[A]` Validate the full build and production deployment.
- [x] `[H]` Request home-page indexing in Google Search Console.

## Handoff

- Done: Added the favicon contract test, generated consistent NainDev PNG/ICO assets, updated head metadata, marked the header logo as a priority image, published the changes, and requested home-page indexing.
- Verified: `npm run check` completes with zero errors and zero warnings. All three GitHub workflows passed for the two implementation commits. Production HTML declares the new assets and high-priority logo, while downloaded PNG and declared ICO hashes match the repository. Google Search Console's live test reported that the page is available to Google and indexable, then confirmed that the URL was added to the priority crawl queue.
- Next: Allow Google time to recrawl and process the favicon; monitor the search result without resubmitting the URL repeatedly.
- Blocked: Nothing. The conventional `/favicon.ico` may remain in intermediary cache temporarily, but it is no longer declared; the new `/favicon-naindev.ico` and `/favicon-96x96.png` paths are live and verified.
