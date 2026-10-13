# ADR-0003: Native view transitions and speculative prerendering instead of a client router

Status: Proposed
Date: 2026-10-13

## Context

Every page loads Astro's `ClientRouter` (16 KiB of JavaScript) to animate navigations. It turns the site into a single-page application: scripts run once and must re-initialise on `astro:*` events, which caused defects in specs 020 and 021 (the router copied `<html>` attributes and dropped the performance mode, PERF-016) and keeps cleanup code in every module. Browsers now provide the same effect natively: cross-document View Transitions (`@view-transition { navigation: auto; }`, Chrome and Edge 126+, Safari 18.2+) and the Speculation Rules API, which prerenders a likely next page so the navigation is instant (Chromium browsers). The owner chose this direction on 2026-10-13 and asked to keep transitions where the browser supports them.

## Decision

- Remove `ClientRouter` and every `astro:*` lifecycle listener; each page is a normal document and its scripts initialise once on load.
- Enable cross-document View Transitions in CSS, only under `prefers-reduced-motion: no-preference`, with the site header kept in place.
- Add a Speculation Rules block that prerenders same-origin page links with `moderate` eagerness (hover or pointer down), excluding links that leave the page type (`mailto:`, files, `target=_blank`) and links marked `data-no-prerender`.
- Analytics stay correct: Plausible waits for the page to become visible before sending a pageview, so prerendered pages that are never shown are not counted, and it counts back/forward cache restores.

## Consequences

- 16 KiB less JavaScript on every page and no SPA lifecycle code; back/forward navigations can use the browser's back/forward cache.
- Chromium users get instant navigations; Safari users get the transition without prerender; Firefox users get normal navigations. No browser loses functionality.
- Prerendering spends some bandwidth on pages that a hovering visitor does not open; `moderate` eagerness limits it to deliberate hovers.
- `data-astro-prefetch` attributes become inert and are removed.

## Alternatives considered

- **Keep `ClientRouter`**: keeps the JavaScript weight and the re-initialisation defects.
- **Astro `prefetch` with `experimental.clientPrerender`**: also uses speculation rules, but adds a script and an experimental flag for what one inline JSON block does.
- **Prefetch only (no prerender)**: avoids running page scripts early, but navigations still pay layout and script time.
