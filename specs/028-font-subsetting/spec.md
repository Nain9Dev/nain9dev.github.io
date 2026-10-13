# Specification: Font subsetting

Status: In progress

## Objective

The two variable fonts (Inter 48 KB, Outfit 32 KB) are Google's generic "latin" subsets with the full 100–900 weight axis and OpenType features the site never uses (fractions, tabular and proportional figures). On 2026-10-13 the owner asked to trim them without visual change.

## Functional requirements (EARS)

- **FONT-001**: When fonts are served, Inter shall weigh at most 34 KB and Outfit at most 30 KB, keeping weights 300 to 800, kerning and the default ligatures.
- **FONT-002**: When any page is built, every character of its visible text outside code blocks, emoji and pictographic symbols shall be inside the `unicode-range` declared for both fonts, so no text falls back to a system font.

## Generation (reproducible, local only)

```sh
uvx --from "fonttools[woff]==4.60.1" pyftsubset <font>.woff2 --unicodes="U+0020-007E,U+00A0-00FF,U+0131,U+0152-0153,U+2013-2014,U+2018-201E,U+2022,U+2026,U+2030,U+2039-203A,U+20AC,U+2122,U+2190-2193,U+2197,U+2212" --layout-features="kern,liga,calt,ccmp,locl,mark,mkmk,rvrn" --flavor=woff2 --no-hinting --output-file=<out>.woff2
```

The source files are the previous `inter-var.woff2` and `outfit-var.woff2` (git history before spec 028). Limiting the weight axis to 300–800 with `fonttools varLib.instancer` was tried and rejected: it made Outfit larger (its default master is 100) and shifted Inter by subpixels at 600 and 800. The tool runs locally through `uvx`; it is not a project or CI dependency.

## Edge cases and error handling

- New content with characters outside the range (for example another language) fails FONT-002 in `npm run check`; extend the range, regenerate and update the CSS together.

## Out of scope

- Replacing the typefaces.

## Acceptance criteria

- `scripts/fonts.test.mjs` fails before the change and passes after it.
- Headings (Outfit 800), body text (Inter 400) and light text (300) look identical before and after in the browser.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01.
- Next: T02 after deploy.
- Blocked: —
