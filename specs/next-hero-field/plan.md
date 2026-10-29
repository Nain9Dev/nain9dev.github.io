# Plan: The hero's living surface is a 2D stroke field

## Approach

Replace the module, not the contract around it. The scene and the field share the same slots:

| Piece | Before | After |
| :--- | :--- | :--- |
| Element | `canvas#hero-3d-canvas.hero-3d-canvas` | `canvas#hero-field.hero-field` |
| Module | `src/scripts/hero-scene.js` (327 lines, WebGL, 8 KiB limit) | `src/scripts/hero-field.js` (2D, about 4.5 KB built) |
| Loader | `loadOnDemand('HeroScene', ...)` in the idle queue of `app.js` | `loadOnDemand('HeroField', ...)`, same queue and same `low-performance` gate |
| Gate | head script and WebGL probe set `low-performance`; the scene also checked reduced motion, touch and acceleration itself | the same class; the field needs no probe because a 2D canvas is cheap, and it degrades itself on slow frames |
| Tests | `hero-scene.test.mjs` (geometry and matrices) | `hero-field.test.mjs` (pure functions, lifecycle, delivery, theme) |

## Design choices

- The cell grid and the wave are the designer's (26 px step, 30 px strokes at -52°, 11 opacity buckets), which batches about 1 200 strokes into 11 paths. The pure helpers (`fieldCells`, `strokeDensity`, `strokeOpacity`, `opacityBucket`, `parseColor`) are exported so the guard tests them without a browser.
- The field starts at 55% of the hero width (the designer started at about 35% in his own layout). On this home the text column and the offer tiles end near 56%, so the field must not start earlier or it sits behind the summary.
- Colours come from the theme tokens: `--color-stroke` (brand green on dark, brand blue on paper) and `--color-red` for the press ripple. A `MutationObserver` on `data-theme` and a listener on the system scheme re-read them.
- The pointer cost is the risk the designer measured (a moving pointer on a 4x slower CPU is the heavy case). Phones and coarse pointers never load the field, and the slow-frame fallback of the scene is kept.

## Verification

`npm run check` (guard, build, performance tripwire, locales, claims), a browser pass in both themes (field drawn, text column clear, pointer push, red ripple, no console errors), and `npm run check:budget` (Lighthouse) before the pull request.

## Risks

- TBT with the pointer moving on weak desktops: mitigated by the idle load, the 20 fps breathing, the visibility pause and the slow-frame fallback; the Lighthouse run measures the default case (nobody touching the page).
- The hero keeps the page background in both themes; the designer's deep blue band for the hero is a separate decision.
