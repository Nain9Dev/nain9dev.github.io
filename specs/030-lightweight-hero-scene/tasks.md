# Tasks: Lightweight hero scene

- [x] **T01** `[A]` Write `src/scripts/hero-scene.js` (geometry, matrices, renderer, lifecycle) and switch `app.js` to it; remove `three-hero.js` and the vendored Three.js.
  - **Covers**: HERO-001 to HERO-004
  - **Done when**: `scripts/hero-scene.test.mjs` passes.
  - **Result**: tests red before, green after; built chunk 7,069 bytes; `three.module.min` no longer published.
- [x] **T02** `[A]` Compare against Three.js pixel by pixel.
  - **Result**: a temporary harness (served from `dist/`, not committed) rendered the previous Three.js r160 scene and the new renderer into 900×600 canvases with the same seeded 350 points, in two camera and rotation states. First run: identical coverage (19,588 lit pixels each) but about 3,000 line pixels differed by up to 48/255, caused by float32 matrix products. After switching to double-precision matrices uploaded separately as model-view and projection (as Three.js does) and `highp` fragments: 0 pixels differing by more than 8/255, maximum difference 1/255, in both states.
- [ ] **T03** `[M]` See the scene in a GPU-accelerated desktop browser in production.
  - **Done when**: the hero animates and follows the mouse.
  - **Needs from owner**: the owner's Chrome currently renders with "Microsoft Basic Render Driver" (no GPU acceleration), so the site correctly falls back to the static hero there; re-enable hardware acceleration to see the scene.
