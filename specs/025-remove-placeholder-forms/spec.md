# Specification: Remove placeholder MailerLite forms

Status: In progress

## Objective

Both MailerLite forms post to placeholder identifiers (`xxx`, B-007): the footer newsletter silently loses every subscription, and the checklist page fakes success (`fetch` with `mode: 'no-cors'` to a placeholder URL, then "¡Enviado!"). On 2026-10-13 the owner chose to remove the footer newsletter and to make the checklist page ask for the checklist by email to `contact@naindev.com`, an address the owner confirmed receives mail (B-013).

## Functional requirements (EARS)

- **LEAD-001**: When any page is rendered, it shall contain no MailerLite form, script or placeholder endpoint, and the Content Security Policy shall not allow MailerLite hosts.
- **LEAD-002**: When a visitor wants the checklist, the checklist page shall offer a `mailto:contact@naindev.com` link with a prefilled subject as its only call to action, and shall not claim that anything was sent.
- **LEAD-003**: When the checklist page is served through Cloudflare, the email link shall be excluded from email obfuscation, so no decoder script is injected (as PERF-011).

## Edge cases and error handling

- Visitors without a mail client can still read and copy the address shown in the link text.

## Out of scope (open owner decisions, recorded in `docs/11-open-questions.md`)

- The checklist page claims "+200 Arquitectos" in the replaced form box (removed with the form) and keeps an unverified testimonial and an "hasta un 80%" figure outside it.
- The privacy policy still names MailerLite and lead-magnet forms as data processing.
- `/recursos/gracias/` stays published but unlinked and excluded from the sitemap.

## Acceptance criteria

- `scripts/lead-forms.test.mjs` fails before the change and passes after it, inside `npm run check`.
- Built Spanish and English checklist pages keep the `email_off` markers around the link.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: —
- Next: T01
- Blocked: —
