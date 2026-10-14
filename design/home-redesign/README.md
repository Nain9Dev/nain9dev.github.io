# Home Redesign Proposal

Designer: David (`davidesuarez`)

## What is in this folder

| File | What it is |
| :--- | :--- |
| `index.html` | Home |
| `servicios.html` | Services hub: the 15 service pages grouped in three families (`/servicios/`) |
| `servicio-validacion-3d.html` | Service page template, filled with `/servicios/validacion-3d/` |
| `casos.html` | Case studies. **A proposal**, see [Proposal: keep the case studies](#proposal-keep-the-case-studies) |
| `escritos.html` | Blog index with the 11 real articles (`/blog/`) |
| `articulo.html` | Article template, filled with a real article (`/blog/clean-architecture-dotnet-ia/`) |
| `tecnologia.html` | Technology page template, filled with C# (`/tecnologia/csharp/`) |
| `contacto.html` | Contact page: free call, WhatsApp, email, LinkedIn. No form |
| `assets/nain.css` | The whole system: fonts, tokens, components, responsive rules |
| `assets/nain.js` | Language switch, mobile menu, hero field, animated mark, console, project filters, privacy notice |
| `assets/fix.js` + `assets/fix.data.js` | FIX mode, described below |
| `assets/fonts/` | Urbanist and IBM Plex Mono, WOFF2, Latin subset, with their OFL licences |
| `assets/trama.svg` | The static stroke pattern above the footer |
| `assets/logo/` | The logo PNGs used by the pages (SVG pending, see [Logos](#logos)) |
| `exports/` | Screenshots of every page, Spanish and English |

Every page carries Spanish and English in the same file, switched by the ES/EN control. In production
these are two routes, `/` and `/en/`. Add `?lang=en` to any URL to open it in English.

Pages that are not prototyped (14 service pages, 10 articles, other technology pages, the checklist
and the privacy policy) are linked to their current page on www.naindev.com and open in a new tab.
A dashed **design note** at the top of some pages says so; it is for review and is not site copy.

## FIX mode: moving things without touching code

Add **`#fix`** to the URL of any page (`servicios.html#fix`) and the page becomes editable:

- **Click** any text block, image, card or button to select it. **Drag** to move it.
- **Arrow keys** nudge 1 px, **Shift + arrows** 10 px. **R** resets the selected element.
- **The handle** at the bottom-right corner of the selection changes its width.
- **Copiar JSON** puts the whole set of positions on the clipboard; **Ver JSON** shows them in a
  panel you can select and copy by hand.
- Changes are kept in the browser while you work, so a reload does not lose them.
- Remove `#fix` from the URL and the toolbar disappears.

Paste that JSON back into the conversation and it lands in `assets/fix.data.js`, which every page
loads. The file starts empty: an empty object means the pages render exactly as designed.

## Round 2 — 2026-10-14

The first round was built on 17 September. Since then Aitor changed a lot in `main`. This round brings
the design up to date with it and makes the prototype buildable inside the security rules the site
already has. The visual system (blue ink, grey paper, green and red secondaries, Urbanist and IBM
Plex Mono) does not change.

### Content, in line with `main` at `2ac4909`

- **Figures.** Every figure without evidence is gone (OQ-001 to OQ-006, specs 005, 006 and 009). The
  case studies keep their structure and show `[METRIC]` where a result used to be. No pattern from
  `scripts/check-claims.mjs` appears anywhere in the prototype.
- **Profile.** The hero uses the live H1 and summary. The About section uses the live text: "CTO en
  Contrast3D x NainDev" and the multi-domain conformance architecture whose first domain is 3D
  assets (specs 010 and 011). The product and its internal profiles are never named.
- **Projects.** New home section with the 19 real projects from `public/assets/data/projects.json`,
  English from `src/i18n/en-US.json`, filters (production, .NET, Python, 3D, demos) and the NainOrder
  demo link. Nine featured projects show first; the rest open with one button. Four claims are left
  out because they are figures or cost claims (see the copy table).
- **Offer and contact.** The main action is "Agendar llamada gratuita" / "Book a free call" to
  Calendly, in the header on every width, in the hero, in the open menu and at the end of every page.
  Availability uses the live sentence: part-time, remote. No prices. Channels: Calendly, WhatsApp
  (`href="#whatsapp"`, no number anywhere, B-014), `contact@naindev.com` and LinkedIn. "Free audit"
  appears nowhere.
- **Checklist.** Home block linking to `/recursos/checklist-ia/`. No form.
- **Services.** All 15 service pages keep their URL and are linked from the hub, grouped in three
  families. Retiring the sector pages stays a proposal, below, not a design change.
- **Blog.** The 11 real titles, dates and descriptions, newest first. The article template carries
  "Clean Architecture en .NET para Sistemas de IA Generativa" in full, with its code blocks, its
  reviewed English translation, a 68-character measure and links to related services. It has no
  figures pending verification (the two posts under OQ-010 are not used).
- **Technology pages.** New `tecnologia.html` for C#, on the article layout: the 7 services whose
  `techStack` includes C#, the 8 projects built with C# and the 4 articles tagged C#.
- **Console.** It only answers `stack`, `servicios` and `contacto` (plus `ayuda`, `ir <sección>` and
  `limpiar`), word for word from the page. No metrics.
- **Footer.** The design credit from [Preferred design credit](#preferred-design-credit) and the
  privacy policy link. The separate "in collaboration with Contrast" line is gone: the About section
  now names the collaboration (spec 010).

### Security and privacy

The prototype runs under the production Content Security Policy, copied from
`src/components/SEO.astro` and hardened by removing `https://cdnjs.cloudflare.com` and
`https://cdn.jsdelivr.net` from `script-src`. Every page carries it as a `<meta>` tag, and the
verification server sends it as an HTTP header.

- **No third parties.** All CSS and JS live in `assets/`. No CDN, no library, no analytics, no pixel.
  Opening any page makes zero requests outside its own folder.
- **Self-hosted fonts.** The Google Fonts `<link>` is gone from every page. Urbanist (one variable
  file, weight axis cut to 300–600) and IBM Plex Mono (400 and 500) are served from `assets/fonts/`
  as Latin-subset WOFF2: 54 KB for both families.
- **No iframes, embeds or forms.** Calendly, LinkedIn and WhatsApp are links. The contact form of
  round 1 is gone.
- **External links** carry `target="_blank" rel="noopener noreferrer"` and a visually hidden
  "(se abre en una pestaña nueva)".
- **Clean JavaScript.** No `on*=` attributes, no `javascript:` URLs, no `eval`, `new Function` or
  string timers, no `innerHTML`. Listeners use `addEventListener`. FIX mode was cleaned the same way.
- **Console.** What the visitor types is painted with `textContent`. History is stored in
  `localStorage` as JSON (`{"v":1,"cmds":[...]}`), validated on load, always inside `try/catch`,
  and the output is rebuilt from the commands. Typing `<img src=x onerror=alert(1)>` shows the text
  and runs nothing, before and after a reload.
- **Privacy notice.** Same text as today. See [Privacy notice](#privacy-notice).
- **Metadata.** Every PNG in `assets/logo/` and `exports/` had a 5.7 KB C2PA (`caBX`) provenance
  chunk. All were stripped; the new exports are palette PNGs with only image data.
- **Repository hygiene.** Nothing in this folder matches `main`'s `.gitignore`. Each push was scanned
  with gitleaks 8.28.0 (no leaks) and with a grep for `ghp_`, `github_pat_`, `glpat-`, `sk-`,
  `AKIA`, `-----BEGIN`, `xox[bp]-`, `token=` and `password=` (no matches).

### Mobile menu

At 390 px, in both languages:

- The header keeps the logo, the ES/EN switch, a compact "Agendar llamada" button (screen readers
  hear "Agendar llamada gratuita") and a "Menú" button with a text label. At 360 px and below the
  call button moves into the menu.
- The menu is a modal dialog. The current page is marked with a 4 px stroke and a heavier weight,
  not by colour alone. The ES/EN switch stays in its bar, and "Agendar llamada gratuita" sits at the
  bottom within thumb reach.
- `aria-expanded` on the button; Escape closes; focus moves into the menu, stays trapped there and
  returns to the button on close. Every target in the header and the menu measures at least 24×24 px
  (most are 44 px).

### Privacy notice

- **Desktop:** a card fixed at the bottom centre, raised surface, 1 px mid-blue border, label,
  sentence, link to `/privacidad` and a 44 px close button.
- **Mobile:** a band inside the page flow, right under the header. It covers nothing, so the call
  button in the header and in the hero stays visible.
- **Closed:** it disappears and the choice is remembered in this browser (`localStorage`, inside
  `try/catch`; if storage is blocked it simply shows again). Exports: `exports/privacy-*`.

### Accessibility and weight

- **WCAG 2.2 AA:** axe-core 4.11.0 reports 0 violations on the 8 pages, in both languages, at 390 and
  1440 px (32 runs). The contrast table below covers every token pair in use. Focus is visible
  everywhere (blue on paper, green on blue). Nothing is shown by colour alone. With
  `prefers-reduced-motion` the hero paints one still frame, the mark does not animate and transitions
  are off.
- **Contrast fix found this round:** soft blue `#4E6B92` on sunken paper `#DEE6F0` is 4.3:1, so labels
  and dates on sunken paper now use mid blue `#3C5F94` (5.1:1).
- **Two font families**, Urbanist and IBM Plex Mono.
- **Weight per page**, compressed: 92–117 KiB including fonts (Aitor's budget is 250 KiB).

| Foreground | Background | Use | Ratio | Needed |
| :--- | :--- | :--- | ---: | ---: |
| `#002B66` | `#EDF1F6` | Body text on paper | 12.0:1 | 4.5:1 |
| `#002B66` | `#F7F9FC` | Text on raised surface (cards, notice, notes) | 13.0:1 | 4.5:1 |
| `#002B66` | `#DEE6F0` | Text on sunken paper | 10.9:1 | 4.5:1 |
| `#0047AB` | `#EDF1F6` | Headings, links, kickers on paper | 7.4:1 | 4.5:1 |
| `#0047AB` | `#F7F9FC` | Links in cards | 8.0:1 | 4.5:1 |
| `#0047AB` | `#DEE6F0` | Links on sunken paper | 6.7:1 | 4.5:1 |
| `#4E6B92` | `#EDF1F6` | Labels, metadata, notes on paper | 4.8:1 | 4.5:1 |
| `#4E6B92` | `#F7F9FC` | Labels in cards | 5.2:1 | 4.5:1 |
| `#3C5F94` | `#DEE6F0` | Labels and dates on sunken paper | 5.1:1 | 4.5:1 |
| `#FFFFFF` | `#0047AB` | Primary button label | 8.4:1 | 4.5:1 |
| `#1D1D1B` | `#80FF00` | Green button label on deep blue | 13.0:1 | 4.5:1 |
| `#EDF1F6` | `#002B66` | Text on deep blue | 12.0:1 | 4.5:1 |
| `#80FF00` | `#002B66` | Headings, links, commands on deep blue | 10.6:1 | 4.5:1 |
| `#C9D5E6` | `#002B66` | Body text on deep blue (method, footer) | 9.2:1 | 4.5:1 |
| `#9FB2CC` | `#002B66` | Labels, console secondary text, placeholder | 6.3:1 | 4.5:1 |
| `#C4001A` | `#F7F9FC` | `[METRIC]` placeholder in case studies | 5.9:1 | 4.5:1 |
| `#0047AB` | `#EDF1F6` | Focus ring on paper | 7.4:1 | 3:1 |
| `#80FF00` | `#002B66` | Focus ring on deep blue | 10.6:1 | 3:1 |
| `#3C5F94` | `#EDF1F6` | Borders of buttons, chips, menu button | 5.7:1 | 3:1 |
| `#9FB2CC` | `#002B66` | Outline button border on deep blue | 6.3:1 | 3:1 |
| `#FF001F` | `#EDF1F6` | Hover shadow of the blue button | 3.5:1 | 3:1 |
| `#C6D2E3` | `#EDF1F6` | Rules and table lines, decorative only | 1.3:1 | — |

### The hero field: cost on the main thread

The field is a bare 2D canvas, no library. Round 2 changed how it runs:

- It **stops** when the hero leaves the screen (`IntersectionObserver`) and when the tab is hidden
  (`visibilitychange`), and starts again when it comes back.
- With `prefers-reduced-motion` it paints **one still frame** and listens to nothing. It also reacts
  if the setting changes while the page is open.
- Strokes are **batched by opacity**: 11 paths and 11 `stroke()` calls per frame instead of one per
  stroke (about 1,800 on desktop). Script time per frame went from 1.45 ms to 0.17 ms.
- With no pointer on it, the field only breathes, so it draws at **20 frames per second**.

Measured on 2026-10-14 in Chromium 141 headless (software canvas, so rasterisation counts as main
thread time), 5-second windows. ADR-0005 runs Lighthouse with mobile emulation and fails above
200 ms TBT.

| Viewport | CPU | State | Busy main thread | Long tasks | Blocking time |
| :--- | :--- | :--- | ---: | ---: | ---: |
| 390×844 @2x | 4× slower | Breathing | 61 % | 2 | 12 ms |
| 390×844 @2x | 4× slower | Pointer moving | 88 % | 30 | 173 ms |
| 390×844 @2x | 4× slower | Scrolled away | 7 % | 0 | 0 ms |
| 1440×900 @1x | 4× slower | Breathing | 70 % | 16 | 113 ms |
| 1440×900 @1x | 4× slower | Pointer moving | 100 % | 112 | 1,012 ms |
| 1440×900 @1x | 4× slower | Scrolled away | 8 % | 0 | 0 ms |
| 1440×900 @1x | 1× | Breathing | 19 % | 0 | 0 ms |

What this means: in the case the budget measures (mobile, nobody touching the page), the field adds
about 12 ms of blocking time per 5 seconds. A desktop with a 4× slower CPU and a moving pointer
saturates the main thread, because a software canvas rasterises 1,440×900 px of round-capped strokes
on every frame. A browser with GPU canvas moves that work off the main thread. If Aitor wants a
harder limit, there are two options: stop breathing after 10 seconds without interaction, or cap the
canvas resolution on large screens. Both are a few lines.

### Verification

Run before each push, with Chromium (Playwright 1.56.1) against a local static server that sends
the hardened CSP as an HTTP header. 8 pages × 2 languages × 2 widths (390 and 1440 px) = 32 loads.

| Check | Result |
| :--- | :--- |
| Console errors / warnings | 0 / 0 |
| Broken resources | 0 |
| `securitypolicyviolation` events | 0 |
| Requests to other hosts | 0 |
| Horizontal overflow | 0 |
| Pages with one H1 / heading level skips | 8 of 8 / 0 |
| Internal links and anchors checked / broken | 517 / 0 (`#whatsapp` allowed on purpose) |
| `target="_blank"` links / without `noopener noreferrer` | 304 / 0 |
| `BLOCKED_CLAIMS`, "auditoría gratuita", "free audit", phone numbers | 0 |
| `on*=` attributes / `javascript:` URLs | 0 / 0 |
| Touch targets in header, menu and notice under 24×24 px | 0 of 272 |
| Console payload `<img src=x onerror=alert(1)>` | shown as text, nothing runs, also after reload |
| Menu: `aria-expanded`, focus trap, Escape, focus return | pass |
| Hero: stops off screen, still frame with reduced motion | pass |
| axe-core 4.11.0, WCAG 2.2 AA | 0 violations in 32 runs |
| Opened from disk (`file://`) | 0 console errors, fonts load |

### Logos

Not touched this round. The brief asks for clean SVGs fit for an OEPM filing, and the right source
is David's `.ai` file, not an auto-trace of the PNGs. The `logo/` folder from the brief (master,
mono black, mono white, symbol, horizontal lockup, preview sheet) is **pending from David**. The pages
keep using the PNGs in `assets/logo/`, now without metadata.

## Proposal: keep the case studies

`casos.html` and the "Casos" menu entry stay. This goes against the current brief ("Case studies:
not shown") and against spec 007, where Aitor removed them on 16 September. It is a proposal, and it
is Aitor's call.

**Why it sells.** The audience is CTOs and tech leads buying custom backend work from someone they do
not know. Today the site shows services (what he offers), projects (what he has built on his own) and
articles (how he thinks). It does not show a decision taken inside a client's system, with someone
else's constraints, and that is what a CTO wants to see before a call. A case study written as
**decision → discarded alternative → trade-off → consequence** shows judgement without client logos
or testimonials, and it carries no figure that cannot be backed: every result without a source is
`[METRIC]` until Aitor has one. The two cases are also the only place where the site says what a
decision cost, which a portfolio of finished projects never does.

**How it stays honest.**

- The confidential client stays anonymous: "Cliente confidencial · industria 3D". No name, no
  location, no product, no detail that identifies them.
- Every figure from the old pages (latency, throughput, savings, uptime, reads served from cache) is
  replaced by `[METRIC]`. None appears in `BLOCKED_CLAIMS`.
- Projects and case studies do not overlap: projects say what exists, cases tell one decision.

**What Aitor would need to change if he accepts it.** Today `/casos` and `/casos/*` redirect to the
services pages in `astro.config.mjs` (and in the Cloudflare rules listed in `docs/60-runbook.md`).
Those redirects would have to go, the `casos` collection would come back and `CASE-001` to `CASE-007`
in spec 007 would be withdrawn. The URLs `/casos/stealth-3d-ai/` and `/casos/optimizacion-saas/`
could come back as they were, or under new slugs that do not suggest anything about the client.

## Security notes for the build

What the design assumes, so it can be built as is:

- **CSP without CDNs.** The design needs nothing from `cdnjs.cloudflare.com` or `cdn.jsdelivr.net`.
  Both can leave `script-src`. Fonts are self-hosted, so `fonts.googleapis.com` and
  `fonts.gstatic.com` can leave `style-src` and `font-src` too. Plausible is the only third party left.
- **Own fonts.** Urbanist and IBM Plex Mono as WOFF2 subsets, like Inter and Outfit today (spec 028).
  In production the Urbanist file is worth a `<link rel="preload">`. The prototype does not carry it
  because a preload with `crossorigin` fails when the file is opened from disk.
- **No iframes, embeds or forms.** `frame-src 'none'` and `form-action 'self'` can stay as they are.
- **No inline script or handlers.** If the site moves to a nonce or hash CSP, nothing in the design
  depends on `'unsafe-inline'` for scripts.
- **Terminal storage.** Production `src/scripts/terminal.js` saves `output.innerHTML` to
  `localStorage` and restores it with `output.innerHTML = savedOutput` (lines 36–52). Anything that
  can write to that key (another script on the origin, a browser extension, a shared machine) gets
  HTML into the page. It is safer to store data (the list of commands) and rebuild the output, as
  the prototype does. The `getItem` on line 36 and the `setItem` calls on lines 46 and 52 are
  also outside `try/catch`, so a browser with storage blocked throws there.

Three findings outside the design that Aitor should know about. David checked them on 2026-10-14
with `curl -I https://www.naindev.com/`:

1. **Production sends no HTTP security headers:** no CSP, no HSTS, no `X-Content-Type-Options`, no
   `X-Frame-Options`. GitHub Pages does not process `public/_headers` (already noted as B-004). A
   Cloudflare rule can add them: **Rules → Transform Rules → Modify Response Header**.
2. **No clickjacking protection.** `frame-ancestors` is ignored in a CSP delivered by `<meta>`, so
   today any site can frame naindev.com. The fix is the header rule above, with
   `Content-Security-Policy: frame-ancestors 'none'` or `X-Frame-Options: DENY`.
3. **A leftover form.** `src/content/blog/clean-architecture-3d.mdx` (line 201) still has a form
   that posts to `formsubmit.co`, with an inline `onsubmit`. The site's own CSP blocks the submission
   (`form-action 'self'`), so it fails for every visitor. Spec 025 removed the other forms; this one
   was missed.

## Direction

**A document, not a poster.** Most developer portfolios are built to impress: near-black background,
particles, ambient glow, a 3D canvas, cards that tilt under the cursor. That form sells attention.
This site sells a CTO's confidence that the person who wrote it knows where their own system breaks.
The form that carries that is a technical document: cool-grey paper, ink-blue text, one accent, dense
tables, margin notes, monospaced data and a single animated surface.

1. **Light, not dark.** Dark plus a bright blue accent is the default costume of every developer
   portfolio, and it is what the site wears today. Leaving that uniform is the fastest way to look
   like a different kind of supplier.
2. **The 3D hero becomes the stroke field.** Aitor already made the current hero much lighter (raw
   WebGL instead of Three.js, spec 030). The proposal still replaces it, for the brand rather than
   for weight: a field of logo strokes on deep blue that contracts where the visitor points, drawn in
   a bare 2D canvas with no library, no image and no network call.
3. **The writing moves up.** Eleven technical articles are the strongest proof on the site and sit
   near the bottom of the home page today. Here they come right after projects and case studies.

The direction is deliberately unlike the visual system of Contrast (David's studio), so the two
brands never read as the same supplier.

**Home sections, in order:** hero · the problem · services · method · projects · case studies ·
writing · checklist · console · about · contact.

**Navigation:** Servicios · Proyectos · Casos · Escritos · Sobre mí · Contacto, plus the ES/EN switch
and the call button. "Arquitectura Frontend" leaves the menu: it is one of the 15 service pages and
stays linked from the hub.

## Colors, typography and spacing

| Token | Value | Use |
| :--- | :--- | :--- |
| **Cobalt blue (logo)** | `#0047AB` | **The main colour. It replaces black.** Headings, links, section numbers, rules, primary button |
| Deep blue | `#002B66` | Body text and panel background |
| Mid blue | `#3C5F94` | Outline of interactive elements; labels on sunken paper |
| Soft blue | `#4E6B92` | Labels, metadata, margin notes on paper and raised surface |
| Soft on blue | `#9FB2CC` | Labels and secondary text on deep blue |
| Body on blue | `#C9D5E6` | Paragraphs on deep blue |
| Paper | `#EDF1F6` | **Page background. It replaces white.** |
| Raised surface | `#F7F9FC` | Cards, tables, privacy notice |
| Sunken surface | `#DEE6F0` | Quiet bands: case studies, about, related reading |
| Rule | `#C6D2E3` | 1 px separators, decorative only |
| **Green (secondary)** | `#80FF00` | **On blue only.** Accent, active path in diagrams, green button |
| **Red (secondary)** | `#FF001F` | Button hover shadow and the hero click halo. Never text, never a line |
| Deep red | `#C4001A` | `[METRIC]` placeholders and error text (5.5:1 on paper) |
| Brand black | `#1D1D1B` | Solid shadow and green-button text |
| Display, headings, body, UI | **Urbanist** 300 / 400 / 500 / 600 | H1 600 uppercase +0.02 em, 28–42 px; H2 300, 26–34 px; body 400, 17 px, line-height 1.6 |
| Article titles | Urbanist 600, sentence case, 28–38 px | Long titles in capitals read badly; articles and technology pages keep sentence case |
| Data / code | **IBM Plex Mono** 400 / 500 | Labels (12 px, +0.14 em, uppercase), figures, code (14 px) |
| Spacing base | 4 px | Scale `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 80 · 128`. Sections 128 px desktop / 80 px mobile |
| Grid | 1200 px, 24 px gutter (16 px under 980 px) | Content 2/3, margin notes 1/3 |
| Measure | 68 characters | Article body 18 px, line-height 1.75 |
| Stroke weights | 1 · 2 · 4 px | All stroke ends rounded |
| Radius | 4 px | Containers have corners; strokes are pills |
| Breakpoints | 360 · 600 · 980 px | Designed at 390 first |

**Button states.** Buttons do not grow or change colour. On `:hover` and `:focus-visible` they get a
solid 6 px shadow in 140 ms; on `:active` the shadow shrinks to 2 px. The shadow colour comes from the
button's fill: blue and green take red, outline buttons on paper take blue, outline buttons on blue
take red. With reduced motion the transition is off.

**The solid shadow.** One per view, two per page at most: the hero card, the diagram, the console.
Brand black, 22 px (12 px on mobile), no blur.

## Copy changes for approval

Current text is quoted from `main` at `2ac4909`. Text not listed is unchanged, or comes straight from
`main` (About paragraphs, project texts, service and article titles and descriptions, the article
body, the availability sentence and the privacy notice).

| Section | Current text | Proposed text (ES) | Proposed text (EN) |
| :--- | :--- | :--- | :--- |
| Header nav | Servicios · Arquitectura Frontend · Blog · Cómo trabajo · Sobre mí | Servicios · Proyectos · Casos · Escritos · Sobre mí · Contacto | Services · Projects · Case studies · Writing · About · Contact |
| Header button | Agendar Llamada | Agendar llamada gratuita (mobile: Agendar llamada) | Book a free call (mobile: Book a call) |
| Hero badges | ⚙️ Python y .NET · 🧪 Guiado por especificaciones | Data block: Lenguajes Python · C# / Backend FastAPI · .NET / Datos PostgreSQL · SQL Server / Frontend e IA Vue 3 · MCP | Languages Python · C# / Backend FastAPI · .NET / Data PostgreSQL · SQL Server / Frontend and AI Vue 3 · MCP |
| Hero panel | Cómo conecto el backend · API / Lógica / Datos | Moves to "El problema" as a diagram: API, IA generativa aislada, dominio, datos | Same, in English |
| The problem (new) | — | Tres fallos que suelen tener la misma causa (three cards and the diagram) | Three failures that usually share a cause |
| Service families | Conformidad determinista de productos · Integración IA Generativa & Agentes · Backend crítico (Python y .NET) | Conformidad determinista y 3D · IA generativa con revisión humana · Backend crítico en Python y .NET | Deterministic conformance and 3D · Generative AI with human review · Critical backend in Python and .NET |
| Service families, added | — | **Entrega** / **No incluye** per family (e.g. "Motor de reglas versionadas, API e informe por producto" / "Modelado, arte ni corrección manual del contenido") | **Delivers** / **Not included** per family |
| Services card (new) | — | Por proyecto y en remoto. Cada servicio se contrata por proyecto, a tiempo parcial y en remoto. El precio se habla en la llamada, cuando el alcance está claro. | Per project, remote. Each service is hired per project, part-time and remote. The price is discussed on the call, once the scope is clear. |
| Method heading | Así organizo un trabajo pequeño | Cuatro pasos y lo que entrega cada uno | Four steps and what each one delivers |
| Method steps | Entender la tarea · Preparar el cambio · Desarrollar y probar · Entregar | Acotar · Diseñar · Construir · Traspasar (one deliverable each, as in round 1) | Scope · Design · Build · Hand over |
| Method link | ¿Quieres ver cómo aplico esta metodología a gran escala? … Leer el artículo técnico | Removed; the article is in Writing | — |
| Projects heading | Portfolio · Proyectos y demos | Proyectos · Lo que he construido | Projects · What I have built |
| Project "Visor 3D" proof | Motor Three.js optimizado (peso inferior a 600 KB gzip, 60 fps en móvil y escritorio), … | Motor Three.js optimizado, … | Optimized Three.js engine, … |
| Project "CRM web colaborativo" | … con estado en PostgreSQL y coste operativo cero. | … con estado en PostgreSQL. | … with state in PostgreSQL. |
| Project "Flota local de runners" | … para repositorios privados, con coste de CI cero. | … para repositorios privados. | … for private repositories. |
| Case studies (proposal) | Removed (spec 007) | Dos decisiones de arquitectura y lo que costaron, with `[METRIC]` for results | Two architecture decisions and what they cost |
| Writing on the home (new) | — | Artículos técnicos del blog; five articles and "Los once artículos" | Technical articles from the blog |
| Checklist block (new) | Footer link "📥 Checklist Arquitectura IA" | Checklist de arquitectura para IA. Diez puntos para revisar un sistema con IA antes de llevarlo a producción … Se pide por correo desde su página; no hay formulario ni lista de correo. | AI architecture checklist. Ten points to review an AI system before it goes to production … |
| Terminal commands | help, story, metrics, diagram, stack, why-me, workflow, demo, philosophy, chat, experience, status, contact, clear | ayuda, stack, servicios, contacto, ir, limpiar | help, stack, services, contact, go, clear |
| About heading | Arquitecto de Software & Especialista Backend | Arquitecto de software full stack | Full stack software architect |
| About, added | — | Cómo trabajo: proyectos a tiempo parcial y en remoto · Python y .NET al mismo nivel, del modelo de datos al frontend · Guiado por especificaciones: cada requisito tiene su prueba | How I work: part-time, remote projects · Python and .NET at the same level · Spec-driven: every requirement has its test |
| Contact heading | ¿Tu backend no escala o tu IA es impredecible? | Una llamada de 30 minutos para ver tu caso | A 30-minute call to look at your case |
| Contact text | La deuda técnica y los cuellos de botella te hacen perder velocidad. Escríbeme y diseñemos un plan … | Es una conversación para entender qué necesitas y ver si encaja con lo que hago. No tiene coste. Si hay proyecto, el presupuesto se habla ahí. | It is a conversation to understand what you need and see whether it fits what I do. It is free. If there is a project, the budget is discussed there. |
| Contact buttons | Agendar Videollamada · Copiar email | Agendar llamada gratuita · Escríbeme por WhatsApp · email · LinkedIn | Book a free call · Message me on WhatsApp · email · LinkedIn |
| Contact page (new, `/contacto/`) | — (contact is a home section) | Agenda una llamada gratuita de 30 minutos; three steps (Me cuentas el caso · Vemos si encaja · Siguiente paso); four channels | Book a free 30-minute call; You tell me the case · We see whether it fits · Next step |
| Footer | Especialidades Técnicas … © NainDev. Analytics privacy-first integradas (0% cookies) … | Four columns (services, content, technology, contact) · © 2026 NainDev · Analítica sin cookies · Política de privacidad · Diseño: David Suárez | Same, in English |
| Privacy notice | 🔒 Este sitio no utiliza cookies … | Same sentence without the emoji, plus "Política de privacidad" | Same, in English |
| Services hub | Consultoría y Desarrollo · Servicios de Ingeniería · Soluciones arquitectónicas de alto nivel … | Servicios · Servicios de arquitectura de software · Quince servicios en tres familias … | Services · Software architecture services · Fifteen services in three families … |
| Service "Arquitectura IA para Fintech", description | … Cumplimiento normativo, seguridad Zero-Trust y baja latencia garantizada. | … Cumplimiento normativo y seguridad Zero-Trust. ("guaranteed" is a promise with no source, same family as OQ-008) | … Regulatory compliance and Zero-Trust security. |
| Service template (`/servicios/validacion-3d/`) | Beneficios clave · Casos de uso comunes | El problema · Cinco familias de regla · Qué devuelve (with a response example using `[METRIC]`) · Artículos sobre validación 3D | Same, in English |
| Blog index | Notas y Arquitectura · Blog Técnico | Blog · Artículos sobre arquitectura backend, 3D e IA | Blog · Articles on backend architecture, 3D and AI |
| Technology page | Tecnología Especializada · Experiencia con C# · Servicios relacionados con C#. | Tecnología · Experiencia con C# · Servicios, proyectos y artículos donde C# forma parte del stack | Technology · Experience with C# · Services, projects and articles where C# is part of the stack |

## Preferred design credit

Proposed, and entirely optional:

- **Name:** David Suárez
- **Link:** `https://contrast3d.com`
- **Where:** footer, small, next to the privacy link. Not in the header, not on every section.

## Third-party assets

| Asset | Source | Licence |
| :--- | :--- | :--- |
| Urbanist, variable, weights 300–600, Latin subset | `@fontsource-variable/urbanist` 5.3.0 (Google Fonts build); weight axis limited with fontTools 4.66 | SIL OFL 1.1, `assets/fonts/urbanist-OFL.txt`. The logo's own typeface |
| IBM Plex Mono 400 and 500, Latin subset | `@fontsource/ibm-plex-mono` 5.3.0 | SIL OFL 1.1, `assets/fonts/ibm-plex-mono-OFL.txt` |
| Stroke pattern `assets/trama.svg` | Generated from the brandbook rule (4 × 26 px strokes at 52°, 22 px grid) | None, own work |
| Diagrams (problem, article) | Hand-drawn inline SVG | None |
| External-link arrow | Inline SVG in the CSS (`mask`, data URI) | None |
| Logos in `assets/logo/` | Aitor's PNG files, recoloured in round 1 | NainDev's |

No icon library, no image bank, no CDN, no third-party script.

## Ideas beyond the brief

- **Retire the sector service pages, as a proposal.** Fintech, healthcare, logistics, SaaS startups,
  monolith migration, REST performance and front-end architecture read as a generalist agency next to
  a specialist headline. The ones that earn traffic could become articles (same URL, same ranking);
  the rest could get a 301 to the nearest service. This needs Search Console data. The design keeps
  all 15 pages until Aitor decides.
- **Empty `src/data/testimonials.json` to `[]`.** The component refuses to render it, but the
  placeholder testimonial and its "40%" claim are readable in a public repository.
- **Structured data:** `Person` and `ProfessionalService` on the home page, `TechArticle` on
  articles, `BreadcrumbList` everywhere. No `Review` or `AggregateRating`.

## Open questions for Aitor

**Resolved in `main`:**

- ~~The figures in the metrics and case studies~~. Removed: spec 005 (`c78c854`), spec 006
  (`5d17ae2`, OQ-001 to OQ-006) and spec 009 (`c2f17a4`). The design shows `[METRIC]`.
- ~~The Contrast line in the footer~~. The About section names "CTO en Contrast3D x NainDev"
  (spec 009 `c2f17a4`, spec 010 `3b711c4`, spec 011 `c9e93fa`), so the footer keeps only the design
  credit.
- ~~Availability~~. Part-time, remote projects for companies in any country (spec 009, `c2f17a4`).
- ~~Contact email~~. `contact@naindev.com` (spec 008, `12e0ace`).

**Still open:**

1. **Case studies.** Do you accept the [proposal](#proposal-keep-the-case-studies) and the removal of
   the `/casos` redirects?
2. **The confidential case and Contrast3D.** With the About section naming the collaboration, could
   a reader link the confidential 3D case to it? If yes, should the case change or stay off?
3. **Sector service pages.** Keep all 15, or retire some as described above?
4. **Search Console.** Top pages by impressions and clicks for the last 6–12 months, to decide 3.
5. **The method section** at engagement level (scope, design, build, hand over): comfortable with it?
6. **Contact page.** Is a `/contacto/` page welcome, or should contact stay a home section only?
7. **"Entrega / No incluye" per family** and the five rule families on the service template: do they
   match what you actually deliver?
8. **Light theme:** any objection in principle?
9. **FinOps title.** "Cómo reducir tu factura de OpenAI un 80% en Azure" is a figure in a published
   title, same family as OQ-011. Keep, reword or verify?
10. **The ink.** The wordmark puts `NAIN` in black; the site uses blue ink. Which reading do you prefer?
    It is two tokens.
11. **Footer link to ONNX.** `src/components/Footer.astro` links `/tecnologia/ONNX/`, which redirects
    since spec 007. Replace it with a live technology page?

## Design checklist before asking for review

- [x] Desktop (1440 px) and mobile (390 px) screens, including the open mobile menu
- [x] Spanish and English version of every screen
- [x] Hover, focus and active states for buttons and links
- [x] Contrast checked (table above, and axe-core on every page)
- [x] Colors, font sizes and spacing listed in this `README.md`
- [x] Only real content, placeholders marked `[TEXT]`, `[METRIC]` or `[PHOTO]`
- [x] WhatsApp shown as a button without a visible phone number
- [x] One H1 per page and all important text as real text, not images
- [ ] No case studies, prices, testimonials or client logos. No prices, testimonials or client logos;
      the case studies stay as a [proposal](#proposal-keep-the-case-studies)
- [ ] If the logo changes: original design, no protected symbols, licensed fonts, all versions in
      `logo/`, works at 16 px. Pending: clean SVGs from David's `.ai`
- [x] Main action offers a free call, not a free audit; availability described as part-time and remote
- [x] Third-party asset sources and preferred design credit listed in `README.md`
- [x] Copy changes listed in this `README.md` for Aitor's approval
- [x] PNG exports included
