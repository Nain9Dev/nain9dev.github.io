# Specification: Intermittent long tasks after first paint

Status: Done

## Objective

After spec 032 the Lighthouse budget failed on GitHub runners in roughly a third of the runs (TBT 250–400 ms on a random page), while local runs stayed at 0 ms. Per-run long-task logs and DevTools traces under 6x CPU throttling on 2026-10-13 found two causes:

1. All work deferred to idle ran in one task; when a slow device hits the 1.5 s idle timeout, it runs inside the measured window.
2. The `<link rel="icon" type="image/svg+xml">` favicon makes Chrome build an isolated SVG document on the main thread when the response arrives (`SVGImage::DataChanged` → `IsolatedSVGDocumentHost`, 47 ms of a 69 ms task at 6x, about 8 ms on a fast desktop), on every page.

The owner chose to stop declaring the SVG favicon (keeping the file and the PNG, ICO and touch icons) on 2026-10-13.

## Functional requirements (EARS)

- **PERF-017**: When deferred work runs, each module shall start in its own idle slot, so a timed-out idle callback runs one module only.
- **PERF-018**: When a page is rendered, it shall declare no SVG favicon; the 96 px PNG, ICO and 180 px touch icon remain declared, and the SVG file stays published at its stable URL (SEO-002).

## Edge cases and error handling

- Browsers that only accept SVG favicons do not exist among supported targets; all use PNG or ICO.

## Out of scope

- Redesigning the icons.

## Acceptance criteria

- Tests for PERF-017 and PERF-018 fail before the change and pass after it; `check-brand-icons` asserts the new contract.
- Under 6x CPU throttling, repeated loads of `/servicios/` show no late long task.
- The next deploy passes the budget.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: diagnosis; PERF-017 implemented and unit-tested (`runQueueWhenIdle`); PERF-018 implemented (`BaseLayout.astro`), tested in `performance.test.mjs` and asserted by `check-brand-icons`; requirements, traceability and changelog consolidated.
- Verified: `node --test scripts/performance.test.mjs scripts/post-paint.test.mjs` (17 pass) and `npm run check:brand-icons` pass locally.
- Next: none. If the residual browser-internal outlier blocks deploys often, consider disabling Chrome's page-content extraction in the budget runner (ADR-0005 update).
- Blocked: —
