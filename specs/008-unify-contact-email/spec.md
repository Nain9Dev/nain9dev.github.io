# Unify Public Contact Email

## Scope

The site publishes three addresses: `contact@naindev.com` (terminal),
`hola@naindev.com` (privacy policy and checklist fallback) and, in the design
brief, `hello@naindev.com`. On 2026-09-16 the owner chose
`contact@naindev.com` as the single public address.

## Requirements

- MAIL-001: When the site is built, every public contact address in either
  locale shall be `contact@naindev.com`.
- MAIL-002: When the privacy policy is built, the data controller contact and
  the data subject rights contact shall be `contact@naindev.com`.
- MAIL-003: When a source page, component, content entry or runtime data file
  contains `hola@naindev.com` or `hello@naindev.com`, `npm run check` shall fail
  and name the file.
- MAIL-004: The design brief shall list `contact@naindev.com` as the public email.

Addresses that are not contact channels (terminal prompt `aitor@naindev.com`,
demo sender `evaluator@naindev.com`) are out of scope.

## External dependencies and owner actions

- [H] Confirm a Cloudflare Email Routing rule forwards `contact@naindev.com` and
  that a test message arrives. MX records point to Cloudflare; the routing rule
  and delivery are not verified.
