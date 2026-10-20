# ADR-0009: A separate reviews service when volume justifies it

Status: Proposed
Date: 2026-10-19

## Context

ADR-0008 publishes recommendations from a validated JSON file approved with a commit. The owner wants a long-term flow: send a personal link to a client, let them write their text, review it in one place and publish it on the site without editing files. The portfolio is an Astro static site on GitHub Pages; the owner wants backend and frontend kept apart and asked whether a database is needed.

## Decision

Keep the site static and add a small **reviews service** as a separate backend only when recommendations pass about ten a year (or the manual flow becomes a burden). Until then, ADR-0008 and `npm run testimonial` stay in force.

- **Contract:** the service publishes the same JSON shape that `src/content.config.ts` already validates (`name`, `role`, `company`, `relationship`, `date`, `quote`, `status`, `consent`). The site does not change: the service only becomes another producer of `src/data/testimonials.json`.
- **Flow:** the owner creates a request in an admin screen, which returns a single-use link with an expiry. The client opens it, writes the text, ticks the consent statement and submits. The service stores it as `pending`. The owner approves or discards it. Approving an entry exports the approved set and triggers the site build (a GitHub Actions `repository_dispatch`), where the build fails on any entry without consent.
- **Database:** yes, once the service exists; PostgreSQL (project default). Tables: `review_request` (token hash, recipient label, expiry, used flag), `review` (the fields above, state, consent text version, timestamps) and an audit log of state changes. SQLite would do for a first release but would not match the stack.
- **Separation:** the browser never calls the service at runtime. Only the build reads the approved export, so the public site keeps its CSP, has no CORS surface, loads no personal data client-side and works if the service is down.
- **Stack and hosting:** FastAPI with Pydantic v2 (or ASP.NET Core if hosted with other .NET services), on the VPS that already serves the `*.naindev.com` services, behind the existing reverse proxy and in the EU.
- **Safeguards:** token hash only in the database, expiry and single use, rate limiting and a honeypot against spam, admin behind authentication, a delete endpoint for withdrawn consent, personal data limited to what is published plus a contact label, and a retention rule for discarded submissions.

## Consequences

- Moves the owner from editing JSON to an admin screen, and gives per-client links with state ("asked", "answered", "approved").
- Adds a service to run, secure and back up, and personal data to protect (GDPR): worth it only above the volume stated above.
- The portfolio keeps its structure, speed and hosting. Because the contract does not change, ADR-0008's schema, section and tests stay valid.
- Withdrawn consent still cannot remove text from past commits of the public repository; the request page keeps saying so.

## Alternatives considered

- **Third-party review service or form builder**: faster, but adds trackers or embeds that the site's CSP and privacy policy forbid, and moves the data outside the owner's control.
- **A database inside the site (server-rendered Astro)**: mixes the presentation layer with persistence and gives up the static, cheap hosting.
- **GitHub issue forms as the intake**: free and auditable, but requires a GitHub account from every client.
- **Staying manual**: still the right choice below the stated volume.

## Open decisions for the owner

- Volume threshold or date to start, hosting (existing VPS or not), stack (Python or .NET), who administers the screen, and the retention period for discarded submissions.
