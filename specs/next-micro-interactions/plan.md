# Implementation plan: Micro-interactions

Status: Implemented

- One appended section in `src/styles/main.css`: colour feedback outside any media query, movement inside `@media (prefers-reduced-motion: no-preference)`; transitions name their properties.
- Guard `scripts/micro-interactions.test.mjs`: transforms only inside the no-preference block, hover/focus twins, no colour literals, no `transition: all`.
- Verification: `npm run check`, `check:budget`, axe in both schemes, a hover and press pass in the browser.
