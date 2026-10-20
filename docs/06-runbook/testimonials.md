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

## Withdraw

If the person withdraws consent, remove the entry, run `npm run check` and publish. Past commits keep the text; the request page says so.

## What never ships

Star ratings, averages, `Review` or `AggregateRating` markup, "all clients are satisfied" claims, placeholder entries and entries without consent (enforced by `scripts/testimonials.test.mjs`).
