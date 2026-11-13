# Testimonials runbook

How to ask for, approve and publish a recommendation. Decision: [ADR-0008](../30-decisions/ADR-0008-curated-testimonials-collection.md) (`Proposed`). Spec: `specs/next-testimonials`.

For clients who will not write an email, the invite-only form sends the text to a separate service: see [review-intake.md](review-intake.md) (not deployed yet).

## Ask

1. Send the person the request page: `https://www.naindev.com/recursos/recomendacion/` (also `/en/resources/recomendacion/`). It lists four guided questions, states that an honest opinion is wanted and explains consent and withdrawal. It is `noindex` and not in the sitemap.
2. Suggested message (Spanish, outside the repository):

   > Hola, ¿te animas a contarme cómo ha sido trabajar conmigo? No busco una reseña favorable, sino tu opinión honesta. Son cuatro preguntas y puedes responder con tus palabras: https://www.naindev.com/recursos/recomendacion/

3. Do not suggest wording, do not offer anything in exchange (an incentive must be disclosed under EU consumer rules) and do not ask only satisfied people on third-party platforms such as Google (selective solicitation breaks their policy). Linking a public review the person already wrote is fine.

## Approve

1. The person answers by email. Keep that email as the consent evidence.
2. Reply asking for written confirmation to publish the text, name, role and company, and mention that the repository is public.
3. Unusable or negative answers are handled privately and are not published.
4. Write the entry to a file outside the repository (for example in a scratchpad) only after the confirmation arrives:

   ```json
   {
     "id": "contrast3d-partner-2026",
     "name": "Full name",
     "role": "Role",
     "company": "Company",
     "companyUrl": "https://example.com/",
     "relationship": "partner",
     "sourceUrl": "https://public-source.example/",
     "date": "2026-10-20",
     "quote": "The author's own words. Typo fixes only, agreed with the author.",
     "consent": { "granted": true, "date": "2026-10-20", "evidence": "Email of 2026-10-20 confirming publication" }
   }
   ```

   - Use `relationship: "partner"` for Contrast3D: the card then says it is a partner's recommendation, not a client's. There are no shared clients or joint projects.
   - Never invent or paraphrase a quote, and never add figures that the author did not write.
5. Store it with the CLI, which validates it (consent, dates, https links, duplicates) and always saves it as `pending`:

   ```sh
   npm run testimonial -- add <entry.json>
   npm run testimonial -- list
   ```

6. Publish it with an explicit second step, then translate and check. The build also fails if `consent` is missing or not `granted: true`:

   ```sh
   npm run testimonial -- approve <id>
   npm run translations:prepare
   ```

   Review the English text of the quote and the author's role in `src/i18n/en-US.json` (`status: "reviewed"`), then run `npm run check`. A missing translation stops the release.
7. Commit with `feat(testimonials): add <author> recommendation` and push.

Until the first entry exists, every build logs `The collection "testimonials" does not exist or is empty`. It is expected and harmless: the section renders nothing.

## Collaborators

The section that holds the recommendations opens with the brands NainDev works with (spec `specs/next-collaborators-bar`, decision `ADR-next-collaborators-bar`). The bar shows each brand by its logo and nothing else: no description of the work, no label. The same rule applies as for recommendations: nothing is published about a company without its recorded authorization, and the section renders nothing while no entry is approved.

1. Ask the company in writing (email or message) whether its name, its logo and a link to its site may appear on `www.naindev.com`, and mention that the repository is public and keeps history. Keep the answer outside the repository. If a contract with that company or with a partner restricts public references, the consent it requires comes first.
2. Save its logo as `public/assets/images/collaborators/<id>.svg` (or `.webp`, `.png`): resized if needed, never recoloured, at most 20 kB. Without a file the plate shows the name as text.
3. Add the entry to `src/data/collaborators.json`:

   ```json
   {
     "id": "company-id",
     "name": "Company",
     "url": "https://company.example/",
     "logo": { "src": "/assets/images/collaborators/company-id.svg", "width": 240, "height": 80 },
     "order": 10,
     "status": "approved",
     "authorization": { "granted": true, "date": "2026-11-20", "evidence": "Message of 2026-11-20 authorizing name, logo and link" }
   }
   ```

   - `url` is optional: a brand without a public site is shown without a link.
   - `logo.width` and `logo.height` are the file's own pixel size (the guard compares them). Add `"withName": true` when the logo is an isotype with no wordmark, so the name is written next to it.
   - `order` sorts the bar (lower first, then by name).
4. Run `npm run check`. Brand names are not translated, so a new entry needs no English text.
5. Commit with `feat(collaborators): add <company>` and open the pull request.

From three brands on, the list moves sideways as a strip. It stops under the pointer, has a visible pause control, and turns back into a plain list for keyboard users, with a reduced-motion preference and in low-performance mode. One loop takes at least 30 seconds and eight seconds per brand beyond that (`src/utils/collaborators.ts`).

To link a public profile where anyone can read or leave an opinion about NainDev (a business listing, for example), add `{ "id": "listing", "name": "Listing name", "url": "https://..." }` to `src/data/review-sources.json`. The section then ends with a line that links it. The profile is linked, never embedded, and no score is copied to the site.

## Withdraw

If the person withdraws consent, remove the entry, run `npm run check` and publish. Past commits keep the text; the request page says so. The same applies to a company in the bar: remove its entry and its logo file.

## What never ships

Star ratings, averages, `Review` or `AggregateRating` markup, "all clients are satisfied" claims, placeholder entries and entries without consent (enforced by `scripts/testimonials.test.mjs`).
