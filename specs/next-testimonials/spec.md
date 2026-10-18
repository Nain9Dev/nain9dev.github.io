# Curated testimonials with consent

Status: In progress (owner authorized implementation on 2026-10-18; ADR-0008 stays `Proposed` until the owner approves it)

## Objective

Let real people recommend NainDev and show only honest, consented recommendations on the home page, without a backend and without third-party scripts. Phase 0 is a request page and a written process; phase 1 is a validated content collection and a section that renders nothing until a recommendation is approved. A recommendation from a partner (Contrast3D) is labelled as such: there are no shared clients or joint projects, and a partner is not an independent client.

## Requirements

- TEST-001: When a recommendation is stored, it shall carry the author's name, role, company, date, relationship (`client` or `partner`), the quote and a consent record (granted, date, evidence). An entry without granted consent shall fail the build.
- TEST-002: When no recommendation has status `approved`, the home page shall render no testimonials section and no heading.
- TEST-003: When a recommendation is approved, the section shall show its quote, author, role and company, with a link to the company when given and a link to the public source when given.
- TEST-004: When the relationship is `partner`, the card shall state that it is a partner's recommendation, not a client's review.
- TEST-005: The site shall not publish star ratings, aggregate ratings, `Review` or `AggregateRating` structured data for itself, or claims such as "all clients are satisfied".
- TEST-006: The request page `/recursos/recomendacion/` shall be `noindex`, excluded from the sitemap, contain no form and no third-party resource, list four guided questions, state that an honest opinion is wanted (not a favourable one), state how the text and the consent will be used and how to withdraw it, and offer the copy-email button.
- TEST-007: The repository shall contain no placeholder recommendation, no recommendation without consent and no figures that are not in the author's own words.
- TEST-008: Every new Spanish string shall have a reviewed English translation.

## Process rules (also in `docs/06-runbook/testimonials.md`)

- Ask for an honest opinion with guided questions; never script the wording. Only typo fixes are allowed, agreed with the author.
- Do not selectively solicit reviews on third-party platforms (Google's policy). Public sources are linked, not filtered.
- A negative or unusable response is handled privately and is not published.
- Written consent (email is enough) is stored as `evidence`; the author can withdraw it, and the entry is removed in the next release.

## Edge cases

- An empty collection is valid and is the initial state; nothing changes visibly in production.
- `docs/11-open-questions.md` OQ-011: the checklist page still shows an unverified testimonial and an "80 %" claim; it is out of scope here and needs the owner's decision.

## Out of scope

- A backend or tokenised link service (phase 2, only above about ten recommendations a year).
- Reading platform APIs (Google, LinkedIn); photos or logos of authors.

## Session state

- Last updated: 2026-10-18
- Done: spec, ADR-0008 (`Proposed`), tests (`scripts/testimonials.test.mjs`, registered in `npm run check`), collection with mandatory consent, section that renders only approved entries, request page `/recursos/recomendacion/` (ES and EN, noindex, not in sitemap), runbook, 17 reviewed English strings. `npm run check` green. Verified: a temporary approved entry rendered the section and the partner label with no rating markup; an entry without consent failed the build (`consent: Required`); both temporary entries were removed, the collection is `[]`. Not committed.
- Next: owner approves or rejects ADR-0008, sends the request link to David, adds the first entry after his written confirmation.
- Blocked: first real recommendation (`[H]`: the author writes it and gives consent).
