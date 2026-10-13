# Specification: Lightweight hero scene

Status: In progress

## Objective

On capable desktops the hero downloads Three.js (657 KiB) to draw one wireframe icosahedron and 350 points. On 2026-10-13 the owner asked to replace it with a small WebGL renderer that keeps the same look and behaviour.

## Functional requirements (EARS)

- **HERO-001**: When the hero scene is drawn, the wireframe shall match `THREE.IcosahedronGeometry(2.2, 1)` rendered with `wireframe: true`: 80 triangles projected on a 2.2 radius sphere, every triangle edge drawn, colour `#3B82F6` at 0.25 opacity with normal blending.
- **HERO-002**: When the hero scene is drawn, 350 points shall be scattered between radius 2.4 and 7.6, colour `#60A5FA` at 0.45 opacity with additive blending, size 0.025 world units with perspective attenuation, as `THREE.PointsMaterial` does.
- **HERO-003**: While the scene runs, camera (75° field of view, z = 5), rotations, mouse and scroll parallax, pause when hidden or off screen, low-frame-rate fallback and `low-power` context shall behave as before.
- **HERO-004**: When the site is built, no Three.js file shall be published and the scene module shall weigh at most 8 KiB.

## Edge cases and error handling

- No WebGL, a software renderer, a lost context or five slow frames out of the first sixty: the canvas is hidden and the page switches to low-performance mode, as before.

## Out of scope

- New visual effects.

## Acceptance criteria

- `scripts/hero-scene.test.mjs` fails before the change and passes after it.
- Side-by-side screenshots in desktop Chrome of the previous production hero and the new local build show the same scene.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01, T02.
- Next: T03 (owner, GPU-enabled browser).
- Blocked: —
