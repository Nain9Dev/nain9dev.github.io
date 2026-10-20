# ADR-0010: Invite-only review intake on a Cloudflare Worker

Status: Proposed
Date: 2026-10-19

## Context

ADR-0008 publishes consented recommendations that the owner adds with a CLI; ADR-0009 sketches a full reviews service for when volume grows. Clients are unlikely to write an email, so the owner chose (2026-10-19) a form on naindev.com that sends the text to a separate backend, with the owner deciding what is published. Anyone can open a public page, so the form must not accept submissions from people who were not invited.

## Decision

Build the smallest useful backend as a stage of ADR-0009, in `services/reviews/`, outside the Astro build:

- A Cloudflare Worker (JavaScript, Web APIs only, no runtime dependencies) with a KV namespace. Cloudflare is already in front of the site and used for email routing.
- **Invite-only intake:** the owner creates a single-use, expiring link per person (`npm run testimonial -- invite`). The invitation fixes the relationship (`client` or `partner`). The service stores only the token hash.
- **The site stays static.** Only the request page calls the service, from the browser, and only when `PUBLIC_REVIEWS_ENDPOINT` is set at build time; otherwise the email flow stays. The CSP gains that single origin when enabled.
- **Owner control:** `npm run testimonial -- pull` brings pending submissions into `src/data/testimonials.json` as `pending` entries with generated consent evidence; `approve` and a normal release publish them (ADR-0008). Rejected submissions are deleted from the store.
- **Controls:** honeypot, strict schema and size limits, per-address rate limit plus an optional WAF rule, origin check, constant-time admin secret, 60-day expiry of pending data, no personal data in logs.

## Consequences

- A client needs one click and one minute; the owner reviews in a terminal and publishes with a normal release.
- Adds a small public endpoint to operate and a privacy policy update (name, role, company and text are personal data processed on the basis of consent, with Cloudflare as processor).
- KV is eventually consistent, so a single-use link can in rare races be used twice; the effect is one extra pending entry that the owner sees.
- If volume or abuse grows, the same contract moves to a database-backed service (ADR-0009) without changing the site.
- Part of the stack is proprietary (Cloudflare Workers); the handler is plain Web-standard JavaScript and portable.

## Alternatives considered

- **Open public form** (anyone can submit): simpler for the visitor, but spam and abuse risk and no proof that the author is someone the owner asked.
- **Third-party form builder**: no code, but personal data and trackers leave the owner's control and the site's strict privacy policy.
- **Email or direct message**: zero development, still the best option for a partner such as Contrast3D; kept as the fallback.
- **Full service with PostgreSQL now**: premature for the current volume (ADR-0009).

## Open decisions for the owner

- Subdomain (`reviews.naindev.com` proposed), approval of the privacy policy text before enabling, and whether a WAF rate-limit rule is created in the Cloudflare dashboard.
