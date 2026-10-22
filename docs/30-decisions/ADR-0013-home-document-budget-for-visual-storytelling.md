# ADR-0013: Home document budget of 30 KiB for visual storytelling

Status: Approved (owner, 2026-10-22)
Date: 2026-10-22

## Context

Spec 031 inlines every stylesheet into each page (CSS-001) and caps the gzip size of the home document at 25 KiB (CSS-002) so first paint never waits for a stylesheet request. The cap was set when the inline CSS weighed about 10 KiB in a 22 KiB document.

Spec 045 (ADR-0012) rewrote the styles onto design tokens and kept the document at 24.4 KiB by removing dead rules. Spec 046 (visual storytelling, owner request of 2026-10-22) adds what the budget cannot absorb: a capture on each of the fourteen demo tiles, a disclosure element around every explanatory paragraph, a pipeline treatment for the hero map, a layered stack and a scroll-driven method timeline. The first pull request alone lands at 25.7 KiB.

Alternatives measured on 2026-10-22: moving page-specific rules (blog, checklist, thank-you, technology and service pages) out of `main.css` saves about 1.2 KiB on the home; removing the static catalog index would save more but breaks the no-JavaScript fallback and the indexable project list; splitting critical and deferred CSS would reintroduce a stylesheet request, which CSS-001 exists to prevent.

## Decision

- Raise CSS-002 from 25 KiB to 30 KiB gzip for the home documents (`/`, `/en/`), keeping CSS-001 (no stylesheet request) and the Lighthouse gate of spec 032 (performance ≥ 0.95, LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1, total transfer ≤ 250 KiB) unchanged. The gate, not the byte count, is the user-facing limit; the byte count stays as a tripwire against unnoticed growth.
- Every pull request of spec 046 records the measured document size; growth beyond 30 KiB needs an amendment to this ADR, not a test edit.
- The page-specific CSS move stays a follow-up: it helps every page and is worth doing, but it does not change this decision.

## Consequences

- Up to 5 KiB more HTML on the home, under 100 ms on a 3G profile; Lighthouse mobile measured 1.00 performance and 0 CLS at 25.7 KiB on 2026-10-22.
- `scripts/performance-build.test.mjs` asserts the new ceiling and cites this ADR.
- The owner can reject the storytelling work by leaving this ADR unapproved; the budget then returns to 25 KiB with the previous build.

## Alternatives considered

- **Keep 25 KiB and cut content**: contradicts the owner's rule of no copy changes and the no-JavaScript fallback.
- **Deferred stylesheet**: reintroduces the request that CSS-001 removed; render-blocking risk on slow networks.
- **Raise to 35 KiB or remove the cap**: no need shown; the tripwire loses its purpose.
