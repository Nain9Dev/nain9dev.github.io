# Home Redesign Proposal

Designer: David (`davidesuarez`)

## What is in this folder

| File | What it is |
| :--- | :--- |
| `index.html` | Home |
| `servicios.html` | The three engagements, with what each delivers and what it leaves out |
| `servicio-validacion-3d.html` | One service in full: the five rule families, what the validator returns |
| `casos.html` | The two case studies, with the discarded alternative and the trade-off |
| `escritos.html` | Index of the eleven articles |
| `articulo.html` | One article, as a layout template |
| `contacto.html` | The audit, how it works, and the form |
| `assets/nain.css` | The whole system: tokens, components, responsive rules |
| `assets/nain.js` | Menu, language switch, hero field, console, animated mark |
| `assets/fix.js` + `assets/fix.data.js` | Layout-fix mode, described below |
| `assets/logo/` | The logo files used by the pages |
| `exports/` | Screenshots of every page, desktop and mobile |

Every page is Spanish and English in the same file, switched by the ES/EN control, exactly as the
home does. In production these become two routes, `/` and `/en/`.

## FIX mode — moving things without touching code

Add **`#fix`** to the URL of any page (`servicios.html#fix`) and the page becomes editable:

- **Click** any text block, image, card or button to select it. **Drag** to move it.
- **Arrow keys** nudge 1 px, **Shift + arrows** 10 px. **R** resets the selected element.
- **The handle** at the bottom-right corner of the selection changes its width.
- **Copiar JSON** puts the whole set of positions on the clipboard; **Ver JSON** shows them in a
  panel you can select and copy by hand.
- Changes are kept in the browser while you work, so a reload does not lose them.
- Remove `#fix` from the URL and the toolbar disappears.

Paste that JSON back into the conversation and it lands in `assets/fix.data.js`, which every page
loads. From then on the positions are part of the prototype and the next screenshot has them baked
in. The file starts empty — an empty object means the pages render exactly as designed.

Element ids look like `servicios/h2.card#3`: the section, the element and its order inside it. They
stay stable as long as the section's structure does not change, so a fix survives copy edits.

## Status

**Home prototype built.** `index.html` is a single self-contained file: it opens by double click, needs
no build step, and works from 390 px to 1440 px. It carries both languages with a working ES/EN switch
and a working mobile menu, so the two things you flagged as the priority can be tried rather than
imagined.

Built on the visual system in the accompanying brandbook, which is derived from the new logo — its
stroke weight (14 % of the isotype height), its round ends, its 52° diagonal and its typeface,
Urbanist.

**Three things are deliberately missing, pending your answers below:** every figure from the case
studies (open question 2), the sixteen sector service pages (question 1), and the footer line about
Contrast is in as a proposal only (question 3).

## Direction

**A document, not a poster.**

Most developer portfolios, this one included, are built to impress: near-black background, particles,
ambient glow, a 3D canvas, a simulated terminal, cards that tilt under the cursor. That form sells
attention. This site sells something else — a CTO's confidence that the person who wrote it knows
where their own system breaks. The form that carries that is a technical document: cool-grey paper,
ink-blue text, one accent, dense tables, margin notes, monospaced data, no decorative motion.

Three consequences worth stating up front, because they are the whole proposal:

1. **Light, not dark.** Not for novelty. Dark plus a bright blue accent is the default costume of
   every developer portfolio, and it is also what the site wears today. The fastest way to look like a
   different category of supplier is to leave that category's uniform behind.
2. **The 3D canvas goes.** A decorative WebGL hero argues for front-end flair on a site that sells
   back-end rigour, and it is the single heaviest thing on the critical path. What replaces it is the
   brand's own device: a field of logo strokes on deep blue that **breaks where the visitor points**,
   drawn in a bare 2D canvas with no library, no image and no network call (see *The hero*, below).
   The architecture diagram — API / domain / data — stays, but as a static SVG further down, where it
   supports the argument instead of decorating it.
3. **The writing moves up.** Eleven technical articles are the strongest proof on this site and they
   currently sit second from the bottom of the home page. In a positioning built on judgement, the
   articles are the work sample, not filler.

The direction is deliberately unlike the visual system of Contrast (David's studio), so the two brands
never read as the same supplier. The full rationale and the token set live in the brandbook that backs
this proposal; the values are reproduced below so this folder stands on its own.

## What changed

**Removed**

- 3D hero canvas (`three-hero.js`), simulated terminal (`terminal.js`), particles, ambient glow,
  card tilt. Three JavaScript bundles and Three.js leave the critical path.
- Emoji trust badges (🏆 🤝 ⚙️) and the emoji icons on services and metrics.
- Impact metrics (`40 → 6 min`, `99.99%`, `10+`, `3`) — no citable source on the page. See open
  question 2.
- Proof strip in its current form.
- Tech-stack icon wall — 25 vendor logos replaced by one line of monospaced text.
- Projects section — merged into Case studies; they do the same job twice.

**Kept**

- Astro 5, static build, GitHub Pages, own domain, strict CSP, self-hosted fonts, typed MDX content.
  The redesign is visual, structural and editorial. It does not touch the stack.
- Bilingual ES/EN routing.
- The eleven articles, promoted to a home-page section.
- Both case studies and their decision → alternative → trade-off → consequence structure. That
  structure is the argument; only the figures need a decision (open question 2).
- The four-step method, rewritten at engagement level instead of task level.
- Testimonials component, still disabled. The guard in `Testimonials.astro` is the right call.
  Related: `src/data/testimonials.json` still ships a placeholder entry — "Cliente de Prueba, CTO en
  Empresa Tech" with a 40 % latency claim — in a public repository. Suggest emptying it to `[]`.

**Added**

- Static SVG architecture diagram in the hero, replacing the canvas.
- A block of verifiable facts under the hero: stack, data layer, messaging, languages, time zone
  (`UE · GMT+1`). Working in the same time zone under EU law is a real argument against offshoring and
  needs no numbers to back it.
- Explicit "what you get / what is not included" under each of the three services.
- An honest availability line, in place of the contradiction described in the copy table.

**Navigation:** Servicios · Casos · Escritos · Método · Sobre, plus the ES/EN switch and the booking
button. Five entries. "Arquitectura Frontend" leaves the menu — it is a keyword landing page, not a
service.

**Type.** The H1 is the one heading that shouts: **Urbanist 600, all caps**, +0.02 em, line-height 1.12,
30–42 px. Semibold rather than bold because 700 closes up the counters at this size; the tracking goes
up because caps need air; the size comes down because caps run considerably wider than lowercase. H2 and
H3 stay at 300 and lowercase — if everything shouts, nothing does.

**Button hover.** Buttons do not grow or change colour on hover: **they get the solid shadow at 6 px**,
in 140 ms, applied identically on `:hover` and `:focus-visible` so keyboard users see what mouse users
see. **The shadow colour comes from the button's own fill, not from the surface** — each fill has its
opposite, and that opposite is its shadow: blue, green and black take **red**; red takes **green**; white
or paper takes **blue**. An outline button with no fill counts as the colour of its surface, so it takes
blue on paper and red on deep blue. Every pairing clears 3:1 against its background.

## Colors, typography and spacing

| Token | Value | Use |
| :--- | :--- | :--- |
| **Cobalt blue (logo)** | `#0047AB` | **The main colour. It replaces black.** Headings, links, section numbers, rules, primary button, logo |
| Deep blue | `#002B66` | Body text and panel background — the same hue, deeper. This is what replaces black ink and the black panel |
| Mid blue | `#3C5F94` | Supporting text, and the outline of interactive elements |
| Soft blue | `#4E6B92` | Labels, metadata, margin notes |
| Paper | `#EDF1F6` | **Page background. It replaces white.** |
| Raised surface | `#F7F9FC` | Cards, tables, highlighted blocks |
| Sunken surface | `#DEE6F0` | Table headers, metadata blocks |
| Rule | `#C6D2E3` | 1 px separators, table borders, blueprint grid |
| Rule strong | `#9FB2CC` | Decorative separators only — 1.9:1, not valid as a control border |
| **Green (secondary)** | `#80FF00` | **On blue only.** Panel accent: highlighted data, active path in a diagram, code syntax |
| **Red (secondary)** | `#FF001F` | **Graphic only on paper:** rules, markers, emphasis bars, large display figures. Never body text |
| Deep green | `#2E6B00` | "OK" status text on paper (5.8:1) |
| Deep red | `#C4001A` | Error status text on paper (5.5:1) |
| Brand black | `#1D1D1B` | The logo's black. Single-ink print, third-party material. **Not an interface colour** |
| White (logo) | `#FFFFFF` | Logo, and text on the cobalt button (8.4:1). Never a surface |
| All text: display, headings, body, UI | **Urbanist** 300 / 400 / 500 / 600 | **The logo's own typeface.** Titles at 300 in lower case, body at 400, 17 px, line-height 1.6, 68-character measure |
| Data / code | **IBM Plex Mono** 400 / 500 | Figures, labels, versions, section numbers, code. Tabular figures on |
| Brand tracking | +0.32 em, uppercase, Urbanist 500 | The kicker register, taken from the wordmark |
| Label tracking | +0.14 em, uppercase, Plex Mono 500 | Data labels and table headers |
| Spacing base | 4 px | Scale `4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`. Section spacing 128 px desktop / 80 px mobile |
| Grid | 12 columns, 1200 px, 24 px gutter | Content in 8 columns, margin notes in 4 |
| Stroke weights | 1 px · 2 px · 4 px | One visible weight per component. **All stroke ends rounded** (`border-radius:999px`, `stroke-linecap:round`) |
| Container radius | 4 px | Containers have corners; strokes are pills. No shadows, no gradients, no glow |
| Logo constant | Stroke = 14 % of the shape's height | Taken from the isotype; applies to icons, charts and tick marks |
| Breakpoints | 390 · 768 · 1024 · 1440 px | Designed at 390 first |

**Where the two secondaries come from.** They are the exact hue complements of the two accents used by
Contrast, David's studio — measured, not asserted: cyan `#00FFE0` sits at 172.7°, red `#FF001F` at
352.7°, a difference of 180.0°; purple `#8000FF` at 270.1°, green `#80FF00` at 89.9°, a difference of
180.2°. Your cobalt at 215.1° collides with none of them. The result is a palette that is the
chromatic negative of the other brand, which is the point — the two sites must never read as the same
supplier.

**Contrast ratios, measured (WCAG 2.1, 16-09-2026).** Deep blue on paper 12.0:1 · cobalt on paper
7.4:1 · cobalt on raised surface 8.0:1 · mid blue on paper 5.7:1 · soft blue on paper 4.8:1 · white on
cobalt 8.4:1 · paper on deep blue 12.0:1 · green on deep blue 10.6:1 · green on cobalt 6.5:1 · deep
green on paper 5.8:1 · deep red on paper 5.5:1.

**Three rules fall straight out of those numbers, and they are not negotiable.** Green `#80FF00`
reaches **1.1:1 on paper** — it is invisible on light and lives only on blue or on the brand black.
Red `#FF001F` reaches **3.5:1 on paper**: fine as a graphic element (the 3:1 threshold for non-text),
not as text, and white on red is 4.0:1 so **there is no red button**. Blue `#0047AB` on brand black
`#1D1D1B` is **2.0:1** — those two never sit together.

**The new logo drives the whole system.** It is a line drawing: three constant-weight strokes with
rounded ends and clean gaps, and a wordmark in thin monoline capitals with tracking almost as wide as
the letters are tall. So the system follows it — what would be a filled box elsewhere is a stroke
here, every stroke end is round, weights are light, and the kicker register borrows the wordmark's
tracking. Measured off the files: stroke = 14 % of the isotype height, gap isotype→wordmark = 20 %,
wordmark cap height = 11.6 %, wordmark width = 1.45× the isotype. `#00BFFF` is gone because it is no
longer in the mark.

**One defect in the current logo files, worth fixing before anything ships.** In `Full-*.png` the
neutral half of the wordmark ("NAIN") is hard-coded and does not flip with the background, so three of
the five versions fail on every background: `Full-Green` and `Full-White` lose a half on paper *and*
on dark, and `Full-Black` loses the isotype on dark and the wordmark on light. Seven corrected
versions and a side-by-side contact sheet are in `assets/logos/`. The real fix is re-exporting from
the `.ai`, which also gives the two things still missing: **SVG** (the site should not load PNG logos)
and a **horizontal lockup**, which does not exist and which the 64 px header needs.

## Copy changes for approval

Current text quoted from `src/components/home/*.astro` on `main` at `77a8b61`.

| Section | Current text | Proposed text (ES) | Proposed text (EN) |
| :--- | :--- | :--- | :--- |
| Hero eyebrow | Aitor Nain Mendoza Vallejo · Arquitecto Backend 3D & AI Systems | Arquitectura backend · 3D · IA | Backend architecture · 3D · AI |
| Hero H1 | Diseño la infraestructura que valida y procesa modelos 3D a escala industrial. | Backend para sistemas que procesan 3D e IA a escala. | Backend for systems that process 3D and AI at scale. |
| Hero summary | Arquitectura backend para sistemas que no pueden fallar... ahora también para el mundo 3D. Ayudo a empresas a integrar IA generativa y procesar assets 3D mediante sistemas agénticos con absoluta precisión y determinismo. | Diseño arquitecturas deterministas donde la IA es un proveedor de datos y el dominio conserva las reglas. .NET, mensajería y validación geométrica. | I design deterministic architectures where AI is a data provider and the domain keeps the rules. .NET, messaging and geometric validation. |
| Hero availability | Disponibilidad inmediata para consultoría técnica y arquitecturas .NET de misión crítica. | Trabajo por encargos acotados: auditoría, diseño de arquitectura o implementación por hitos. | I work on scoped engagements: audit, architecture design or milestone implementation. |
| Proof strip · Alcance claro | Solo acepto trabajos que pueda atender bien los fines de semana. | Un encargo a la vez, con alcance cerrado y fecha de entrega comprometida. | One engagement at a time, with fixed scope and a committed delivery date. |
| Trust badges | 🏆 Arquitecto .NET · 🤝 Colaborador OSS · ⚙️ Stack Principal | Bloque de datos en monoespaciada: `.NET 8 · C#` · `SQL Server · Redis` · `RabbitMQ` · `UE · GMT+1` | Monospaced data block: `.NET 8 · C#` · `SQL Server · Redis` · `RabbitMQ` · `EU · GMT+1` |
| Services intro | En qué puedo ayudarte | Tres problemas y cómo se resuelven | Three problems and how they get solved |
| Service 1 | Arquitectura de Validación 3D — Pipelines deterministas para el procesado masivo y corrección geométrica de assets 3D a escala industrial. | *Título sin cambios.* Se añade: **Entrega** motor de reglas, API e informe por asset. **No incluye** modelado, arte ni corrección manual del contenido. | *Title unchanged.* Added: **Delivers** rule engine, API and per-asset report. **Not included** modelling, art or manual content fixes. |
| Service 2 | Integración IA Generativa & Agentes — Ecosistemas agénticos robustos para integrar modelos de IA en flujos corporativos. | *Título sin cambios.* Se añade: **Entrega** capa de aislamiento, cola y reintentos, control de coste por llamada, punto de revisión humana. **No incluye** entrenar ni afinar modelos. | *Title unchanged.* Added: **Delivers** isolation layer, queue and retries, per-call cost control, human review point. **Not included** training or fine-tuning models. |
| Service 3 | Backend Crítico (.NET/SQL) — Sistemas distribuidos de misión crítica donde la consistencia del dato y la escalabilidad son innegociables. | *Título sin cambios.* Se añade: **Entrega** diseño con ADRs, implementación por hitos, pruebas que fallan si se rompe el invariante. **No incluye** frontend ni infraestructura gestionada. | *Title unchanged.* Added: **Delivers** design with ADRs, milestone implementation, tests that fail when the invariant breaks. **Not included** front-end or managed infrastructure. |
| Method step 1 | Entender la tarea — Objetivo, contexto, restricciones y resultado esperado. | Acotar — Qué entra, qué queda fuera y con qué criterio se da por terminado. | Scope — What is in, what is out, and how done is defined. |
| Method step 2 | Preparar el cambio — Reviso el código afectado y elijo la solución más sencilla que encaje. | Diseñar — Decisiones registradas como ADR, con la alternativa descartada y por qué. | Design — Decisions recorded as ADRs, with the discarded alternative and why. |
| Method step 3 | Desarrollar y probar — Implemento el cambio y compruebo los casos importantes. | Construir — Implementación por hitos, con una prueba que falla si se rompe el invariante. | Build — Milestone implementation, with a test that fails when the invariant breaks. |
| Method step 4 | Entregar — Explico qué se ha modificado, cómo se ha probado y qué queda pendiente. | Traspasar — Qué cambió, cómo se ha probado, qué queda abierto y quién lo mantiene. | Hand over — What changed, how it was tested, what is open and who maintains it. |

**A note on two of these, because they are judgement calls, not style.**

*Hero availability vs. proof strip.* The hero says immediate availability; the proof strip says work is
taken on weekends. Both are on the same page today, and the second reads to a CTO as a side project.
Whatever the real answer is, the page should say one thing. The proposed wording sells a constraint as
discipline, which is both truer and stronger — but only Aitor knows if "one engagement at a time" is
accurate.

*The method section.* As written it describes executing a ticket: understand the task, review the
affected code, implement, explain. That is the voice of a developer taking instructions, on a site
whose headline says architect. The proposed version describes an engagement, and every step names a
deliverable, which is what removes the "what exactly do I get" doubt.

## Screens

- `index.html` — the prototype. **One responsive file instead of two**: the same markup serves 390 px
  and 1440 px, so there is no `mobile.html` to keep in sync with it. Fonts load from Google Fonts so
  the file opens locally with a double click; in production they are self-hosted woff2 exactly as
  Inter and Outfit are today, and the CSP does not change.
- `exports/home-desk.png`, `home-mob.png`, `home-menu.png` — Spanish, 1440 px, 390 px and the open
  mobile menu.
- `exports/home-desk-en.png`, `home-mob-en.png`, `home-menu-en.png` — the same three in English.

**Language.** The prototype switches language in place so both versions can be reviewed from one file.
In production this stays what it is today: two routes, `/` and `/en/`, with the switch changing URL.

**Sections, in order:** hero · the problem · three services · method and the three ways to start ·
two case studies · writing · **the console** · about and availability · contact. Projects, the terminal, the impact
metrics, the proof strip and the tech-stack icon wall are gone, as described above.

**Mobile menu**, which is the priority in the brief: the ES/EN switch now sits in the header and does
not need the menu opened; the menu button carries a text label next to the icon; the panel is
full-screen with 56 px targets; the current page is marked with a cobalt stroke on its left, not by
colour alone; the booking button is pinned to the bottom within thumb reach; it closes on escape, on
the button, and on choosing a destination; focus is trapped while open and returns to the button on
close.

**The hero.** A full-bleed deep-blue surface with a single `<canvas>` behind an opaque paper card that
carries the copy. On the canvas, the brand's own pattern — 4 × 30 px round-capped strokes at the
logotype's real 52° angle, green on deep blue — drifts with a slow density wave. Strokes within 210 px
of the pointer **contract toward their centre**, down to 18 % of their length at the focus, and brighten
to full green as they do. When the pointer leaves they **spring back into place** on a damped spring
(stiffness 0.13 returning, 0.34 contracting, damping 0.74, ≤6 % overshoot), taking about a second and
arriving out of step with each other, so the surface recomposes rather than snapping. Clicking sends an
expanding ripple that contracts whatever it crosses **and turns those strokes brand red for as long as
the ripple lasts**, fading back to green in about a second — the one place red appears on blue, and it
marks the visitor's own gesture rather than decorating the surface. A monospaced counter reads out how
many strokes are contracted right now. Measured, not decorative.

**The solid shadow.** The copy card sits on the blue with a **solid black shadow** offset 22 px right
and 22 px down — no blur, no transparency. It is a block of ink, not a photographic shadow, which is the
only kind of depth this system allows: everything else here is stroke and flat mass. The architecture
diagram gets the same treatment in the other direction (a colour block on paper). On mobile the offset
drops to 12 px and the block pulls 14 px off the edge so the shadow is not clipped. One per view, two
per page at most; never on listing cards, tables or buttons. Written into the brandbook under
*Componentes* and shown in 7.6 of the HTML one.

Cost: one canvas element, one `requestAnimationFrame`, no dependency, no image, no request. With
`prefers-reduced-motion: reduce` it paints a single still frame, no wave and no pointer reaction. If
the script fails, the surface is just clean deep blue and the page reads the same.

This needed a rule change, and the rule was changed rather than quietly broken: the brandbook said *no
decorative animation*, and now says **exactly one animated surface per page — the hero field** — with
the conditions written out in §9 of the text brandbook and 7.5 of the HTML one. Two more rules moved
with it: the solid shadow (§7 / 7.6) and red no longer being drawn as a line anywhere (§3.6, §8.1,
§8.3, §8.4). The brandbook is at **v1.0**.

**The architecture diagram** — API and the AI vendor on top, the domain in the middle holding the
rules, the data below — moves into *The problem* section. The line coming from the AI is deliberately
broken, because that is the argument: the vendor is isolated and the domain decides.

**Section cards.** Services, case studies and writing each close with a card on deep blue: white
isotype, green label, one line in green, three lines of body in paper, a green rule and a monospaced
line of the figures that govern the section. The pattern comes from the surface cards in the brandbook
and is now a documented component there. The monospaced line is the point of it — if a section has no
figures worth printing, it does not get a card. No solid shadow on these: the colour already separates
them, and the shadow is reserved for one block per view.

**The console is back.** The simulated terminal was the one thing worth keeping from the current site,
so it returns — rebuilt in this system and stripped of the theatre. It answers only with what is
already on the page: the same three services, the same method, the same two case studies, the same
articles, word for word. No simulated assistant, no fake demo, no metrics without a source. Deep blue
surface with the solid shadow, Plex Mono, commands in green, the interruption device instead of the
three operating-system circles in the title bar. Real keyboard behaviour — ↑ recalls, Tab completes,
`ir <section>` scrolls the page — plus tappable command chips underneath, because nobody types on a
phone. Bilingual, and the language switch reloads it.

**The mark moves on hover.** The header isotype is now a live SVG rather than a PNG, built from the
measured geometry (113 stroke on a 1000 canvas, bars at x=148 and x=848, diagonal (308,288) to
(686,738)). On hover the three strokes fold into a single vertical stroke and unfold back into the N
with a short overshoot: 1.15 s, once per gesture, disabled under `prefers-reduced-motion`. It says in
one gesture what the whole system repeats — the mark is three strokes that never touch.

**Colour as surface.** Backgrounds are paper or blue, and nothing else. Paper carries the long reading
in its three tones (`#F7F9FC` raised, `#EDF1F6` base, `#DEE6F0` sunken); deep blue takes the method
section, the console block, the hero and contact. **Green is never a background.** It was tried as a
full-bleed surface for the About section and the contrast was fine on paper — 13.0:1 with dark ink —
but at full page it is punishing to look at and swallows everything on top of it; that section now uses
the sunken paper, which separates without introducing colour. Green survives where it earns its keep:
as a highlight on blue — labels, strokes, ticks, the hero field, the fill of a button or a chip. A
bright colour reads louder in small doses than in large ones.

And **red is not drawn as a line anywhere**: not a rule, not a mark, not a border, on the site or in the
brandbook. The interruption is the gap alone; the emphasis marker takes the ink of its surface; diagram
callouts are brand blue on paper and green on blue. Red is left with three jobs: the button shadow when
the button leads to contact, the click halo in the hero, and the deep-red status text at 5.5:1.

**Mobile menu**, which is the priority in the brief, is specified as: 64 px header on opaque paper with
a 1 px rule, nothing translucent; a 44×44 px menu button with a text label, not only an icon;
full-screen panel with 56 px tall targets; current page marked by a cobalt rule on the left and not by
colour alone; **the ES/EN switch visible in the header without opening the menu**, which is the most
irritating thing about the current one; booking button pinned to the bottom of the open panel, within
thumb reach; close on escape, on the button and on outside tap; focus trapped while open and returned
to the button on close.

## Preferred design credit

Proposed, and entirely optional — happy to ship without it:

- **Name:** David Suárez
- **Link:** `https://contrast3d.com`
- **Where:** footer, small, in tertiary ink, next to the legal line. Not in the header, not on every
  page section.

Separately, and this one is a request rather than a credit: David would like a single line in the
footer noting that engineering projects are done in collaboration with Contrast, worded as
*"Proyectos de ingeniería en colaboración con Contrast · contrast3d.com"* — plain text, no logo, no
Contrast colours, nothing that ties the two visual identities together. It is Aitor's site and Aitor's
call; see open question 3.

## Third-party assets

| Asset | Source | License |
| :--- | :--- | :--- |
| Urbanist (300, 400, 500, 600) | fonts.google.com/specimen/Urbanist | SIL OFL 1.1 — the logo's typeface. Self-hosted woff2, same as Inter and Outfit today |
| IBM Plex Mono (400, 500) | github.com/IBM/plex | SIL OFL 1.1 — replaces the `Cascadia Code` system fallback, which does not exist on macOS or Linux |
| Blueprint grid background | Drawn in CSS (`repeating-linear-gradient`) | None — no file, no library |
| Architecture diagram | Hand-drawn inline SVG | None |
| Corrected logo variants | Recoloured from your own `Full-Blue.png` | Yours — construction untouched, only the colour split |

No icon library, no image assets, no CDN, no third-party script. The fonts are self-hosted exactly as
Inter and Outfit are today, so the CSP does not need to change.

**One family, not three.** Urbanist covers display and body, so Outfit and Inter come out of the
system even though they are already in the repo — the text on the page is then built the same way the
mark is. Alternative to Plex Mono if unwanted: JetBrains Mono, also SIL OFL 1.1.

**One risk, stated:** a geometric face at body size tires the eye faster than a screen grotesque over
very long paragraphs. On a site of tables, spec pages and technical articles set to a 68-character
measure this is fine, but if the blog moves toward 2,000-word pieces it is worth measuring. Inter
would stay available as the reading face for articles only.

## Ideas beyond the brief

- **`src/data/testimonials.json` should be emptied to `[]`.** The component already refuses to render
  it, but the placeholder testimonial and its 40 % claim are readable by anyone browsing a public
  repository — including a prospect auditing the code, which this repo invites them to do.
- **Collapse the sixteen service pages to three.** Fintech, healthcare, logistics, SaaS startups,
  monolith migration, REST performance and front-end architecture read as a generalist agency and work
  against the specialist the headline claims. Suggestion: keep whichever ones actually earn traffic,
  but as **articles**, not as services — they keep the URL and the ranking while no longer promising a
  service that is not for sale. Anything with no traffic and no fit gets a 301 to the nearest service
  or article. This needs Search Console data, which David does not have access to.
- **Promote `/blog/` in the navigation**, labelled "Escritos". Suggest **not** changing the route
  unless the traffic data says it is safe.
- **Structured data:** `Person` and `ProfessionalService` on the home page, `TechArticle` on articles,
  `BreadcrumbList` everywhere. No `Review` or `AggregateRating` — there are no real reviews.
- **A hero worth the niche, later.** The stroke field is the brand speaking; the next step would be the
  work speaking — a real malformed mesh and the rule that catches it, with the same break language.
  Out of scope for this pass, worth noting.

## Open questions for Aitor

1. **Do you accept narrowing to three services** and retiring the sector pages as described above? It
   changes the navigation, the home page and the sitemap, so it is the first thing to settle.
2. **The figures.** `impact-metrics.json` and the two case studies carry numbers with no citable source
   on the page — `40 → 6 min`, `99.99%`, `10+ desarrolladores mentorizados`, `3 arquitecturas
   migradas`, `cero downtime en 12 meses`, `50k peticiones concurrentes`, `2.3 s → 300 ms`. Same family
   as the `+50M` badge you already ruled out in `specs/005`. Two workable options: give each one a
   frame it can stand behind ("own system, SaaS platform, not externally verified"), or drop the
   number and keep the architecture decision, which sells on its own. Which do you want?
3. **The Contrast line in the footer** — yes or no, and with what wording? Worth knowing that the site
   currently presents you as an independent architect and as lead architect of a stealth startup; a
   line tying the site to another brand is a positioning decision, not a detail, and it is yours.
4. **The confidential case study.** It describes "our client, a promising stealth startup". If the
   footer also names Contrast, an attentive reader can join those dots. Does the case get reframed as
   your own project, or does the footer line stay off?
5. **Availability.** Is "one engagement at a time, fixed scope, committed date" accurate? If not, tell
   me what is, and the page will say that instead. What it should not do is say two different things.
6. **The method section** — comfortable moving it from task level to engagement level as proposed?
7. **Search Console.** Can you share the top pages by impressions and clicks for the last 6–12 months?
   Without it, the keep/redirect list above is a guess, and I would rather not guess about your
   traffic.
8. **Light theme** — any objection in principle, before screens get built on it?
9. **The logo files.** Two things, both small. First, the colour split in `Full-*.png` does not flip
   with the background (detail above), so three of the five are unusable — corrected versions are in
   `assets/logos/` for comparison, but re-exporting from the `.ai` is the right fix. Second, the site
   needs **SVG** rather than PNG, and a **horizontal lockup** for the 64 px header, which does not
   exist yet. Can you export both from the source file?
10. **The ink.** The wordmark puts `NAIN` in black and the accent in colour, which pulls the system
   toward black ink with blue as the accent. The site currently goes the other way — blue ink — and
   the lockup used on the page has `NAIN` in the site's deep blue so the mark and the page share an
   ink. Either reading works; tell me which you prefer and it is two tokens.
