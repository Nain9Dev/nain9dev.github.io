# Contrast3D x NainDev partnership section

Status: Draft (spec number assigned at merge)

## Objective

Name the Contrast3D collaboration on the home page as part of the offer (design and 3D visuals from Contrast3D, backend, validation and AI from NainDev), and link both organizations in structured data. The partner (David, Contrast3D) was told and agreed on 2026-10-18 (verbal; no written agreement yet).

## Requirements

- PART-001: When the home page is rendered, it shall include a section with an H2 presenting the Contrast3D x NainDev collaboration, stating the split of roles (Contrast3D: creative direction, CGI and real-time 3D visuals; NainDev: backend, deterministic validation, AI with human review).
- PART-002: When the section is rendered, it shall contain a link to `https://www.contrast3d.com/` with descriptive text, opening in a new tab with `rel="noopener noreferrer"`.
- PART-003: The section and any other public copy shall not claim shared clients, joint projects, client logos or testimonials of Contrast3D.
- PART-004: When any page is rendered, the structured data shall include a Contrast3D `Organization` node (`https://www.contrast3d.com/`) referenced by the `Person` through `affiliation`, and the NainDev `Organization` shall not list it in `sameAs`.
- PART-005: When the footer is rendered, it shall credit the site design to David with the form he chooses (name and link) and may mention Contrast3D. Blocked until David supplies the preferred credit.
- PART-006: Every new Spanish string shall have a reviewed English translation in `src/i18n/en-US.json`, and `npm run check` shall pass, including the claims and performance budget gates.

## Edge cases

- The `Organization` `sameAs` is for the brand's own profiles (spec 040/042); Contrast3D is a different organization, so it is not listed there.
- The employer is never named (confidentiality rule); the section speaks only of Contrast3D.

## Out of scope

- Reciprocal link on contrast3d.com (David's site).
- Written partnership agreement.
- Hero rewrite and dedicated problem pages (separate specs).

## Session state

- Last updated: 2026-10-18
- Done: tests (`scripts/partnership.test.mjs`, registered in `npm run check`), `PartnershipSection.astro` after About, `Person.affiliation` plus Contrast3D node, 7 reviewed English segments; `npm run check` green on 2026-10-18. Not committed.
- Next: owner review and commit; footer credit once David states it (PART-005).
- Blocked: PART-005 needs David's preferred credit (`[H]`).
