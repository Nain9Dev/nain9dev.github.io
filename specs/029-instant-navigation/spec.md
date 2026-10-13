# Specification: Instant navigation without a client router

Status: In progress

## Objective

Replace Astro's `ClientRouter` with native cross-document View Transitions and Speculation Rules prerendering (ADR-0003, Proposed), so navigations are instant in Chromium browsers, animated where supported, and no page ships router JavaScript or SPA lifecycle code. Decided by the owner on 2026-10-13.

## Functional requirements (EARS)

- **NAV-001**: When any page is built, it shall load no client router script and its scripts shall not depend on `astro:*` lifecycle events.
- **NAV-002**: While the visitor has no reduced-motion preference, same-origin navigations shall use a cross-document view transition, keeping the site header in place.
- **NAV-003**: When a visitor hovers or presses a same-origin page link, the browser shall be allowed to prerender that page (Speculation Rules, `moderate` eagerness); `mailto:`, file downloads, `target="_blank"` and `data-no-prerender` links shall be excluded.
- **NAV-004**: When a page initialises its scripts, it shall do so once per document load; features that used router events (terminal, privacy banner, contact tracking, catalog) shall keep working.

## Edge cases and error handling

- Browsers without View Transitions or Speculation Rules navigate normally.
- A prerendered page runs its scripts before it is shown; Plausible defers the pageview until the page is visible.
- PERF-016 (restoring the performance mode after a router swap) becomes unnecessary: every navigation runs the head script again. Its requirement is retired by this spec.

## Out of scope

- Changing which pages exist or their content.

## Acceptance criteria

- `scripts/navigation.test.mjs` fails before the change and passes after it, inside `npm run check`.
- In the browser: home, services, blog and checklist work after navigating between them; the terminal, catalog, filters, copy button and privacy banner work; no console errors.
- Lighthouse mobile shows no regression and the entry JavaScript shrinks by the router size.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01, T02.
- Next: T03 after deploy.
- Blocked: —
