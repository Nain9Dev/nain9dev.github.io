# Invite-only review intake

Status: In progress (code and tests local; nothing is deployed or enabled until the `[H]` blockers B-018 to B-021 are done and the owner approves ADR-0010)

## Objective

Let a person the owner has invited write a recommendation on naindev.com in one minute, without email, and let the owner review what arrives and publish only what is good. The site stays static; a separate minimal backend (a Cloudflare Worker with a key-value store) receives submissions. Only invited people can submit: each invitation is a single-use, expiring link that the owner creates, so the public form cannot be used by anyone who finds the page. Publication stays a deliberate owner action (ADR-0008, `npm run testimonial`).

## Requirements

- REV-001: When the owner creates an invitation, the service shall return a link token once, store only its SHA-256 hash, record the label, the relationship (`client` or `partner`) and an expiry, and mark it unused.
- REV-002: When a submission carries a token that is unknown, expired or already used, the service shall reject it with the same generic answer in every case and store nothing.
- REV-003: When a valid submission arrives, the service shall consume the invitation first, then store the submission as pending with the relationship taken from the invitation (never from the submitter), and answer with a neutral confirmation.
- REV-004: The service shall accept only JSON from the allowed origin, enforce the field limits (name up to 80 characters, role and company up to 120, quote 20 to 1,500, https URLs up to 300), require the consent flag, reject any request whose honeypot field is filled and reject unknown fields.
- REV-005: The service shall limit submissions and invitation checks per client address and answer 429 beyond the limit.
- REV-006: Owner-only routes (create invitation, list pending, delete) shall require a bearer secret compared in constant time and shall answer 404 to everyone else.
- REV-007: Pending submissions shall expire automatically after 60 days and shall be deletable on request; the service shall log no personal data and no tokens.
- REV-008: The CLI shall create invitations (`invite`) and fetch pending submissions as local `pending` entries (`pull`) with the consent evidence generated from the submission (invitation id, date, consent text version), without publishing anything.
- REV-009: When the reviews endpoint is configured at build time, the request page shall show the form for a valid link and an invalid-link message otherwise; when it is not configured, the page shall keep the email flow. The form shall render only text, never submitted HTML.
- REV-010: When the endpoint is configured, the Content Security Policy shall allow connections to that origin only, and the privacy policy shall describe this processing (data, purpose, legal basis consent, retention, deletion, processor) before the feature is enabled.
- REV-011: The repository shall document the setup, secrets, rotation and recovery steps and keep the secrets out of the code.

## Security model (answers "anyone can write whatever they want")

- **Invite-only:** no valid token, no submission. A leaked link works once and expires, so a stranger cannot reuse it.
- **Nothing is published automatically.** Every submission is untrusted text: it is rendered escaped, and it reaches the site only after the owner approves it and a build runs.
- **Layers against abuse:** honeypot, strict schema and size limits, per-address rate limit, optional Cloudflare WAF rate-limit rule, origin check, no credentials in the browser.
- **Data minimisation:** hashed tokens, short retention, delete after processing, no tracker, no cookie.
- **Known limit:** the key-value store is eventually consistent, so two submissions with the same link inside a few milliseconds could both be stored. The impact is one extra pending entry that the owner would see and discard; a Durable Object would close it if it ever matters.

## Edge cases

- The owner can invite a person again if the first link expired.
- A person who loses the link asks for a new one; the old one is not recoverable (only its hash exists).
- If the service is down, the page shows the email fallback message and the site is unaffected.

## Out of scope

- A public form without invitations, a moderation panel UI, video, ratings, automatic publication, emails sent by the service.

## Session state

- Last updated: 2026-10-19
- Done: spec, ADR-0010 (`Proposed`), blockers B-018 to B-021, Worker (`services/reviews`, 11 tests), CLI `invite`/`pull`/`reject` (`scripts/lib/reviews-client.mjs`), request page form behind `PUBLIC_REVIEWS_ENDPOINT` with CSP origin, English text reviewed for the enabled variant, runbook and privacy draft, tests registered in `npm run check`.
- Verified: end to end in the browser with the real handler on a local HTTP server: valid link showed the form and the invitation label, a submission was stored as pending with the relationship from the invitation, the same link was then invalid, no console or CSP errors; both build variants (with and without the endpoint) compile in ES and EN with no missing translation.
- Next: owner completes B-018 to B-021; then T-009 and T-010.
- Blocked: deployment and enabling need B-018 (Cloudflare Worker and KV), B-019 (domain and route), B-020 (admin secret), B-021 (privacy policy approval).
