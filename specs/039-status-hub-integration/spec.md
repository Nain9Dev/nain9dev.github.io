# Spec 039: Status Hub Integration

## Context
The NainDev ecosystem maintains a public, automated observability portal at `https://status.naindev.com/` which deterministically checks availability and response times for all 17 portfolio demo applications and core services every 30 minutes.

To establish professional confidence and transparent engineering governance, `naindev.com` must feature an accessible, static status link and indicator in its global footer.

## Functional Requirements
- **STAT-001**: Global footer on `nain9dev.github.io` must include a secure link to `https://status.naindev.com/`.
- **STAT-002**: The status element must feature an operational indicator dot (`#22c55e` / green) and clear label ("Sistemas Operativos").
- **STAT-003**: The link must open with `target="_blank"` and strict security attributes (`rel="noopener noreferrer"`).
- **STAT-004**: Fully compliant with WCAG 2.2 AA (accessible color contrast, semantic anchor text, screen reader friendly).
- **STAT-005**: Zero performance impact (100% static HTML/CSS, zero blocking scripts or client-side fetch requests during initial page render).

## Non-Functional Requirements
- Maintain Lighthouse 100 performance and accessibility scores.
- Zero billable infrastructure cost (0.00 €).
