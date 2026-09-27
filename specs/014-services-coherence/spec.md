# Services Coherence

Status: Implemented

## Objective

On 2026-09-27 the owner asked to finish aligning the site after specs 012 and
013: the home services section and the service and blog copy must not claim
industrial scale, real-time processing or formats his projects do not support,
and must reflect Python and .NET at the same level.

## Requirements

- COPY-015: When the home page is built, the first service card shall describe
  deterministic multi-domain conformance with 3D (glTF/GLB) as the first
  domain, and shall not mention USD or real-time processing.
- COPY-016: When the home page is built, the critical backend card shall name
  Python and .NET, and PostgreSQL and SQL Server.
- COPY-017: When any source page or content entry is built, it shall not
  contain the phrase "escala industrial".
- COPY-018: When the 3D validation service page is built, it shall not claim
  USD support or real-time conversion.

## Out of scope

- Real-time wording in the logistics and 3D loading service pages, which
  describes the client's problem, not a delivered capability.
- The USD example in a blog post's domain model explanation.

## Session state

- Last updated: 2026-09-27
- Done: see `tasks.md`.
- Next: owner commit and deploy, then production check.
- Blocked: —
