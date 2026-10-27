# ADR-next: Private projects are shown by an anonymized architecture diagram

Status: Proposed
Date: 2026-10-27

## Context

PRJ-002 (spec 012) keeps the private catalog entries free of links and of any client, product, partner or employer name, and the catalog heading tells the visitor that private projects are "described only by architecture and stack". After spec 049 the catalog is a compact index and the four selected public projects carry the visual weight of the home with captures and work pages (spec 050). The three private projects in production, which are the owner's most substantial work, remain text only: there is nothing to capture without exposing a client, and ADR-0016 keeps the work pages for public projects with an own demo.

## Decision

- Each private project in production (`status` beginning with "Privado · En producción") carries an anonymized architecture diagram: a hand-authored SVG on the design tokens, built only from the architecture and stack the catalog entry already publishes (`summary`, `proof`, `technologies`), with the same classes, viewBox and accessible structure as the work-page diagrams (WK-004) and a Mermaid source under `docs/assets/diagrams/`.
- The diagram lives in the row's disclosure, after the proof, and is fetched as a static SVG file the first time the disclosure opens, then inserted inline. Inline, it reads the theme tokens (an `<img>` cannot follow a theme chosen with `data-theme`, ADR-0014); fetched on open, it costs the home document nothing and a closed row no request. The English site serves translated copies written by the localization build, so the client picks the file by locale.
- The diagram styles move from `work.css` to a shared `diagram.css` imported by `site.css`, so the home and the work pages render diagrams from one rule set.
- The boundary of PRJ-002 is unchanged: a diagram is a drawing of the published sentences, not a new disclosure. No label may name a client, a product, a partner, an employer, an internal identifier or a figure the entry does not already state. `check:claims` scans the SVG files with the sources.

## Consequences

- The three strongest entries have a visual that a technical buyer can read, without a client case study and without a capture of a private interface.
- `main.css` grows by the shared diagram rules (about 1.1 KB raw); the home stays under the CSS-002 tripwire, measured in `specs/next-private-diagrams/tasks.md`.
- The client script of the catalog gains one fetch path with a fail-soft branch (the figure is removed if the file does not load); a new private project in production needs a diagram file, its Mermaid source and a `diagram` field, or the guard fails.
- The localization pipeline handles one more kind of document (SVG files under `public/assets/diagrams/`), with the same opt-in attribute (`data-translate="yes"`) that the inline work-page diagrams use.
