# Specification: Ecosystem Suite Navigation Bar

Status: Implemented

## Objective

Provide a standalone, zero-dependency, ultra-lightweight Web Component (`<nain-ecosystem-bar>`) that can be embedded into any public application or demo across `*.naindev.com` to deliver a cohesive, unified platform experience with one-click cross-navigation, brand presence, and health visibility.

## Functional requirements (EARS)

- **ECO-001**: When `<nain-ecosystem-bar>` is mounted, the component shall attach a Shadow DOM with closed encapsulation to isolate all layout and styles from the host application.
- **ECO-002**: When rendered, the bar shall display the canonical NainDev brand link (`https://www.naindev.com/`), the current project label when specified via attribute, a categorized quick-navigation dropdown for all public portfolio demos, and a direct link to the platform status page (`https://status.naindev.com/`).
- **ECO-003**: The component script shall be self-contained in a single file under `public/assets/js/ecosystem-bar.js` weighing under 15 KB uncompressed, with no external runtime dependencies.
- **ECO-004**: When the user triggers the collapse/expand toggle, the bar shall toggle between a full horizontal top bar and a minimal floating corner pill to prevent obstructing full-screen viewports (e.g., 3D canvases or games).
- **ECO-005**: When keyboard navigation is used (Tab, Escape, Enter), the menu shall conform to WCAG 2.2 AA accessibility with visible focus indicators, `aria-expanded` and role attributes, and close on Escape keypress.

## Edge cases and error handling

- If the host page defines aggressive CSS resets (`* { box-sizing: content-box }` or global font sizes), the component styles inside Shadow DOM shall remain completely unaffected.
- If `current-project` attribute is not supplied, the bar shall render gracefully with the default label "Demo".
- If JavaScript runs in an environment where `customElements` is not supported (SSR), the script shall exit safely without throwing uncaught exceptions.

## Out of scope

- Single Sign-On (SSO) session synchronization across domains (deferred to subsequent identity iteration).
- Server-side rendering inside static generation frameworks.

## Acceptance criteria

- Unit/contract test in `scripts/ecosystem-bar.test.mjs` verifies script size, Shadow DOM usage, project catalog completeness, accessibility attributes, and collapse behavior.
- `node --test scripts/ecosystem-bar.test.mjs` passes.
- `public/assets/js/ecosystem-bar.js` is served and accessible.

## Session state

- Last updated: 2026-10-15
- Done: spec 038, contract test `scripts/ecosystem-bar.test.mjs`, Web Component `public/assets/js/ecosystem-bar.js`, requirements and traceability updates.
- Next: Phase 2 (status hub) & Phase 3 (central CI/CD workflows repository).
- Blocked: —

