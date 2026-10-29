# ADR-next: Adopt the designer's isotype as the site mark, as a vector

Status: Approved (owner, in chat, 2026-10-29: isotype now, full lockup when the vector wordmark arrives)
Date: 2026-10-29

## Context

The site header shows `src/assets/images/logo_horizontal.png`, a 1600 x 400 raster: a cobalt N with a cyan diagonal and the name "NainDev" with "Dev" in cyan. The designer's round 4 (`design/home-redesign`) replaces it with a different identity: an N drawn from three round-capped strokes, one colour, and a wordmark "NAINDEV" in widely tracked capitals with an open A. The prototype ships the logo as PNG files (480 px, a 423 x 38 px wordmark) and two SVG favicons that hold the exact stroke geometry. His README lists the vector logo folder as pending, because the source should be his `.ai` file and not an auto-trace.

A logo is a public identity, not a style choice: it appears on the site, in the structured data, in social images and on external profiles (LinkedIn, Google Business, freelance platforms), and the owner may file it as a trademark.

## Decision

- The site mark becomes the designer's isotype, drawn as inline SVG from his stroke geometry and coloured by one role, `--color-logo` (brand blue on paper, white on deep blue).
- The wordmark is published only as a vector. Until the designer delivers it, the header shows the isotype and the text "NainDev" in the heading font. His raster wordmark is not published: at 38 px high it blurs on dense screens and cannot follow the theme.
- Favicons, the touch icon and the Organization logo are regenerated from the same geometry in the same change as the header, so the site never shows two identities.
- The change lands as its own pull request after the tokens layer, and can be reverted alone. Both pre-redesign copies of production stay available (`naindev/legacy`, `naindev/legacy-2`).

## Consequences

- The header drops a 1600 px raster and gains about one kilobyte of SVG; the home document is measured against ADR-0013.
- External profiles keep the old logo until the owner replaces it; the pull request lists them.
- The credit to the designer and any mention of Contrast3D follow the partnership rules in `design/README.md`, decided by him.
- Approving this ADR approves the isotype only; the full lockup waits for the vector wordmark.
- The icons keep one design for both themes: the isotype in brand green on a rounded deep blue tile, as the designer drew it. The tile reads on any tab or home screen, which a bare mark on a transparent background does not. The icon contract now measures the green strokes against the circular mask instead of every opaque pixel.
- The old `logo_horizontal.png` is deleted; `naindev/legacy` and `naindev/legacy-2` keep it.

## Alternatives considered

- **Keep the current logo and adopt only the tokens and surfaces**: lowest risk, but gives up the one part of the round that is a clear identity improvement and the designer's main contribution.
- **Use the designer's PNG files as they are**: fast, but raster, wrong for both themes without separate files, and not a basis for a trademark filing.
- **Auto-trace the PNGs to SVG**: rejected by the designer's own brief and likely to produce an inexact mark; the favicon geometry is exact for the isotype and the wordmark needs his source.
- **Wait for the full vector set before any change**: delays layers 1 and 3, which do not depend on it.
