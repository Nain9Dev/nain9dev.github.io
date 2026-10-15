# Organization Structured Data Tasks

- [x] [H] Owner request of 2026-10-15: improve brand search presence; profile URLs supplied (website, GitHub, GitLab).
- [x] [A] Tests SEO-014 to SEO-016 in `scripts/seo-profile.test.mjs` and SEO-017 in `scripts/localization.test.mjs`. Observed failing before the change.
- [x] [A] `Organization` node, person `sameAs` cleanup and publisher references in `src/components/SEO.astro`.
- [x] [A] Localization keeps the organization identity shared (`scripts/lib/localization.mjs`).
- [x] [A] Built-output contract for Organization identity, logo and publisher in `scripts/check-seo.mjs`.
- [x] [A] Local checks (2026-10-15): 17 unit tests pass, build, `check:seo` and `check:locales` pass; Organization verified in `dist/index.html` and `dist/en/index.html`.
- [x] [A] Full `npm run check` (2026-10-15): all stages pass.
- [ ] [H] Commit and deploy.
- [ ] [A] Production check: Organization present in the live JSON-LD (ES and EN).
- [ ] [M] Add the Google Business Profile "Share profile" link to the `Organization` `sameAs` once the listing is verified and public. Owner supplies the link; blocked on Google verification.
- [ ] [H] Validate the live URL in the Rich Results Test or Schema Markup Validator.
