# NainDev Brandbook — Addendum 1.1: Motion

Status: proposal by David, 2026-10-14. Pending Aitor's approval.
Amends: brandbook v1.5 (`design/naindev-brandbook_17_09_2026.html`), sections 7.2 and 7.5, and adds a use of 7.9.

The brandbook already says how a rule changes: "the prohibition becomes a quota, and it is written
down here instead of being broken in silence". This addendum does exactly that for motion. It adds
two kinds of movement that do not stay alive and keeps the quota of one living surface per page.

## 1. Three classes of motion

| Class | What it is | Where it is allowed | Limit |
| :--- | :--- | :--- | :--- |
| **Construction** (new) | Plays once when an element enters the screen and ends still | Anywhere on the page | 1.2 s from the first element to the last, then nothing moves |
| **Response** (new) | Plays only while the visitor acts (hover, focus, press) and returns to rest | Interactive elements only | Returns to rest with the 7.5 spring; no loop |
| **Living surface** (7.5 quota) | Continuous or reactive loop | One per page: the hero field on the home, the mark that becomes an agenda in the head of inner pages | Still one per page. It stops off screen, and `?vivo=0` turns it off |

A construction movement is not a living surface: once it ends, the page is as still as a printed
document. That is why it needs no quota.

## 2. Construction

All pieces share one rhythm:

- **Step:** 85 ms between elements, ordered by a fixed index (`--o`), never at random.
- **Easing:** `cubic-bezier(.22, 1, .36, 1)`.
- **Duration:** 600 ms per element; the cascade is capped so the last element ends by 1.2 s.
- **Only** `transform`, `opacity`, `clip-path` and SVG stroke offsets move. No layout property, no
  JavaScript per frame.

| Piece | Movement | Final state |
| :--- | :--- | :--- |
| Section entrance | Headings slide down line by line inside a mask (−112 % → 0); other elements drop 18 px and fade in | The section as designed |
| The interruption that opens (7.1) | The stroke draws as one continuous line, then the gap (6 × stroke) opens at its point; the text label appears next to it | The 7.1 interruption |
| The measuring dimension (7.3) | The line draws from its origin, the ticks appear left to right, the Plex Mono label types character by character (600 ms at most) | The 7.3 dimension with its label |
| The pattern that builds (7.2, amended) | Strokes appear in density order, densest first, in about 900 ms | The static 7.2 pattern, for good |
| The diagram that runs (7.4) | A pulse travels the data path and stops at the interruption, where the label of what breaks appears. Replays on hover and focus | The 7.4 diagram |
| The mesh that validates (7.4 + 7.1) | The mesh appears, a scanning dimension sweeps it once, and each defect gets an interruption and a mono label when the scan passes it | The mesh with its defects marked |
| The mark that assembles (7.9) | The three strokes of the N draw into place, once per browser session (600 ms) | The logo |

## 3. Response

| Piece | Movement |
| :--- | :--- |
| The mark on hover (7.9, unchanged) | The N folds into one stroke and opens again with a short overshoot (1.15 s). Frames run only while it plays |
| Buttons on press | Contract to 97 % and return with a short overshoot; the 6 px solid shadow of 7.7 is kept |
| Navigation and footer links | The underline draws as a 2 px dimension from left to right on hover and focus |
| Project cards on hover and focus | The 6 px solid shadow of 7.7. The 22 px shadow of 7.6 stays forbidden on listing cards |
| Focus | Always the same 2 px stroke: blue on paper, green on blue |

## 4. Amendments to the existing text

**7.2 The pattern.** Was: "The static pattern is never animated." Becomes: "The pattern is never
animated in a loop. It may build once, as a construction movement, and then stays static. Every other
7.2 rule stands: deterministic seed, CSS or SVG with no canvas, never behind text, blocks of at least
240 × 160 px, one per view, never red."

**7.5 The stroke field.** Was: "the only animated surface". Becomes: "the only **living** surface.
Construction and response movements, as defined in addendum 1.1, are allowed anywhere."

**7.9 The mark in motion.** The hover gesture does not change: the N folds into one stroke and opens
again. The addendum adds a second use of the same fold, below.

## 4b. The mark that becomes an agenda (living surface of the inner pages)

The inner pages have no hero field, so their head carries the living surface instead. It replaces
the pattern block that stood to the right of the page title. It loops every 8 s:

1. The N holds still (1.4 s).
2. The N folds into one stroke, the 7.9 gesture, diagonal first.
3. The stroke turns and stretches into one horizontal line.
4. That line becomes the header line of an agenda. The frame draws out from both ends of the line,
   then the two rings, the days as pill strokes, and one day booked with a check.
5. The agenda holds, fades, and the line folds back into the N with the 7.9 overshoot.

It uses one stroke weight (the mark's, 113 on 1000), brand blue only, round ends, and no fill.
It is CSS only: no script runs per frame. It stops off screen. With reduced motion, `?vivo=0` or
without the script, it shows the agenda, still. The agenda says what the page asks for: a call.

## 5. What does not change, in any class

- No new colours, no gradients, no second colour on a surface.
- Red only for its two uses: display figures and the hero click halo.
- No new typefaces, no stock photos.
- No pattern behind text.

## 6. Accessibility and performance

- With `prefers-reduced-motion: reduce` every piece is shown directly in its final state. No
  construction plays, no response moves, the hero paints a single frame and no animation frame is
  requested.
- Nothing requests animation frames when nothing moves. Off screen and in a hidden tab the hero stops.
- No long task over 50 ms while loading or scrolling on a mobile profile with a 4× slower CPU.
- New JavaScript for this addendum stays under 12 KB compressed.
- If the script fails to load, the page shows every element in its final state.

## 7. Switches for review

- `?vivo=0` stops the living surface (the hero shows one still frame, the agenda stays still), to
  compare the page with and without it.
- The variant of each construction piece is a token on `<body>`: `data-brk`, `data-trama`,
  `data-pulse`, `data-scan`. See `lab.html` and the README.
