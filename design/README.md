# Design Brief for naindev.com

This folder is the workspace for the visual redesign of
[www.naindev.com](https://www.naindev.com). Read this page first. It explains
who the site is for, what can change, where to work and how to hand over.

## Roles

| Person | Owns | Works on |
| :--- | :--- | :--- |
| David (`davidesuarez`) | Visual and UI design | Only his own `design/*` branches |
| Aitor (`Nain9Dev`) | Code, content, deployment | `main` and the live site |

- David designs. Aitor turns approved designs into production code.
- Anything pushed to `main` goes live automatically, so `main` is closed to
  everyone except Aitor. GitHub rejects any push from David outside `design/*`.
- Inside his branch David is free: any layout, style, tool or method, and any
  file he needs to explain the design.

## Who the site is for

naindev.com is the professional portfolio of **Aitor Nain Mendoza Vallejo
(NainDev)**, a software architect. It should win consulting work, not look like
a student portfolio.

- **Audience:** CTOs, tech leads and founders of companies that build 3D or AI
  products and need backends that cannot fail.
- **Positioning:** backend architecture for 3D and AI systems. Deterministic
  validation of 3D assets, generative AI integrations with human review
  (human-in-the-loop), and mission-critical .NET systems.
- **Stack shown on the site:** C#/.NET, SQL Server, Python/FastAPI, TypeScript,
  3D/WebGL, agentic AI.
- **Main goal of every page:** book a call (the "Agendar Llamada" button, which
  opens Calendly). Secondary goal: read a case study.
- **Tone:** precise, calm, engineering-grade. Trust over flashiness.
- **More background:** the "Sobre mí" section of the live site and
  [LinkedIn](https://www.linkedin.com/in/aitor-nain-mendoza-vallejo/).

## Redesign goals

Agreed with Aitor. Where something is not listed here, David decides.

| Topic | Decision |
| :--- | :--- |
| Main problem | Mobile experience, above all the header menu and navigation |
| First deliverable | Home page (`/`), mobile and desktop |
| After that | Reuse the home page's visual system for services, case studies, blog and technology pages |
| Visual direction | Free. David proposes the style; showing two or three directions is welcome |
| Must keep | The NainDev brand and its logo colors (see below) |
| Can change or remove | Any section, effect or component, including the 3D hero canvas, the terminal, the dark theme and the API/Logic/Data panel |
| Content | Free proposal: David may reorder, merge or remove sections and rewrite headlines and copy. Aitor approves final wording |
| Mockup language | Spanish and English for every screen |
| References | None given. David may collect and share his own |
| Deadline | None. Quality over speed |

### Mobile issues to solve first

- The header menu and navigation are hard to use on phones. Design a clear
  mobile menu: open and close states, current page, language switch (ES/EN)
  and the "Agendar Llamada" / "Book a call" button always easy to reach.
- Check the full home page on a real phone before designing and note other
  problems you find in your folder's `README.md`.

## What exists today

The site is live. Browse it before designing.

| Area | URL |
| :--- | :--- |
| Home | `/` |
| Services | `/servicios/` |
| Case studies | `/casos/` |
| Blog | `/blog/` |
| Technology pages | `/tecnologia/...` |
| Privacy | `/privacidad` |
| English version | `/en/...` (every page) |

Home sections in order: Hero with 3D canvas, Terminal, Proof strip, Services,
Tech stack, Case studies, Impact metrics, Projects, Method, About, Contact.

### Brand colors (must keep)

Taken from the NainDev logo (`public/assets/images/favicon-optimized.svg`):

| Color | Value | Use today |
| :--- | :--- | :--- |
| Cobalt blue | `#0047AB` | Logo main shape |
| Sky blue | `#00BFFF` | Logo accent |
| White | `#FFFFFF` | Logo detail |

The palette may grow around these colors (neutrals, backgrounds, states), but
the logo colors stay recognizable.

### Current site styling

From `public/assets/css/main.css`:

| Token | Value |
| :--- | :--- |
| Background | `#090A0F`, soft `#0F111A` |
| Surfaces | `#131622`, `#1C2133` |
| Text | `#E2E8F0`, muted `#A8B4C7` |
| Primary blue | `#3B82F6`, strong `#60A5FA` |
| Fonts | Outfit (headings), Inter (body), Cascadia Code (code) |
| Radius | 0.85rem / 1.25rem / 2rem |

These values are a starting point, not a constraint. Typography, spacing, layout
and theme (dark or light) are open.

## Things the design must respect

1. **Two languages.** Every screen exists in Spanish (main) and English. Deliver
   both versions of each mockup; text length differs between them.
2. **Mobile first.** Design at least 390 px (phone) and 1440 px (desktop).
3. **Accessibility.** Text contrast of at least 4.5:1, visible keyboard focus,
   no information shown by color alone, and a reduced-motion alternative for
   animations.
4. **Speed.** The site is static and loads in under a second. Prefer CSS over
   heavy images or video, and use SVG or WebP for images.
5. **Real content only.** Do not invent clients, logos, testimonials, metrics or
   awards. New copy is welcome, but facts must be real. Mark unknown data as
   `[TEXT]` or `[METRIC]`. Do **not** reuse the current "+50M Modelos Validados
   en Producción" badge: it is not a verified figure.
6. **Brand.** Keep the NainDev name, logo and logo colors.
7. **No new paid services.** Fonts, icons and libraries must be free and
   open source, for example Google Fonts or Lucide icons.
8. **No third-party trackers or embeds.** The site uses a strict privacy policy
   and a Content Security Policy.

## How to work (no coding knowledge needed)

### One-time setup

1. Install [GitHub Desktop](https://desktop.github.com/) and sign in as
   `davidesuarez`.
2. **File > Clone repository**, choose `Nain9Dev/nain9dev.github.io`.

### Start a design

1. In GitHub Desktop, click **Current branch > New branch**.
2. Name it `design/<topic>`, for example `design/home-redesign`. It must start
   with `design/`, otherwise GitHub rejects the push.
3. Base it on `main`.
4. Create a folder `design/<topic>/` inside this `design` folder and put all your
   work there.

### What to put in the folder

```text
design/home-redesign/
├── README.md            What changed and why, open questions
├── index.html           Main prototype (opens with a double click)
├── mobile.html          Optional, if mobile differs a lot
├── assets/              Images, SVG, fonts used by the prototype
└── exports/             PNG or PDF screenshots of each screen
```

- The prototype is **plain HTML and CSS that opens in a browser with a double
  click**. No installation, no build step. Keep every file it needs inside the
  folder and use relative paths (`assets/logo.svg`, not `/assets/logo.svg`).
- You can make the HTML however you like: by hand, with an export from a design
  tool, or with an AI assistant.
- Add PNG or PDF exports so the design can be reviewed without opening the
  prototype.
- Optional: link your Penpot or Figma file in the folder's `README.md`.

### Save and share

1. In GitHub Desktop, write a short summary, e.g. `design: add home hero
   proposal`, and click **Commit to design/<topic>**.
2. Click **Push origin**.
3. Push often. Day-to-day feedback happens in your usual chat with Aitor; share
   the branch name or a screenshot.
4. When a proposal is final, open a **pull request** from your branch to `main`
   on GitHub as the formal handoff. The pull request is never merged as is:
   Aitor rebuilds the design in the real site.

## Rules for the branch

- Work only in your `design/*` branches and only inside `design/<topic>/`.
- Do not change files outside `design/`, especially `.github/`, `src/`,
  `public/`, `package.json` or `astro.config.mjs`. They are Aitor's code.
- Never commit passwords, API keys or private client material. The repository
  is public.
- Write file names, folder names and commit messages in English, without
  accents or spaces (`hero-dark.png`, not `Héroe oscuro.png`). Text meant for
  site visitors can be in Spanish.
- Several branches are fine, one per topic.

## Design checklist before asking for review

- [ ] Desktop (1440 px) and mobile (390 px) screens, including the open mobile menu
- [ ] Spanish and English version of every screen
- [ ] Hover, focus and active states for buttons and links
- [ ] Contrast checked (for example with the WebAIM contrast checker)
- [ ] Colors, font sizes and spacing listed in the folder's `README.md`
- [ ] Only real content, placeholders marked `[TEXT]` or `[METRIC]`
- [ ] Copy changes listed in the folder's `README.md` for Aitor's approval
- [ ] PNG or PDF exports included
