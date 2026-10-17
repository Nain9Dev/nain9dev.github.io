# ADR-0007: Split the ecosystem bar into core, lazy panel and versioned data

Status: Proposed
Date: 2026-10-17

## Context

`public/assets/js/ecosystem-bar.js` is a standalone distribution script that other `*.naindev.com` applications load (spec 038). ECO-003 limited it to 15 KB uncompressed. Version 2.0 added the architecture and telemetry drawer, the project catalog and nine architecture profiles; the file is now 42 KB raw and 10.8 KB gzip. The raw limit fails `npm run check`, so the last three deploys of `main` failed (2026-10-16 and 2026-10-17), unrelated to their content.

Two things are wrong, and a bigger number fixes neither:
- The budget is measured on bytes that nobody downloads. Browsers receive the compressed file; Lighthouse budgets, `size-limit` and bundler budgets are expressed in compressed transfer size.
- Code and data share one file and one cost. Every host page parses all profiles, sample events and drawer styles to show a 40 px bar, and every new project or profile edits code and a test.

## Decision

1. **Measure transfer size.** The budget is gzip (level 9) of each deliverable, plus a raw-size cap on the entry script as a parse guard.
2. **Split by lifecycle.**
   - `ecosystem-bar.js` (entry, classic script, same URL as today): custom element, bar, menu, collapse, telemetry bus. Always loaded.
   - `ecosystem-bar-panel.js` (ES module): drawer markup, drawer styles, tab rendering. Loaded with `import()` the first time the panel opens.
   - `ecosystem.v1.json`: project catalog and architecture profiles. Fetched by the entry after upgrade; its `schemaVersion` is the contract.
3. **Versioned data contract.** A breaking change to the data shape creates `ecosystem.v2.json` and keeps `v1` until consumers move. Adding a project or profile is a data change, with no script change.
4. **Degrade, never throw.** If the data cannot be fetched, the bar keeps the brand link (the portfolio) and the status link, without menu and panel.
5. **Self-locating.** The entry resolves its siblings from its own script URL, with `https://www.naindev.com/assets/` as the fallback, so hosts that load it from another origin keep working.

## Consequences

- Hosts download and parse only the bar until someone opens the panel; the entry stays near 5 KB gzip.
- Catalog and profiles are validated by a data test instead of regex over a script.
- The "single file" clause of spec 038 and ECO-003's raw 15 KB figure change; the entry script URL and the `<nain-ecosystem-bar>` tag do not.
- Hosts that copied the script locally instead of loading it from `www.naindev.com` need the sibling files or the canonical fallback; the fallback covers them while online.
- One extra request on first panel open and one for the data file (cacheable).

## Alternatives considered

- **Raise the raw limit to 45 KB**: unblocks the deploy but keeps the wrong metric and the monolith; the next feature raises it again.
- **Minify the single file**: no build step exists for this file and it would hurt diffs; compression already removes most of the gain.
- **Bundle with a build tool**: a new dependency for one static file; revisit if more distribution scripts appear.
- **Inline the data and lazy-load only the panel code**: removes the second request but keeps data edits coupled to code releases.
