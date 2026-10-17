# Ecosystem Bar Split and Budget

Status: In progress (phase A and B local; not deployed)

## Objective

Spec 038's ECO-003 caps `ecosystem-bar.js` at 15 KB raw. Version 2.0 is 42 KB raw (10.8 KB gzip), so `npm run check` fails and the last three deploys of `main` failed. ADR-0007 (Proposed) replaces the raw cap with a transfer-size budget and splits the script by lifecycle. This spec delivers it in two phases.

## Requirements

Phase A (budget):

- ECO-003 (amended): The distribution under `public/assets/js/ecosystem-bar*.js` and `public/assets/data/ecosystem.v1.json` shall weigh at most 15 KB gzip (level 9) in total. While the script is one file, that file alone shall stay under this figure.

Phase B (split):

- ECO-003 (final): The entry script `ecosystem-bar.js` shall stay under 20 KB raw (parse guard) and at most 5 KB gzip, with no static imports, `require` calls or external runtime dependencies; the whole distribution shall stay at or under 15 KB gzip. Measured after the split: entry 18.5 KB raw / 5.0 KB gzip, panel 12.4 KB / 3.3 KB, data 17.3 KB / 4.7 KB; total 13.0 KB gzip.
- ECO-006: When a page loads the entry script, the architecture panel module shall not be requested until the user opens the panel (button or Alt+A).
- ECO-007: The project catalog and the architecture profiles shall live in `public/assets/data/ecosystem.v1.json` with `schemaVersion: 1`; the menu shall be rendered from it, and adding a project shall need no script change.
- ECO-008: When the data file cannot be loaded or has another `schemaVersion`, the bar shall still render the brand link (which points to the portfolio) and the status link, without the project menu and the panel button, and shall not throw.
- ECO-009: When the entry script is loaded from any origin, it shall resolve the panel and data files from its own script URL, falling back to `https://www.naindev.com/assets/`.
- ECO-010: Every catalog item and profile in the data file shall have the fields the bar renders, HTTPS URLs, and unique names; `scripts/ecosystem-bar.test.mjs` shall fail otherwise.

## Edge cases

- The telemetry bus (fetch observer and `nain:telemetry` events) stays in the entry because it must observe from page load; the data fetch uses the original `fetch`, so it is not logged as host traffic.
- Existing behavior is preserved: Shadow DOM, collapse, menu, Escape, Alt+A, ARIA attributes, element name and attributes (`current-project`, `collapsed`).
- `scripts/performance.test.mjs` PERF-003 allows every `ecosystem-bar*.js`; any other file in `public/assets/js` still fails.

## Out of scope

- Changing visible texts, styles or the profile contents.
- A build step or bundler (ADR-0007, alternatives).

## Session state

- Last updated: 2026-10-17
- Done: ADR-0007 (Proposed), spec, tasks.
- Next: phase A, then phase B, then owner approval of the ADR and deploy.
- Blocked: ADR-0007 `Approved` is the owner's call.
