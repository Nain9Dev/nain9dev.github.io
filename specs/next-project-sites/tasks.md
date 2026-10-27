# Tasks: project pages on the portfolio

One task at a time, test first. Update the `Session state` block in `spec.md` after closing each one.

- [x] **T01** `[A]` Capture the five live pages and write the 640x360 and 400x225 WebP variants.
  - **Covers**: PRJ-026, ECO-025
  - **Done when**: every file is under its weight limit.
- [x] **T02** `[A]` Move the captures to `public/assets/images/demos/`, link the pages in the catalog and the tiles, update the guard tests.
  - **Covers**: PRJ-026, ECO-025
  - **Done when**: `scripts/portfolio-refresh.test.mjs` passes with 16 live entries.
- [x] **T03** `[A]` Add the reviewed English entries the new markup needs, then the full `npm run check` and a browser check of the home at desktop and phone widths.
  - **Covers**: acceptance criteria
  - **Done when**: check exits 0 and the five tiles and the card show the new captures.
- [ ] **T04** `[M]` Enforce HTTPS on the five Pages sites once GitHub has issued the certificates.
  - **Covers**: deployment of the pages
  - **Needs from owner**: nothing if the API call succeeds; otherwise tick the option in each repository's Pages settings.
