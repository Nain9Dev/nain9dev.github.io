# Implementation plan: Inner pages, visual first

Status: In progress

## Modules

- **`src/components/ServiceIcon.astro`**: seven named glyphs (cube, shield, server, brain, cpu, zap, check-circle) plus aliases for the emoji values found in the content; unknown values fall back to the cube. Decorative (`aria-hidden`). Covers IP-001.
- **Services hub** (`src/pages/servicios/index.astro`): glyph before each title, intro behind `Quiet`, compact card rules in `main.css` (`.service-group .service-card`). Covers IP-002.
- **Service page** (`src/pages/servicios/[categoria].astro`): `header.service-head` with glyph and title; `.service-article` reading rules. MDX bodies untouched. Covers IP-003.
- **Blog index** (`src/pages/blog/index.astro`): description behind `Quiet`; cover band from a CSS counter (`content: counter(post) / ""` keeps it silent). Covers IP-004.
- **Article** (`src/pages/blog/[...slug].astro`): classes replace the two inline styles; `.article` rules for byline, measure, headings, code and the share row. Covers IP-005.
- **Guard** `scripts/inner-pages.test.mjs`, in `npm run check`.

## Key decisions

- Glyphs from frontmatter rather than new image assets: zero bytes beyond inline paths, consistent with the home's icon style.
- CSS counters for the blog covers: a visual anchor per card without new text segments in the translation catalog.
- Service MDX bodies keep their inline styles: changing them is content work with fifteen files and its own review.
