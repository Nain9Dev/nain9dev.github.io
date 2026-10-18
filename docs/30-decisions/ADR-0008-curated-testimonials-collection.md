# ADR-0008: Curated testimonials in a validated content collection

Status: Proposed
Date: 2026-10-18

## Context

The site has no client testimonials and the design brief (DES-019) forbids them until they are real. The owner wants a scalable way to ask people for an honest recommendation and publish the approved ones, starting with a partner (Contrast3D). The site is static on GitHub Pages, has a strict CSP, no third-party embeds and no backend (spec 025 removed the form services).

## Decision

- Store recommendations in `src/data/testimonials.json`, loaded as an Astro content collection with a Zod schema that makes consent mandatory. Approval is a commit by the owner (`status: "approved"`).
- Render a section only when at least one entry is approved. Label a partner's recommendation as such.
- Collect text by email through a public request page with guided questions and a consent statement; no form service, no tracker.
- Publish no ratings and no `Review` or `AggregateRating` structured data.
- Revisit a tokenised-link service only above about ten recommendations a year.

## Consequences

- A missing consent fails the build, so an unconsented quote cannot ship.
- Approval needs a commit, which is fine at low volume and keeps an audit trail in git history.
- Because the repository is public, an approved quote and the author's name are public forever in history; withdrawing consent removes the entry from the site but not from past commits. The request page says so.
- DES-019 and the "no testimonials" brief rule are superseded for real, consented recommendations only; placeholders stay forbidden.

## Alternatives considered

- **Third-party review platform embed**: strongest verification, but breaks the no-embeds and CSP rules; linking to public sources is allowed instead.
- **Own backend with unique links**: scalable but adds hosting, spam control and GDPR duties for a handful of entries.
- **Publish only five-star scores**: misleading under EU consumer rules and ignored by Google for self-published reviews.
