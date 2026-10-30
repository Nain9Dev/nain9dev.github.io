# ADR-next: Home document tripwire from 30 KiB to 32 KiB

Status: Proposed (awaiting owner approval)
Date: 2026-10-30

## Context

ADR-0013 (Approved, 2026-10-22) set the gzip size of the home documents (`/`, `/en/`) at 30 KiB (30 720 B) as a tripwire, and said the Lighthouse gate of spec 032 is the user-facing limit: "the gate, not the byte count". It also says growth beyond 30 KiB needs an amendment to that ADR, not a test edit. This is that amendment, proposed because the design fusion (`specs/next-design-fusion`) has used almost all of the headroom.

Measured on `main` on 2026-10-30, with every layer merged (hero band, top bar, footer in columns, products band, featured projects, header motions):

| | Value | Limit |
| :--- | :--- | :--- |
| `/` document, gzip | 29 801 B | 30 720 B (919 B left) |
| `/en/` document, gzip | 29 206 B | 30 720 B |
| Lighthouse performance (`/`, 3 pages x 5 runs, CPU slowdown 7.2x) | 0.99 | at least 0.95 |
| LCP | 1 805 ms | at most 2 500 ms |
| TBT | 28 ms | at most 200 ms |
| CLS | 0 | at most 0.1 |
| Total transfer of `/` | 193 008 B | at most 256 000 B |

The gate passes with a wide margin on every metric, while the tripwire is at 97% of its limit. Each of the last layers cost between 180 B and 680 B, so the next one or two layers would stop the build for a reason the user cannot feel.

Earlier relief already taken: the page-specific CSS left `main.css` (ADR-0017, 28 140 B at that point) and the home now lists six projects instead of twenty-two (a drop of 1 293 B). What is left to cut without changing content is small: the static catalog index must stay for the no-JavaScript fallback (CSS-001 and the indexable project list).

## Decision

- Raise the home document tripwire (CSS-002) from 30 720 B to **32 768 B** (32 KiB) gzip. Nothing else of ADR-0013 changes: CSS-001 stays (no stylesheet request), the Lighthouse gate stays as the user-facing limit, and every pull request still records the measured size.
- Keep the rule that growth beyond the new tripwire needs an amendment to an ADR, not a test edit.
- Revisit the number when the home passes 31 KiB or when Lighthouse performance falls under 0.97 on the quiet host, whichever comes first.

## Consequences

- About 2 KiB more room: enough for the designer's `.flow` micro-diagrams on the service cards (about 1 KiB) and one more small layer.
- `scripts/performance-build.test.mjs` asserts the new ceiling and cites this ADR; requirement CSS-002 changes its number. Both happen when the owner approves, in the same pull request.
- The extra 2 KiB is under 20 ms on a 3G profile; the measured LCP has 695 ms of margin.

## Alternatives considered

- **Keep 30 720 B and trade bytes**: each new element would have to remove another one of the same size; the cheap candidates are already taken.
- **Deferred stylesheet for below-the-fold sections**: reintroduces the request that CSS-001 removed (render-blocking risk on slow networks).
- **Drop the static catalog index**: saves about 1 KiB but breaks the no-JavaScript fallback and the indexable list of featured projects.
- **Remove the tripwire**: the user-facing limit is the Lighthouse gate, but the byte count still catches unnoticed growth between Lighthouse runs; keeping it with a higher number loses nothing.
