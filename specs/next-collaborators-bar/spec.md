# Specification: Clients and collaborators bar

Status: Draft (branch `feat/collaborators-bar`, worktree `D:/wt/nain9dev.github.io-feat-collaborators-bar`, from `origin/main` `2ee1595`)

## Objective

Show, before the contact section of the home, the brands NainDev works with (clients and partners), each by its logo and nothing else, and keep the consented recommendations of spec `next-testimonials` under that bar. The section grows by adding one entry to a data file; nothing is published about a company without its recorded authorization, and nothing is shown at all while no entry is approved.

The owner asked for this on 2026-11-13: a bar "as other companies do", linked to public reviews where they exist, and able to grow with more clients and opinions over time. After seeing the first version he asked for the brands alone, without a description of the work under each one, moving sideways as a strip.

## Functional requirements (EARS)

### Data

- **CLB-001 (collection)**: When a collaborator is stored in `src/data/collaborators.json`, it shall carry the brand name, an optional `https` URL, an optional logo (`src` under `/assets/images/collaborators/`, the file's own `width` and `height`, and `withName` for a logo with no wordmark), an `order`, a `status` (`pending` or `approved`) and an authorization record (granted, date, evidence). An entry without a granted authorization shall fail the build. The entry holds no description of the work and no relationship label.
- **CLB-002 (nothing without approval)**: When no collaborator and no recommendation has status `approved`, the home shall render no section and no heading. This refines TEST-002.
- **CLB-008 (repository hygiene)**: The committed collection shall hold only approved entries, each with an authorization evidence of at least ten characters, an `https` URL when it has one and, when it declares a logo, an existing file of at most 20 kB whose pixel size is the declared one. The repository is public: a pending entry or a name without authorization is never committed.

### Presentation

- **CLB-003 (bar)**: When at least one collaborator is approved, the section `#clientes` shall open with the eyebrow "Clientes y colaboradores", the H2 "Trabajamos con estas marcas" and one list with an item per approved collaborator, sorted by `order` and then by name. Each item shows the brand only: its logo, the logo followed by the name when `withName` is set, or the name as text when there is no logo. An item with a URL is a single link to it (`target="_blank"`, `rel="noopener noreferrer"`); an item without one is not a link. No caption or description is rendered.
- **CLB-004 (logos)**: Logos shall be served from this site (no hotlink), resized at most and never recoloured or filtered, on a light plate that is the same in both themes, with explicit `width` and `height`, `loading="lazy"` and `decoding="async"`. The `alt` is the brand name, or empty when the name is written next to the logo, so the name is read once.
- **CLB-005 (recommendations)**: When approved recommendations exist, they shall render under the bar; their heading is an H3 when the bar is present and the section H2 otherwise. TEST-003 and TEST-004 are unchanged.
- **CLB-006 (public sources)**: When `src/data/review-sources.json` lists a source (name and `https` URL of a public profile where anyone can read or leave an opinion about NainDev), the section shall end with a line that links each source. The site embeds no third-party widget, script, frame or image and reads no platform API. With no source, no line is rendered.
- **CLB-009 (moving strip)**: When three or more collaborators are approved, the visitor has no reduced-motion preference and the page is not in low-performance mode, the list shall move sideways as a continuous strip. The list is rendered twice so the loop has no seam; the copy is hidden from assistive technology and its links are out of the tab order. The loop animates `transform` only and takes at least 30 seconds, eight seconds per brand beyond that. The strip stops while the pointer is over it and while the visible control "Pausar el movimiento" is checked (WCAG 2.2.2), and it turns back into the plain list while a link inside has keyboard focus, so focus is never on a clipped link. With fewer than three brands, with a reduced-motion preference or in low-performance mode the list is static and wraps, and neither the copy nor the pause control is shown. No script is used.
- **CLB-012 (tokens and budget)**: The rules use design tokens only (no colour literal outside the token block, no `transition: all`), and the pause control is at least 44 px tall. `gzip(index.html)` stays at or under 30 720 B (CSS-002), measured in `tasks.md`.

### Honesty

- **CLB-007 (no claims)**: The section shall publish no rating, star, average, `Review` or `AggregateRating` markup (TEST-005), no figure, and no claim such as "clientes satisfechos", "confían en" or "trusted by": it names the brands NainDev works with. The eyebrow names clients and collaborators together and no brand is labelled as one or the other. The case-study vocabulary ban (CASE-002, CASE-003) and PART-003 stay in force.
- **CLB-010 (English)**: Every string the section renders shall have a reviewed English target (`npm run check:locales`). Brand names are not translated.

### Guard

- **CLB-011 (guard)**: `scripts/collaborators.test.mjs`, registered in `npm run check`, shall assert CLB-001 to CLB-009 and CLB-012 from the sources and the data, and the selection, ordering and motion rules of `src/utils/collaborators.ts` with made-up entries.

## Edge cases and error handling

- Empty collections: valid. The section does not exist and each build logs that the collection is empty.
- A brand without a public site: shown without a link until it has one; adding the `url` later is a one-line change.
- A logo that is only an isotype: `withName` writes the name next to it, in the site's own text face. The brand's wordmark is not redrawn.
- A company withdraws its authorization: its entry and its logo file are removed in the next release; past commits keep them, and the company is told so when it is asked.
- One or two brands: a static row. The strip starts with the third.
- Many brands: the strip gets longer and its loop slower; nothing else changes.
- Keyboard and screen-reader users meet a plain list of the brands, each once.
- A partner or a client whose own agreement restricts public references: the entry is not created until the written consent that agreement requires exists.

## Out of scope

- Pages about client work. Spec 007 and ADR-0016 keep client case studies out of the site; bringing them back is a separate owner decision (see OQ-019).
- Embedding or reading reviews from a platform (ADR-0008 rejected the embed; ADR-0009 covers the long-term service).
- Asking companies for their authorization, their logo files and their opinions (`[H]`, see `docs/41-blockers.md` B-027 and B-028).
- A dedicated page listing every collaborator.

## Acceptance criteria

- `npm run check` passes with the committed entries, in both locales.
- In the browser the strip moves, stops under the pointer and with the pause control, is a plain list for a keyboard user and in low-performance mode, and does not make the page scroll sideways on a phone.

## Session state

- Last updated: 2026-11-13
- Done: first version (static list with a caption per company), then the owner's revision of the same day: brands only, optional link, logo with the name for an isotype, moving strip with a pause control. Three entries added on the owner's confirmation, with their logo files; three reviewed English strings. Guard rewritten first (6 of 11 red), then green. Measurements and the browser pass are in `tasks.md`. Not committed.
- Verified: `npm run check` and the browser checks listed in `tasks.md`.
- Next: owner go-ahead to commit and open the pull request; owner approval of the wording (eyebrow, H2, pause control) and of the ADR.
- Blocked: any further brand needs its recorded authorization first (B-027). OQ-019 blocks any page about client work.
