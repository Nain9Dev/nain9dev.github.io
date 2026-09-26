# CTO Role Plan

1. Test first: update `ABOUT_ROLE` in `scripts/offer-copy.test.mjs` and assert
   that the About section no longer contains "Lead Software Architect". Observe
   failure.
2. Change the role sentence in `src/components/home/AboutSection.astro`.
3. Run `npm run translations:prepare`, add the reviewed English entry and remove
   the entry no longer referenced.
4. Update the design brief row for the About section, requirements,
   traceability, tasks and changelog.
5. Run the full `npm run check`.
