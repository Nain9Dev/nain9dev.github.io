# Specification: WCAG 2.2 AA accessibility audit

Status: In progress

## Objective

On 2026-10-13 the owner asked for a WCAG 2.2 AA review of the site and fixes for whatever is code. The audit combines axe-core 4.13.0 (rules tagged `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`) on every built page in both languages with manual keyboard, focus and motion checks, since automated tools cover only part of WCAG.

## Functional requirements (EARS)

- **A11Y-001**: When any built page is checked with axe-core for WCAG 2.0–2.2 A and AA rules, at desktop and mobile widths, it shall report no violations.
- **A11Y-002**: When code examples are shown, every token shall have a contrast ratio of at least 4.5:1 against the code background (WCAG 1.4.3).
- **A11Y-003**: When a keyboard user tabs through the home page, every focused control shall show a visible focus indicator (WCAG 2.4.7) that is not hidden behind the sticky header (WCAG 2.4.11), and the skip link shall move focus to the main content.
- **A11Y-004**: While the visitor prefers reduced motion, the site shall not animate reveals, the hero scene, the availability pulse or page transitions (WCAG 2.3.3).

## Edge cases and error handling

- Third-party embeds (Calendly opens in a new tab) are out of the page and not audited.

## Out of scope

- Content rewrites beyond what a criterion requires.

## Acceptance criteria

- The audit report in `tasks.md` lists zero violations after the fixes, and the manual checks are recorded with their outcome.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: first pass on 10 key pages at desktop and mobile widths: only `color-contrast` on code comments of `/blog/clean-architecture-3d/` (11 nodes, `#6a737d` on `#24292e`, 3.04:1).
- Next: full sweep of every page, then fixes.
- Blocked: —
