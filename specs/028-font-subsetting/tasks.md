# Tasks: Font subsetting

- [x] **T01** `[A]` Subset both fonts, align the CSS `unicode-range`, guard sizes and coverage.
  - **Covers**: FONT-001, FONT-002
  - **Done when**: `scripts/fonts.test.mjs` passes and rendering is unchanged.
  - **Result**: Inter 48,256 → 34,596 bytes, Outfit 32,292 → 28,852 bytes (80.5 KB → 63.4 KB). Tests red before (budgets; and `←`/`→` on the blog and privacy pages were outside the old range and fell back to a system font), green after. Canvas comparison of old and new files on a Spanish/English sample at weights 300–800: equal advance widths and 0 differing pixels for both families.
- [ ] **T02** `[A]` Verify in production after deploy.
  - **Done when**: production serves the new hashed font files.
