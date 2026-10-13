# Specification: Field Web Vitals and Lighthouse CI budget

Status: In progress

## Objective

Measure real visitors and block regressions before publishing (ADR-0004 and ADR-0005, both Proposed). Owner decisions on 2026-10-13: field data through Plausible, one event per sampled page view at 25 %; strict Lighthouse CI budget that fails the build; the agent registers the Plausible custom properties in the owner's browser with confirmation.

## Functional requirements (EARS)

- **RUM-001**: When a page view is sampled (25 %), the site shall load the reporting module when idle and observe LCP, INP and CLS with `web-vitals`.
- **RUM-002**: When a sampled page is first hidden, the site shall send exactly one Plausible event `Web Vitals` with `interactive: false` and properties `lcp`, `inp`, `cls` (ratings), `lcp_ms`, `inp_ms`, `cls_value` (bucketed) and `device` (`mobile` below 768 px, otherwise `desktop`); metrics not yet observed are reported as `none`.
- **RUM-003**: When a page view is not sampled, the site shall download no reporting code.
- **LHCI-001**: When the site is deployed or a pull request is checked, Lighthouse shall run five times on each budget page of the built site and fail when a median breaks performance ≥ 0.95, LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1 or transfer ≤ 250 KiB, without uploading reports anywhere.

## Edge cases and error handling

- Plausible blocked by the visitor: the event is queued in the `window.plausible` stub and never sent; nothing breaks.
- A page restored from the back/forward cache does not send a second event.

## Out of scope

- Dashboards outside Plausible.

## Acceptance criteria

- `scripts/measurement.test.mjs` fails before the change and passes after it, inside `npm run check`.
- `npm run check:budget` passes locally against `dist/`.
- After deploy, a sampled visit sends one `Web Vitals` event (checked in the browser network log), and the next deploy run shows the budget step passing.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01, T02.
- Next: T03 after deploy, T04 in the owner's browser.
- Blocked: B-017 (owner account action, done by the agent in the owner's browser)
