# Unify Public Contact Email Plan

1. Add `scripts/contact-email.test.mjs`: scans `src/components`, `src/pages`,
   `src/content` (excluding git-ignored `marketing/`) and `public/assets/data`
   for `hola@naindev.com` and `hello@naindev.com`, and asserts the privacy page
   names `contact@naindev.com`. Observe failure.
2. Replace the address in `src/pages/privacidad.astro` (two places) and
   `src/pages/recursos/checklist-ia.astro` (two `mailto:` links).
3. Update `design/README.md`, spec 004 and `docs/41-blockers.md` B-013.
4. Run `npm run translations:prepare`, add reviewed English entries for the
   changed privacy segments by replacing only the address in the existing
   reviewed translations, and remove unused entries.
5. Wire the test into `npm run check`, run it, commit, push, verify production.
