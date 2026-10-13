# Specification: Inline styles

Status: In progress

## Objective

Every page waits for one render-blocking stylesheet (`/_astro/BaseLayout.*.css`, 34 KiB raw, about 8 KiB compressed); Lighthouse estimated 155–307 ms of render blocking on mobile. On 2026-10-13 the owner chose to inline the styles in each page, accepting that each HTML document grows by the compressed CSS size and that the CSS is no longer cached across pages.

## Functional requirements (EARS)

- **CSS-001**: When a page is built, its styles shall be inlined in the document head and the page shall link no external stylesheet.
- **CSS-002**: When the home page is served, its compressed HTML shall stay at or below 25 KiB.

## Edge cases and error handling

- Font URLs inside the inlined CSS stay absolute (`/_astro/…`), so fonts keep their long-term cache.

## Out of scope

- Splitting critical and non-critical CSS (would need a new build dependency and an ADR).

## Acceptance criteria

- The CSS-001 and CSS-002 build tests fail before the change and pass after it.
- Local Lighthouse mobile shows no render-blocking stylesheet.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01, T02.
- Next: T03 after deploy.
- Blocked: —
