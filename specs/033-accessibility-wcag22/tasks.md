# Tasks: WCAG 2.2 AA accessibility audit

Tools: axe-core 4.13.0 (newest release older than two weeks on 2026-10-13) injected into headless Chrome over the DevTools protocol; scripts kept outside the repository (local audit tooling, not a project dependency). Local production build served by `astro preview`.

- [x] **T01** `[A]` Automated audit and fixes.
  - **Covers**: A11Y-001, A11Y-002
  - **Result**: first sweep of all 130 content pages (desktop) plus 10 key pages at 375 px: 148 `color-contrast` nodes. 142 were code comments of the `github-dark` theme (`#6a737d` on `#24292e`, 3.04:1) on every blog post with code in both languages; fixed by `markdown.shikiConfig.theme: 'github-dark-default'` (comments `#8b949e` on `#0d1117`, 6.15:1). After the fix: 0 violations on the 10 key pages at both widths; the full sweep reports only the documented exception below.
  - **Documented exception (WCAG 1.4.3, incidental text)**: the 8 rem background numerals "01/02/03" in `/servicios/auditoria-sistemas/` and `/en/services/auditoria-sistemas/` (`.step-number`, 30 % opacity) are pure decoration: the step order is conveyed by the document order and the step headings. They are marked `aria-hidden="true"`; axe still reports them (6 nodes) because it cannot know they are decorative. Raising their contrast would change the design and is left to the designer.
- [x] **T02** `[A]` Keyboard, focus and motion checks (DevTools-protocol script tabbing through the home page at 1400 px and 375 px).
  - **Covers**: A11Y-003, A11Y-004, A11Y-005
  - **Findings and fixes** (tests in `scripts/accessibility.test.mjs`, red before, green after):
    - Keyboard trap (2.1.2): the terminal input prevented Tab to autocomplete, always, and blocked every key during the typing animation. Tab now completes only a partial command (`src/scripts/terminal-keys.js`) and is never blocked.
    - Focus dropped and stolen (2.4.3, 3.2.1): the typing animation disabled the input (focus fell to `<body>`) and then called `input.focus()`, pulling focus back from wherever the user was. The input is now `readOnly` during the animation and no focus call remains; the log is `aria-busy` while typing so screen readers announce the text once.
    - Missing focus indicator (2.4.7): `.terminal-input:focus-visible` had `outline: none`; now a 2 px `#89b4fa` outline (7.5:1 against the terminal background).
    - Skip link (2.4.1): focus stayed on `<body>`; every `<main id="main-content">` now has `tabindex="-1"` (with no ring, as it is a container).
  - **Result after fixes**: the skip link is the first stop, visible, and moves focus into `<main>`; 74 stops at 1400 px and 73 at 375 px in DOM order, every one with a visible indicator, none hidden by the sticky header once smooth scrolling settles (the skip link itself sits above the header, `z-index` 100 over 50). With `prefers-reduced-motion: reduce`: low-performance mode on, 0 hidden reveal elements, no infinite animation running, the view-transition rule is inside `@media (prefers-reduced-motion: no-preference)`, hero canvas not displayed.
- [ ] **T03** `[A]` Verify in production after deploy.
