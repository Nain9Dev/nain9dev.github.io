# Unify Public Contact Email Tasks

- [x] [H] Owner chooses `contact@naindev.com` as the single public address.
- [x] [A] Specify MAIL-001 to MAIL-004.
- [x] [A] Add `scripts/contact-email.test.mjs` and observe failure on `privacidad.astro` and `checklist-ia.astro`.
- [x] [A] Replace the address in the privacy policy and checklist fallback links.
- [x] [A] Migrate the two reviewed English privacy translations and prune the old entries.
- [x] [A] Update the design brief, spec 004, blockers, requirements, traceability and changelog.
- [x] [A] Run the full `npm run check`.
- [ ] [A] Confirm production privacy page (ES/EN) shows `contact@naindev.com`.
- [ ] [H] Confirm the Cloudflare Email Routing rule for `contact@naindev.com` and send a test message (B-013).

## Handoff

- Done: One public contact address across site and brief.
- Verified: Tests failed before the change and pass after it. Full `npm run check` passes: 20 unit tests, `astro check` 0 errors, SEO contract (130 pages), localization contract (65 pairs), case-study and claim checks.
- Next: Production check after deployment; owner delivery test.
- Blocked: Delivery verification needs the owner's Cloudflare and mailbox access.
