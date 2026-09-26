# Conformance Chassis Copy Plan

1. Test first: add COPY-007, COPY-008 and COPY-009 tests to
   `scripts/offer-copy.test.mjs`. Observe failure.
2. Rewrite the collaboration sentence in `src/components/home/AboutSection.astro`
   and the `story` command in `public/assets/data/terminal-commands.json`.
3. Run `npm run translations:prepare`, write reviewed English text through
   `edits.json`, accept the snapshot with `npm run translations:review` and drop
   the catalog entries no longer referenced.
4. Update the design brief row for the About section, requirements,
   traceability, tasks and changelog.
5. Run the full `npm run check`.
