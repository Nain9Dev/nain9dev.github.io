# ADR-0012: Visual direction "deep-blue precision" and the motion system

Status: Proposed
Date: 2026-10-21

## Context

The owner asked for a visual and motion redesign of www.naindev.com to improve the first impression on recruiters and CTOs, keeping content, SEO, routes, structured data and the ecosystem bar untouched, and keeping the site a fast, accessible static Astro build (specs/045-visual-polish). The diagnosis found that the site does not use its own brand system (`public/tokens.css`, brandbook v1.5), stacks five decorative background effects, has a flat type hierarchy, seven card families and uncoordinated motion. Three directions were proposed; the owner chose B on 2026-10-21.

Constraints that shape the decision: the home's inline stylesheet is 2.8 KiB under the 25 KiB ceiling (CSS-002); exactly two variable font files with weights 300–800 are allowed (PERF-001, FONT-001); the hero WebGL scene is locked by HERO-001 to HERO-004; the ecosystem bar is dark with green marks and must not change; the designer's paper prototype in `design/home-redesign` remains the light expression of the brand.

## Decision

1. **Direction B, "deep-blue precision".** Dark surface (`#070B16` page, deep blue raised surfaces and bands), brand palette as tokens: cobalt `#0047AB` for primary actions, `#5B8DEF` for links on dark, green `#80FF00` only for live marks, focus and the signature underline, red `#FF001F` only for the pressed halo and errors. No orange. Radius 4 px, solid offset shadows without blur, 4 px spacing scale with three section tiers, one card system.
2. **Fonts.** Outfit is replaced by Urbanist (variable, weights 300–800, Latin subset with the shared `unicode-range`, OFL licence file next to it); Inter stays for body text; labels use the system mono stack. Two font files remain, so spec 028 holds with the new file name and ceiling. Fallback metrics (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) are set so the swap causes no layout shift.
3. **Retired effects.** The particle canvas (`particles.js`), the blurred pointer glow (replaced by a pointer-driven mask on the fixed grid, same `ambient-glow.js`), the inline-style card tilt (`card-tilt.js`) and the dead `tech-stack.js` are removed. The hero scene keeps its geometry and gains only a fade-in.
4. **Motion rules.** Only `transform`, `opacity`, `clip-path` and `mask` animate; durations 120–520 ms with two easings; every animation has a reduced-motion version, including the terminal typewriter; nothing depends on hover alone.
5. **No new dependencies.** CSS, the Web Animations API and `IntersectionObserver` only. Verification uses Chrome through the DevTools protocol (`chrome-launcher` is already installed), Lighthouse (installed) in mobile and desktop form factors, and axe-core injected at audit time as in spec 033, with the scripts kept outside the repository.
6. **Delivery.** Five pull requests (tokens; hero and navigation; cards and skills; transitions and footer; polish), each with `npm run check`, a content diff of the built HTML, Lighthouse scores, an axe sweep and before/after captures, merged only with the owner's explicit approval.

## Consequences

- The site keeps its dark identity, so the social image, the demo thumbnails and the ecosystem bar stay coherent with the new system.
- Guard tests that assert a styled value move with their requirement in the same pull request: the `--color-background` marker in `scripts/performance-build.test.mjs`, the font name and size in `scripts/fonts.test.mjs`, the idle-queue list in `scripts/post-paint.test.mjs`, the footer inline-style count and the dead-module list in `scripts/portfolio-refresh.test.mjs` and `scripts/english-standardization.test.mjs`.
- The CSS budget forces every addition to be paid for by a removal; if the system does not fit, splitting critical and non-critical CSS needs its own ADR (spec 031).
- The paper prototype is not ported by this work; porting it later would be a separate spec that reuses these tokens with light values.

## Alternatives considered

- **A, "ink and paper" (port of the paper brandbook).** Inverts the site to light, touches every selector, the social image and the brand icons, and duplicates the designer's prototype. Kept as a possible later spec.
- **C, "Swiss brutal".** Off-brand (the brandbook asks for paper grey, 4 px radius and solid shadows), aggressive for the insurance and banking audience, and large-type layouts risk layout shift while fonts load.
- **Playwright with `@axe-core/playwright` for verification.** Two new development dependencies for checks that the existing Chrome, Lighthouse and injected axe already provide; rejected unless the owner asks for CI-level motion tests.
- **Keeping Outfit.** Avoids the font work but keeps the site off its brandbook typography.
