# Specification: Visual polish and motion system

Status: Implemented (PRs #13 to #17 merged 2026-10-22; VP-003 section tiers pending)

## Objective

Raise the first impression of www.naindev.com for recruiters and CTOs with a coherent visual system and a choreographed motion layer, without changing content, metadata, routes, links, structured data or the ecosystem bar. The site stays a static Astro build with a Lighthouse mobile performance score of 95 or more and an accessibility score of 100.

Phase 1 (this document) diagnoses the current site, proposes three visual directions and recommends one. Phase 2 implements the chosen direction in five small pull requests, each merged only with the owner's explicit approval.

## Baseline

- Captures of every page type, desktop (1440 px) and mobile (390 px, DPR 2), fold and full page, taken on 2026-10-21 from the local production build: `.astro/visual-polish/before/` (git-ignored; 44 PNG files) with contact sheets in `.astro/visual-polish/review/`. The capture tool is a DevTools-protocol script kept outside the repository, as the spec 033 audit did; it will be reused for the "after" captures.
- The first capture run had no English pages: the catalog update of 2026-10-21 (five new live-demo links) added five segments to the home's live-demo strip that had no entry in `src/i18n/en-US.json`, so `scripts/build-locales.mjs` stopped with "Missing translation". The five reviewed entries were added, the bilingual build passed (66 language pairs) and `/en/` was recaptured (OQ-016 closed).
- Home page height: 21 428 px on desktop, 30 995 px on mobile, 14 sections.

## Diagnosis: where the site looks generic

1. **The site ignores its own brand system.** `public/tokens.css` (brandbook v1.5: cobalt `#0047AB`, deep blue `#002B66`, paper `#EDF1F6`, green `#80FF00`, red `#FF001F`, Urbanist and IBM Plex Mono, 4 px radius, solid offset shadows) is published but never imported. `main.css` uses Tailwind's blue `#3B82F6`, an undeclared orange `#F0A45D`, Inter and Outfit, radii of 0.85 to 2 rem and blurred glows. The result reads as a dark SaaS template, not as NainDev.
2. **Five decorative background layers compete with the text.** Three radial gradients, a 4 rem grid, a mouse-following glow, a particle canvas and a WebGL icosahedron all run at once on the home page with no composition rule; none of them carries meaning and the hero has no focal object (the panel on the right is a list, not an image).
3. **Type hierarchy is flat.** `h1` tops at 4.6 rem and `h2` at 4.5 rem, so every section shouts as loud as the hero; `h3` is a fixed 1.5 rem; body is 1 rem with no fluid scale; the mobile override sets `p` to a clamp that is larger than the desktop body. There is no modular scale and no `text-wrap: balance` on headings.
4. **Vertical rhythm is uniform, so nothing is important.** Every section has `padding-block: clamp(7rem, 12vw, 11rem)` regardless of weight; the proof strip, the trust badges and the live-demo grid sit between the hero and the terminal with the same spacing as the main sections. The home needs 14 screens on desktop and 36 on mobile.
5. **Seven card families with no shared system.** `service-card`, `project-card`, `live-demo`, `tech-badge`, `blog-card`, `pain-card`, `catalog-index li` and `case-study-card` use five radii (0.45 rem, 0.85 rem, 1.25 rem, 2 rem, 999 px), three surface colours and two shadow recipes (`0 2rem 5.5rem` and `0 1.5rem 4rem` blurs). All of them lift on hover by a different amount (-2, -4, -5, -6, -8 px).
6. **Accent colours are improvised.** `--color-secondary` equals `--color-primary` (both `#3B82F6`), so the "secondary" does not exist; orange `#F0A45D` is written as a literal in nine places; three different greens (`#34D399`, `#22c55e`, `rgba(34,197,94)`) mark "live"; the metric value colour is a literal `#F0A45D` with a text shadow. Nothing in the palette says "precision".
7. **Interaction states are inconsistent and partly hover-only.** Buttons and cards use `transition: all`; the nav underline only appears on hover or `aria-current`; `card-link` underlines on hover only; the project card tilt writes inline `transform` and `transition` from JavaScript; `:active` exists only on `.button`. The focus ring is 3 px `#3B82F6`, which on the primary button (`#3B82F6` background) gives a ring with little contrast against the control it marks.
8. **The header is heavy and the mobile navigation is a cut-off scrolling row.** The header is 6 rem tall (96 px of a 844 px fold), the logo is a 3.2 to 4.2 rem raster image, and below 60 rem the five links become a horizontal scroll strip whose last item is clipped ("Cómo tra…") with no affordance; below 42 rem the call to action disappears from the header.
9. **The mobile fold is text only.** Seven lines of summary, two full-width buttons and an availability line fill the first screen; the capabilities panel and the badges with OS-dependent emoji (⚙️ 🧪 🎉 📥) follow. Emoji render differently per platform and look unfinished next to a vector icon set.
10. **Motion is abundant but not choreographed, and not all of it respects reduced motion.** The hero text appears at once (correctly visible without JavaScript, PERF-006) and then five independent effects start; every reveal is the same `translateY(1.25rem)` over 560 ms; `tech-badge` starts at `opacity: 0` in CSS and depends on JavaScript to appear; the terminal typewriter (`terminal.js`) has no `prefers-reduced-motion` check; `project-grid-container.is-filtering` scales the whole grid; reveal delays are set inline per card.

Verified facts come from `src/styles/main.css`, `src/scripts/*.js`, the components and the captures. The weight of each point is a design judgement.

## Three visual directions

Common to all three: typography set in a modular fluid scale, a single spacing scale, one card system, tokenised colours, choreographed motion. They differ in surface, palette, type and signature animations.

### A. Ink and paper (editorial technical, brandbook literal)

- **Surface law:** paper `#EDF1F6` dominant; deep blue `#002B66` bands for the terminal, projects and contact sections; `#F7F9FC` cards.
- **Palette:** ink `#002B66` for reading text, cobalt `#0047AB` for links and the primary button, green `#80FF00` only on deep blue (10.6:1), red `#FF001F` for the click halo and errors, brand black `#1D1D1B` for solid shadows.
- **Typography:** Urbanist (display and body, variable, weights 300–800) and a system mono stack for labels; `h1` 3.2–4.6 rem, `h2` 2–3 rem, body 1.0625 rem, measure 68 ch.
- **Spacing:** brand 4 px scale (`--nain-s1` to `--nain-s32`); sections at 80 / 128 px; 4 px radius; 22 px solid offset shadow on panels, 12 px on mobile.
- **Signature animations:** (1) *dimension lines*: a cota (measurement line with end ticks) draws itself under the hero title with `stroke-dashoffset`, 700 ms, `cubic-bezier(0.22, 1, 0.36, 1)`; (2) *block settles*: cards enter with their solid shadow sliding from 0 to 22 px offset (`translate` on a pseudo-element), 420 ms, same easing, 60 ms stagger; (3) *ink wipe*: the cross-document view transition is a deep-blue band that wipes from top to bottom (`clip-path` on `::view-transition-new(root)`), 320 ms.
- **Cost and risk:** inverts the site from dark to light, which touches every selector, the social image and the brand icons; needs the font swap; is close to the designer's prototype in `design/home-redesign` (see OQ-013), so the work would be a port, not a new design.

### B. Deep-blue precision (dark, brand expressed on the dark surface) — recommended

- **Surface law:** near-black blue `#070B16` page, deep blue `#0B1E45` to `#002B66` for raised surfaces and bands, paper `#EDF1F6` for headings, `#B7C3D6` for body copy. The existing `color-scheme: dark` stays.
- **Palette:** cobalt `#0047AB` for primary buttons and filled states (white on cobalt 7.4:1), `#5B8DEF` for links on dark (5.9:1 on `#070B16`), green `#80FF00` only for "live" marks, the focus ring and the signature underline, red `#FF001F` only for the pressed halo and errors. No orange. Gradients only as a single, large, static vignette.
- **Typography:** Urbanist for display (replaces Outfit; variable 300–800, Latin subset), Inter stays for body; system mono for labels. Scale: `h1` clamp(2.5rem, 1.6rem + 3.6vw, 4.4rem), `h2` clamp(1.9rem, 1.3rem + 2.2vw, 3rem), `h3` clamp(1.2rem, 1.05rem + 0.6vw, 1.5rem), body 1.0625 rem, small 0.875 rem, label 0.75 rem mono uppercase. `text-wrap: balance` on headings.
- **Spacing:** 4 px scale; three section tiers (`--section-lg` clamp(6rem, 10vw, 9rem), `--section-md` clamp(4rem, 7vw, 6rem), `--section-sm` clamp(2.5rem, 4vw, 3.5rem)); 4 px radius on cards and buttons, pill only on chips; solid offset shadow in cobalt (`8px 8px 0`) on raised cards, no blur.
- **Signature animations:** (1) *compose*: the hero enters in order (eyebrow, title lines, summary, actions) with a `clip-path: inset(0 0 100% 0)` to `inset(0)` reveal per line, 480 ms, `cubic-bezier(0.22, 1, 0.36, 1)`, 90 ms stagger, pure CSS; (2) *precision grid*: the fixed 64 px grid replaces the blurred glow and brightens only inside a 420 px radius around the pointer (a radial `mask-image` driven by the existing `--mouse-x/--mouse-y`), opacity only; (3) *sweep*: nav links, card links and chips draw a 2 px green line from left to right (`scaleX` with `transform-origin: left`), 220 ms, and raised cards lift 4 px while their solid shadow grows from 0 to 8 px, 240 ms.
- **Cost and risk:** the smallest blast radius: the page stays dark, the ecosystem bar (dark with green) and the demo thumbnails keep matching the site, the social image stays valid; one font swap (Outfit to Urbanist, spec 028 tests updated); the `--color-background` marker asserted by `scripts/performance-build.test.mjs` changes with it.

### C. Swiss brutal (clean brutalism)

- **Surface law:** white `#FFFFFF` page, brand black `#1D1D1B` bands, no greys except `#EDF1F6` for code; a visible 12-column grid (1 px lines) on the home.
- **Palette:** black text, cobalt `#0047AB` for every interactive element, green `#80FF00` on black only; no shadows, 2 px borders, 0 radius.
- **Typography:** Urbanist at display weights, uppercase section labels, `h1` up to 6.5 rem (needs the `h1` guard in `scripts/portfolio-refresh.test.mjs` relaxed), numbered sections 01–14 in mono.
- **Signature animations:** (1) *type rise*: title lines rise from `translateY(110%)` inside an overflow-hidden line box, 560 ms, `cubic-bezier(0.16, 1, 0.3, 1)`, 70 ms stagger; (2) *invert*: hover and focus invert the element (black on white to white on black) with a 120 ms `steps(1)` cut, no easing; (3) *hard cut*: page transitions are a vertical wipe with no fade, 220 ms.
- **Cost and risk:** furthest from the brandbook (which asks for paper grey, 4 px radius and solid shadows), aggressive for the insurance and banking audience the services target, and the largest-type layout risks layout shift while fonts load.

### Recommendation

Direction **B**. It expresses the brandbook on the surface the site already has, so recruiters who saw the site, the social image or a demo keep recognising it; the ecosystem bar and the eleven demo thumbnails already use dark surfaces with green marks, so B is the only direction in which the untouchable parts match the new ones; it replaces effects instead of adding them, which is the only way to stay inside the 25 KiB inline-CSS budget; and it does not duplicate the designer's paper prototype, which remains the light expression of the same brand if the owner later wants to port it.

If the owner prefers A, the plan changes from "redesign" to "port the prototype into Astro": the designer's system (`design/home-redesign/assets/nain.css`) becomes the source and this spec's animation inventory is reconciled with his `brandbook-addendum.md`.

## Animation inventory (direction B; A and C reuse the table with their own signature pieces)

Every entry: trigger, duration, easing, properties animated, and the reduced-motion version. Only `transform`, `opacity`, `clip-path` and `mask` animate; nothing animates layout, colour transitions are limited to 150 ms and never carry meaning alone.

| Component | Motion | Duration / easing | Reduced motion |
| :--- | :--- | :--- | :--- |
| Hero entrance | Eyebrow, title lines, summary, actions, availability reveal in order through `clip-path: inset(0 0 100% 0) → inset(0)` plus `translateY(0.5rem) → 0`; CSS `animation` with `animation-delay` steps of 90 ms; panel fades in after the title | 480 ms per element, `--ease-out-quart` `cubic-bezier(0.22, 1, 0.36, 1)` | No animation: everything is visible at first paint (PERF-006 keeps the text in the HTML; the animation class is applied only under `prefers-reduced-motion: no-preference`) |
| Hero scene (WebGL) | Unchanged geometry and colours (HERO-001 to HERO-003); its canvas fades in over 600 ms once the first frame is drawn so it never pops | 600 ms, linear, opacity | Hidden, as today |
| Background | Static vignette plus the 64 px grid; the grid brightens within 420 px of the pointer through a radial `mask-image` fed by `--mouse-x/--mouse-y` (existing `ambient-glow.js`); particles canvas removed | Mask follows the pointer on `requestAnimationFrame`, no transition | Grid static at base opacity; no pointer tracking (`ambient-glow.js` already exits) |
| Scroll reveal | Sections and cards: `opacity 0 → 1`, `translateY(1rem) → 0`; grid children stagger by 60 ms through `--reveal-index` set in CSS with `:nth-child` (no inline delays) | 520 ms, `--ease-out-quart` | Visible at once; no observer (existing PERF-014 path) |
| Header on scroll | Height shrinks from 5 rem to 4 rem, background opacity rises, a 1 px bottom line appears; a scroll-progress bar (`<progress data-scroll-progress>`, already in the markup) scales on X | 200 ms, `--ease-standard` `cubic-bezier(0.2, 0, 0, 1)` | Height change kept (it is a layout state, not decoration), no transition |
| Nav links | Green 2 px underline draws from the left on hover and focus-visible; stays drawn for `aria-current` | 220 ms, `--ease-out-quart`, `scaleX` | Underline appears without transition |
| Buttons | Primary: solid cobalt, on hover the solid shadow grows from `0 0 0` to `6px 6px 0 var(--green)` and the button moves `-2px, -2px`; on `:active` the shadow collapses and a red 2 px halo flashes (`box-shadow` 120 ms). Secondary: border turns green, same shadow in cobalt | 160 ms, `--ease-standard` | State change without transition; the halo is replaced by the border colour |
| Project and service cards | Lift `translateY(-4px)`, solid shadow 0 → 8 px cobalt, thumbnail `scale(1.03)` clipped to the card; the inline-style tilt (`card-tilt.js`) is removed | 240 ms, `--ease-standard` | No lift; border and shadow change only |
| Card link and text links | Underline sweep as nav links; the arrow glyph `→` moves 4 px right | 220 ms | Underline shown, no movement |
| Chips and filters | Active filter: background cobalt, text white; the indicator bar slides (existing `--indicator-left/width`) | 250 ms, `--ease-standard` | Indicator jumps |
| Tech badges | Enter with the scroll reveal only; hover raises 2 px and draws the green underline under the name; `opacity: 0` base rule removed so the section never depends on JavaScript | 200 ms | Static |
| Terminal typewriter | 8 ms per character as today, plus a check: with reduced motion the welcome text is written in one step | — | One step, no `aria-busy` cycle longer than a frame |
| Page transitions | Cross-document view transition (ADR-0003): old page fades out 120 ms, new page fades in 180 ms with `translateY(12px) → 0`; the header keeps `view-transition-name: site-header` | 180 ms, `--ease-out-quart` | `@view-transition` is already scoped to `no-preference`; no transition |
| Availability pulse | Kept (transform and opacity only, PERF-007) in green | 2.8 s loop | Stopped (existing rule) |
| Privacy banner | Slides up 12 px with fade on first paint | 300 ms | Appears without motion |
| Copy-email status | Text fades in; the button shows a green check for 1.5 s | 150 ms | Immediate |

Cursor effects: none beyond the grid mask. A custom cursor hides the native one and hurts usability on precise targets; rejected.

## Functional requirements (EARS)

- **VP-001**: When any page is rendered, every colour, font family, font size, spacing step, radius, shadow, easing and duration used by `src/styles/*.css` shall come from a custom property declared once in a `:root` block at the top of `main.css`, and the brand values (`#0047AB`, `#002B66`, `#EDF1F6`, `#80FF00`, `#FF001F`, `#1D1D1B`) shall be the tokens' source.
- **VP-002**: When any page is rendered, headings shall follow a single fluid modular scale (`clamp()` with a viewport term) and `h1` shall be at least 1.4 times the size of `h2` at every viewport width, within the existing guards (`h1` max 4.8 rem, `.hero h1` max 4.6 rem).
- **VP-003**: When the home page is rendered, each section shall use one of three spacing tiers, and the sum of the three secondary strips (proof, trust badges, live demos) shall take less vertical space than one main section.
- **VP-004**: When a card is rendered, it shall use the shared card tokens (surface, border, radius, shadow, hover lift), and no card family shall declare its own radius or shadow value.
- **VP-005**: While a visitor has no reduced-motion preference, the hero shall enter in the choreographed order of the inventory, and the text shall still be present in the HTML at first paint (PERF-006).
- **VP-006**: While a visitor prefers reduced motion, no element shall animate position, scale, clip or opacity for longer than one frame, including the terminal typewriter, and the page transition shall not run.
- **VP-007**: When a keyboard user focuses any control, a focus indicator of at least 3 px in a colour with at least 3:1 contrast against both the control and its surroundings shall be visible and not covered by the sticky header (A11Y-003 kept).
- **VP-008**: When an interactive element has a hover state, the same state shall be reachable with `:focus-visible`, and no information shall be conveyed by hover alone.
- **VP-009**: When the header is rendered below 42 rem, the primary links shall be reachable without horizontal scrolling and the call to action shall remain reachable from the header (as a compact button or inside a disclosure menu that is keyboard and screen-reader operable).
- **VP-010**: When any page is built, its visible text, metadata, canonical URL, structured data, links, routes, sitemap, `public/assets/data/ecosystem.v1.json` and `public/assets/js/ecosystem-bar*.js` shall be byte-identical to the previous build, except for the font file names and the inline stylesheet.
- **VP-011**: When the home page is built, its inline stylesheet shall keep `gzip(index.html)` at or below 25 KiB (CSS-002) by removing the CSS of retired effects and dead selectors in the same change that adds new rules.
- **VP-012**: When the production build is audited with Lighthouse in mobile emulation, `/`, `/en/` and `/servicios/` shall score at least 0.95 in performance and 1.0 in accessibility, and the existing budget (LCP 2.5 s, TBT 200 ms, CLS 0.1, 250 KiB) shall hold; the desktop audit shall score at least 0.98 in performance.
- **VP-013**: When the built pages are checked with axe-core (WCAG 2.0–2.2 A and AA) at desktop and mobile widths, they shall report no violations other than the exception documented in spec 033.
- **VP-014**: When the build runs, no runtime dependency shall be added; any new development dependency shall be recorded in an ADR in state `Proposed` before it is installed.
- **VP-015**: When a display font is replaced, the site shall keep exactly two self-hosted variable font files with weights 300–800 and the shared `unicode-range` (PERF-001, FONT-001, FONT-002), with the size limits of `scripts/fonts.test.mjs` updated for the new file.
- **VP-016**: When a pull request of phase 2 is opened, it shall carry before and after captures at 1440 px and 390 px, the Lighthouse mobile and desktop scores, and the `npm run check` result in its description, and it shall not be merged without the owner's explicit approval.

## Edge cases and error handling

- JavaScript disabled or failing: every section is visible, cards and badges have no `opacity: 0` base rule, the hero animation classes do not hide content.
- `html.low-performance` (phones, coarse pointers, saving data, weak GPUs): the hero scene, the grid mask and the solid-shadow lifts are off; reveals are instant (existing path, PERF-014).
- Fonts not yet loaded: `font-display: swap` stays; the display font has `size-adjust` and `ascent-override` metrics set against the fallback so the title does not shift (checked with CLS in VP-012).
- `prefers-contrast: more`: lines and muted text get the existing stronger values; the green underline is replaced by a 2 px solid border.
- Print: unchanged rules.
- Forced colours (Windows High Contrast): solid shadows disappear; borders carry the shape.

## Out of scope

- Any copy, metadata, URL, link, schema.org, sitemap, redirect or ecosystem bar change (`public/assets/js/ecosystem-bar*.js`, `public/assets/data/ecosystem.v1.json`).
- A new hero scene (HERO-001 to HERO-004 stay as they are; only its fade-in is new).
- The light "ink and paper" port of the designer's prototype, unless the owner chooses direction A.
- Adding Playwright, GSAP, Motion One, Lenis or any animation or testing library. Verification uses Chrome through the DevTools protocol (already a development dependency through `chrome-launcher`), Lighthouse (already installed) and axe-core injected at audit time as in spec 033.
- Blog post typography inside MDX content (code blocks keep `github-dark-default`, A11Y-002); only the shared tokens apply.

## Acceptance criteria

- `npm run check` passes on every pull request, with the guard tests updated in the same change where a guarded value moves (listed in `plan.md`, "Constraints").
- Lighthouse mobile: performance ≥ 0.95 and accessibility = 1.0 on `/`, `/en/` and `/servicios/`; desktop performance ≥ 0.98. Reported per pull request.
- axe-core: zero violations on the eleven captured page types at 1440 px and 390 px, except the spec 033 exception.
- Reduced motion: with `prefers-reduced-motion: reduce` emulated, `document.getAnimations()` returns no running animation longer than 16 ms on `/` after load and after a scroll pass; the terminal welcome is written in one step.
- Keyboard: Tab order through the home shows a visible focus ring on every control at both widths (captured).
- Content diff: a script compares the built HTML of every page before and after each pull request with styles and font URLs stripped; the diff is empty (VP-010).
- Before and after captures of every page type at both widths are attached to each pull request.

## Open questions

Recorded in `docs/11-open-questions.md` as OQ-013 to OQ-016; they block the requirement each one names.

- OQ-013 (blocks the direction choice): the designer's prototype in `design/home-redesign` implements the paper brandbook. Is it still the planned delivery to port? If yes, direction A is a port and this spec narrows to motion and tokens on top of it.
- OQ-014 (blocks PR 4, VP-010): "footer with the four contacts" names content that is not on the site today (the footer has no contact links). Which four channels, and is a `wa.me` link approved (B-014 keeps the number out of the repository)? Until decided, PR 4 changes only the footer's styling.
- OQ-015 (blocks VP-015): replacing Outfit with Urbanist needs the full variable font from Google Fonts (OFL) subset to 300–800 with `pyftsubset`; the designer's copy covers 300–600 only. Download and licence file placement are an owner action or an authorised download.
- OQ-016 (resolved 2026-10-21): the missing `dist/en/` came from five untranslated live-demo segments created by the catalog update; the entries were added and the English build passes.

## Session state

- Last updated: 2026-10-21, phase 1 session.
- Done: docs, CSS, components, scripts and guard tests surveyed; site opened in the built-in browser at desktop and mobile; before captures of 11 page types at 1440 px and 390 px (fold and full) in `.astro/visual-polish/before/`; diagnosis, three directions, recommendation, animation inventory and budget written here; implementation plan in `plan.md`; tasks in `tasks.md`.
- Verified: capture tool renders real mobile layouts (DevTools emulation; plain headless `--window-size` crops below Chrome's minimum window width); `npm run build` passes on the current tree.
- Decision: direction B chosen by the owner on 2026-10-21; ADR-0012 written in `Proposed`.
- Decisions 2026-10-21: OQ-014 closed (PR 4 restyles the footer only, no new channels); OQ-015 closed (Urbanist downloaded from google/fonts with its OFL licence, subset locally).
- Next: PR 1 (tokens) on branch `visual/01-tokens`, in its own git worktree so the main checkout stays on `main` for the other sessions.
- Blocked: nothing.
