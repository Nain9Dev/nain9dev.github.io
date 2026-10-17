# Organization Brand Profiles Tasks

- [x] [H] Owner request of 2026-10-17 and profile URLs confirmed in the interview.
- [x] [A] Tests SEO-018 and SEO-019 in `scripts/seo-profile.test.mjs`; SEO-018 observed failing first.
- [x] [A] Add YouTube, Instagram and TikTok to the `Organization` `sameAs` in `src/components/SEO.astro`.
- [x] [A] Update `docs/10-requirements.md`, `docs/50-traceability.md` and `docs/90-changelog.md`.
- [x] [A] Local checks 2026-10-17: build, `check:seo`, `check:locales` pass; the three links are in `dist/index.html` and `dist/en/index.html`. `npm run check` stops at ECO-003 (`public/assets/js/ecosystem-bar.js` is 42 KB, limit 15 KB), a failure unrelated to this spec that comes from the ecosystem bar commits.
- [ ] [H] Approve, commit and deploy (not published until the owner approves).
- [ ] [A] Production check: the three links are in the live JSON-LD (ES and EN).
- [ ] [M] Add the Google Business Profile to `sameAs`. The owner supplied a `g.page/r/.../review` link, which is a review link; the owner must supply the profile or Maps URL ("Share profile" in the Google Business app).
- [ ] [H] Validate the live URL in the Schema Markup Validator.
