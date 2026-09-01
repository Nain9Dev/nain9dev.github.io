# Brand Favicon Indexing Tasks

- [x] `[A]` Confirm the root cause in source and production.
- [x] `[A]` Add a failing favicon contract test.
- [x] `[A]` Generate and wire the NainDev favicon asset set.
- [ ] `[A]` Validate the full build and production deployment.
- [ ] `[H]` Request home-page indexing in Google Search Console.

## Handoff

- Done: Added the favicon contract test, generated consistent NainDev PNG/ICO assets, updated head metadata, and marked the header logo as a priority image.
- Verified: The test failed before implementation because the 96 by 96 PNG did not exist, then passed after generation. `npm run check` completes with zero errors and zero warnings, the generated HTML contains the intended icon declarations and priority image attributes, and visual inspection confirms both PNG assets use the NainDev mark.
- Next: Publish the verified commit and verify the production deployment.
- Blocked: Nothing.
