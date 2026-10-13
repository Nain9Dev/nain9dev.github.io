# Tasks: Social preview image weight

- [x] **T01** `[A]` Generate `og-cover-v3.jpg` with sharp (1200×630, mozjpeg quality 84, 4:4:4), update every reference and the declared dimensions, remove the PNG.
  - **Covers**: SOC-001, SOC-002
  - **Done when**: `scripts/social-image.test.mjs` passes and the images look equivalent.
  - **Result**: 1,537,466 bytes → 46,941 bytes; tests red before, green after; side-by-side review shows no visible loss.
- [ ] **T02** `[A]` Verify the published file after deploy.
  - **Done when**: `https://www.naindev.com/assets/images/og-cover-v3.jpg` returns 200 and pages declare it.
