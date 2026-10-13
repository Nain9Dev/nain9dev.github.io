# Tasks: Remove placeholder MailerLite forms

- [x] **T01** `[A]` Remove both forms, the MailerLite loader, the checklist form script and the CSP allowances; turn the checklist call to action into a mailto link.
  - **Covers**: LEAD-001 to LEAD-003
  - **Done when**: `scripts/lead-forms.test.mjs` and the LEAD-003 build test pass.
  - **Result**: tests red before, green after. The English build initially dropped the `email_off` markers when the link was the only content of a translated `div`; the link now sits in its own `p`. Four new Spanish strings were translated through `edits.json` and accepted with `review-translations.mjs --accept` (snapshot 78a3fa01…).
- [x] **T02** `[A]` Verify in production after deploy.
  - **Done when**: production pages have no MailerLite request and the checklist pages have no `email-decode.min.js`.
  - **Result**: 2026-10-13, deploy run 38421309273 for ae7dee0 succeeded; Spanish and English checklist pages and the home page contain no form, no MailerLite reference and no decoder script, and keep the `mailto:` link.
