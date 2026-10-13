# Specification: Copy email button copies the contact address

Status: Done

## Objective

Found on 2026-10-13 during spec 021: the home "Copiar email" button copies the text of `.contact-email`, which is now the Calendly link labelled "Agendar Videollamada", so visitors get that label instead of the public address `contact@naindev.com` (MAIL-001). The owner asked to fix it in the same session.

## Functional requirements (EARS)

- **MAIL-005**: When a visitor activates "Copiar email", the system shall copy `contact@naindev.com` to the clipboard and announce success with the existing localized message.
- **MAIL-006**: When the home page is served, the address used by the copy button shall not appear as plain text or as a `mailto:` link, so Cloudflare Email Address Obfuscation injects no decoder script (PERF-011).

## Edge cases and error handling

- Clipboard API unavailable or rejected: the existing `copyUnavailable` and `copyError` messages are shown, unchanged.

## Out of scope

- Rewording the copy messages or adding a visible address.

## Acceptance criteria

- `scripts/copy-email.test.mjs` fails before the fix and passes after it, inside `npm run check`.
- The built home page contains the address parts only as data attributes, and no `__cf_email__` markup appears in production after deploy.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01, T02.
- Next: none.
- Blocked: —
