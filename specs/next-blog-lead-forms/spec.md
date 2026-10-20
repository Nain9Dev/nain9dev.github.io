# Blog lead forms that cannot work

Status: In progress

## Objective

Three blog posts embed a lead form that posts to `formsubmit.co`. The site's Content Security Policy sets `form-action 'self'`, so browsers block the submission and visitors get no feedback. One of the forms also promises a PDF that does not exist (`/assets/pdf/clean-architecture-3d.pdf` returns 404) and "the complete source code". Spec 025 already decided that lead capture goes through the checklist page, which asks by email to `contact@naindev.com`.

## Requirements

- LEAD-010: When a blog post offers the checklist, it shall link to `/recursos/checklist-ia` and shall contain no form, no third-party form endpoint and no hidden autoresponse.
- LEAD-011: No blog post shall promise a file or source code that the site does not serve.

## Out of scope

- The unverified claims on the checklist page itself (open owner decision OQ-010).
- The privacy policy wording about processors (spec 025).

## Session state

- Last updated: 2026-10-20
- Done: audit of external URLs found the dead PDF link and the blocked forms.
- Next: test, replace the three call-to-action blocks, English entries, `npm run check`.
- Blocked: —
