# ADR-next: Brands are shown with their authorization, as a strip the visitor can stop, and public reviews are linked

Status: Proposed
Date: 2026-11-13

## Context

The design brief forbade client logos and testimonials while there were none ("Real content only"), and ADR-0008 opened the door to real, consented recommendations in a validated collection that renders nothing while it is empty. NainDev now has client work and a design partner, and the owner wants the home to show who it works with, as a bar of brands like the ones other software sites carry, to link public reviews, and to keep adding clients and opinions over the years.

Three things constrain the answer. The repository is public and keeps history, so a company's name or logo cannot be committed before the company agrees. The site ships no third-party script, frame or request on load (ADR-0008, the footer promise, the CSP). And the site publishes no rating or review markup about itself (TEST-005): self-published stars mislead under EU consumer rules and search engines ignore them.

A first version showed a static list with a caption under each logo ("Cliente" or "Socio" and one line of the work done). The owner reviewed it the same day and asked for the brands alone, moving sideways.

## Decision

- Brands are stored in `src/data/collaborators.json`, a content collection whose schema makes the authorization record mandatory, exactly as consent is for a recommendation. Only approved entries are committed.
- The home shows them inside the existing recommendations section, before the contact section, under the heading "Trabajamos con estas marcas". Each brand is its logo, linked to its site when it has one. There is no caption: no relationship label and no description of the work.
- From three brands on, the list moves sideways as a strip, in CSS only. It starts by itself, so it can be stopped: it stops under the pointer and with a visible control, and it is a plain list for anyone who asked for reduced motion, in the site's low-performance mode and while a link inside has keyboard focus. The list is drawn twice for the loop; assistive technology and the keyboard meet each brand once.
- Logos are shown as delivered, on a light plate that is the same in both themes. They are resized at most, never recoloured or filtered. A logo that is only an isotype has the brand name written next to it in the site's text face.
- Public review profiles (a business listing, for example) are linked from the section through `src/data/review-sources.json`. Nothing is embedded, no platform API is read and no score is copied to the site. A recommendation that exists on a public platform links its source through the `sourceUrl` field it already has.
- The bar makes no claim: no "satisfied clients", no "trusted by", no figure. It names brands.

## Consequences

- The brief's "no client logos" rule is superseded for real companies with a recorded authorization; invented or unauthorized names stay forbidden, and the guard fails on a pending entry.
- Adding a brand is one entry and one file; no component changes and no translation, since brand names are not translated.
- The home has one more looping animation. It animates `transform` only, like the existing one (PERF-007), and it does not run in low-performance mode.
- The pause control is a checkbox read by `:has()`, so the bar needs no script; a browser without `:has()` still stops the strip under the pointer and honours reduced motion.
- A company that withdraws is removed from the site in the next release but stays in past commits; it is told so when asked.
- A partner or a client whose contract restricts public references cannot be listed until the consent that contract requires exists. That check is the owner's, outside the repository (B-027).
- Without captions the page no longer says what was done for each brand. That story belongs to a recommendation in the client's words or, if the owner decides so, to a page about the work (OQ-019).

## Alternatives considered

- **Static list with captions** (the first version): says more, but the owner did not want engagement details on the home and found the captions odd.
- **Reviews widget of a platform**: familiar and "verified", but it loads third-party code on every visit, breaks the CSP and the footer promise, and shows stars.
- **Build-time call to a places API**: no runtime request, but it needs a billed key, the platform limits how long review text may be stored, it returns a handful of reviews chosen by the platform and it would publish a score.
- **Script-driven carousel**: more control (drag, buttons), at the cost of script on the home for a handful of logos.
- **Single-tone logos**: visually calmer, but altering a company's mark usually breaks its brand rules and needs artwork the company has not supplied.
