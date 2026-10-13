# Specification: Post-paint main-thread work

Status: Done

## Objective

After spec 020, production Lighthouse mobile scored 91 but kept TBT at 181 ms (377 ms with CPU ×6) and Speed Index at 4.5 s. A trace of production on 2026-10-13 showed the causes:

1. Cloudflare Email Address Obfuscation rewrites the decorative terminal prompt `[aitor@naindev.com ~]$` into a protected link and injects a parser-blocking `email-decode.min.js` in the middle of `<body>`. Its evaluation forced an 80 ms layout during parsing (desktop CPU) and Lighthouse estimated 607 ms of render blocking.
2. The project filter initialisation runs `applyFilter("all")`, which reads `offsetLeft`, `offsetWidth` and `offsetHeight` after a 150 ms timer: a 33 ms forced layout of about 900 objects.
3. The reveal-motion safety timer calls `getBoundingClientRect()` on every reveal element after 2 s, forcing layouts inside sections that `content-visibility` was skipping, even in low-performance mode where CSS already shows every element.
4. The single entry bundle evaluates every module on every page, including the catalog, metrics and 3D loaders, and the decorative effects run the WebGL probe synchronously at start-up.

## Functional requirements (EARS)

- **PERF-011**: When the home page is served through Cloudflare, decorative text that looks like an email address shall be excluded from email obfuscation, so no obfuscation script is injected into the page.
- **PERF-012**: When a page loads, home-only modules (project catalog, filters, catalog view, impact metrics, 3D hero) shall not be part of the entry bundle; they shall be loaded on demand only on pages that contain their section.
- **PERF-013**: When the project filters initialise, they shall not read layout; the active-filter indicator shall be measured only when the user interacts or the toolbar becomes visible.
- **PERF-014**: While the document is in low-performance mode, reveal motion shall mark elements visible without observers or timers; in other modes it shall not force layout through a timer fallback.
- **PERF-015**: When the page has painted, decorative effects and the WebGL capability probe shall start only when the browser is idle.
- **PERF-016**: When the client router swaps to another page, the performance mode decided on first load shall be restored on the new document before it renders. (Found during verification: Astro's router copies the new document's `<html>` attributes, which dropped `low-performance` after every SPA navigation.)

## Edge cases and error handling

- If `requestIdleCallback` is unavailable, deferred work starts after a short timeout.
- If a dynamic import fails (offline after first load), the catalog shows its existing localized error state.
- Spanish and English pages share the same bundles; the locale build does not rewrite script URLs.

## Out of scope

- The "Copiar email" button copies the Calendly button label instead of an address (pre-existing defect, separate task).
- Disabling Cloudflare Email Address Obfuscation zone-wide.
- Visual redesign of decorative layers.

## Acceptance criteria

- `npm run check` passes with tests for PERF-011 to PERF-015.
- Local Lighthouse mobile (median of three) shows TBT not higher than spec 020 and no forced layout from the entry bundle.
- After deploy, production home HTML has no `email-decode.min.js` and Lighthouse mobile scores at least 95.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01 to T08; PERF-011 to PERF-016 implemented, `npm run check` passes, browser and Lighthouse results in `tasks.md`.
- Next: confirm the remaining first-frame delay with field data before any further change (see `tasks.md`).
- Blocked: —
