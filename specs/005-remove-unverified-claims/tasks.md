# Remove Unverified Claims Tasks

- [x] [H] Owner confirms the "+50M" figure is not verified and must not be used.
- [x] [A] Specify requirements CLM-001 and CLM-002.
- [x] [A] Add `scripts/claims.test.mjs` and observe it fail on `Hero.astro` and `recursos/gracias.astro`.
- [x] [A] Add `scripts/check-claims.mjs` and wire `check:claims` into `npm run check`.
- [x] [A] Remove both badges and their two English catalog entries.
- [x] [A] Run the full `npm run check`.
- [ ] [A] Confirm the production home page and thank-you page no longer show the claim after deployment.

## Handoff

- Done: Claim removed from Spanish and English sources, catalog pruned, guard
  added to the release checks.
- Verified: Source scan failed before the change and passes after it. Full
  `npm run check` passes: localization, claim and SEO tests, `astro check`, both
  locale builds, brand icons, SEO contract (142 pages), localization contract
  (71 language pairs) and the claim scan over `dist/`.
- Next: Check production after the GitHub Pages deployment finishes.
- Blocked: Nothing. Other unverified claims are listed as open questions in
  `docs/11-open-questions.md`.
