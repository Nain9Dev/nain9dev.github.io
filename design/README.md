# Design Brief for naindev.com

This folder is the workspace for the visual redesign of
[www.naindev.com](https://www.naindev.com). Read this page first. It explains
who the site is for, what can change, where to work and how to hand over.

## Roles and authorship

| Person | Owns | Works on |
| :--- | :--- | :--- |
| David (`davidesuarez`) | Visual and UI design | Only his own `design/*` branches |
| Aitor (`Nain9Dev`) | Software, code, functionality, content and deployment | `main` and the live site |

- **Partnership:** Aitor (NainDev) and David (Contrast3D) collaborate as
  **Contrast3D x NainDev**. Within this partnership David takes on the web
  design to help NainDev sell more. The partnership is new: there are no shared
  clients or joint projects yet.
- David designs. Aitor turns approved designs into production code.
- **The visual design David delivers is David's work.** The software, code and
  functionality of the site remain Aitor's.
- **Credit:** the published site will credit David's design. David chooses the
  form: name, link (portfolio, LinkedIn, Behance...) and where it appears, for
  example the footer, and may mention Contrast3D. Write the preferred credit in
  your folder's `README.md`.
- **Everything uploaded is public.** The repository is public, so anyone can see
  the files. Do not upload anything you do not want published.
- Anything pushed to `main` goes live automatically, so `main` is closed to
  everyone except Aitor. GitHub rejects any push from David outside `design/*`.
- Inside his branch David is free: any layout, style, tool or method, and any
  file he needs to explain the design.

## Business goal

naindev.com is the professional site of **Aitor Nain Mendoza Vallejo
(NainDev)**, a software architect who **sells custom software services**. The
redesign has two goals:

1. **Win clients:** a visitor understands what Aitor builds and contacts him.
2. **Improve SEO:** more organic traffic from companies searching for these
   services.

- **What clients buy:** custom software services, built per project:
  - backend architecture and development (C#/.NET, Python/FastAPI);
  - AI integrations with human review (human-in-the-loop) and deterministic
    validation;
  - 3D asset processing and validation backends;
  - critical-system audits and optimization.
- **Audience:** CTOs, tech leads and founders of companies that need reliable
  software, especially products with AI or 3D.
- **Markets:** open to any country. Spain, the rest of Europe, the United States
  and Latin America are all targets, so the English version matters as much as
  the Spanish one.
- **Problems clients bring:** anything related to software, most often:
  - a backend that is slow or goes down under load;
  - a legacy system that is hard to change (old .NET, technical debt,
    migrations);
  - AI they want to use but cannot yet trust (validation, human review);
  - 3D models that must be processed or validated at scale.
- **How a sale starts:** a **free 30-minute call** (Calendly) to understand the
  case. It is a conversation, not a free audit: do not promise an audit or a
  deliverable.
- **Prices:** not shown on the site. They are discussed on the call.
- **Availability:** Aitor takes **part-time, remote projects**. Do not write
  "immediate" or "full-time" availability.
- **Tone:** precise, calm, engineering-grade. Trust over flashiness.
- **More background:** the "Sobre mí" section of the live site and
  [LinkedIn](https://www.linkedin.com/in/aitor-nain-mendoza-vallejo/).

## Redesign goals

Agreed with Aitor. Where something is not listed here, David decides. David's
own ideas are explicitly welcome: new sections, formats or approaches that
would sell better are part of the job.

| Topic | Decision |
| :--- | :--- |
| Main problem | Mobile experience, above all the header menu and navigation |
| First deliverable | Home page (`/`), mobile and desktop |
| After that | Reuse the home page's visual system for services, blog and technology pages |
| Main message | David decides. Today the home page mixes 3D validation, agentic AI and critical .NET systems. Choose the hierarchy that sells best to clients; Aitor adapts the wording |
| Main call to action | David decides: whatever is most comfortable for the client (see "Contact channels") |
| Visual direction | Free. Showing two or three directions is welcome |
| Logo and brand identity | **David may redesign the logo and the visual identity, with NainDev's permission.** See "Logo redesign" |
| Photo of Aitor | Optional. If the design needs one, ask Aitor for it |
| About section | Names the partnership: "Lead Software Architect en Contrast3D x NainDev". David may rewrite the section; Aitor approves |
| Testimonials | No section for now; there are no client testimonials yet |
| Pricing | No prices or packages with prices |
| Free checklist (lead magnet) | Keep it in the design. Its signup form is being fixed separately |
| Must keep | The NainDev name, the blog, the service pages, the technology pages and the interactive terminal (its look can change; its commands show stack, services and contact, with no metrics) |
| Can change or remove | Everything else, including the 3D hero canvas, the dark theme, the API/Logic/Data panel, section order and copy |
| Case studies | **Not shown.** They are being removed from the site; do not design them or link to them |
| Partners section | Aitor proposes a "Contrast3D x NainDev" section presenting the partnership as part of the offer (design + software), which may also help SEO. **David decides** whether to include it and how. It must not claim shared clients or joint projects |
| Content | Free proposal: David may reorder, merge or remove sections and rewrite headlines and copy. Aitor approves final wording |
| Mockup language | Spanish and English for every screen |
| References | None given. David may collect and share his own |
| Deadline | None. Quality over speed |

### How proposals are judged

All of these matter, plus David's own ideas:

1. **Conversion:** the client understands the offer and contacts Aitor.
2. **SEO and speed:** indexable text, clear heading structure, fast loading.
3. **Mobile experience:** navigation and reading on a phone.
4. **Memorable brand:** NainDev stands out from other freelancers.

### Mobile issues to solve first

- The header menu and navigation are hard to use on phones. Design a clear
  mobile menu: open and close states, current page, language switch (ES/EN)
  and the main contact action always easy to reach.
- Check the full home page on a real phone before designing and note other
  problems you find in your folder's `README.md`.

### Contact channels

Use the channels that are most comfortable for the client. Popular patterns or
other ideas are welcome.

| Channel | Status |
| :--- | :--- |
| Calendly, 30-minute call | Exists today |
| LinkedIn | Exists today |
| Email | `contact@naindev.com` |
| WhatsApp | A button such as "Escríbeme por WhatsApp" / "Message me on WhatsApp" that opens a chat. **Do not show the phone number** on screen; Aitor adds the link when building the site |

## SEO rules for the design

The site earns clients through search engines, so the design must keep text
readable by Google:

- **Real text, not images of text.** Headlines, services and paragraphs are
  HTML text. Images are for illustration only.
- **One main headline (H1) per page** stating what Aitor offers, then section
  headings (H2) and sub-headings (H3) in order.
- **Every service keeps its own page** with a clear title, description and a
  contact action. Do not merge services into a single page.
- **Blog and technology pages** need a readable article layout: title, date,
  reading width of about 60-75 characters per line, code blocks, and links to
  related services.
- **Internal links:** home → services → blog and back. Avoid dead ends.
- **Speed:** images compressed (WebP or SVG), few web fonts (two families at
  most), no autoplay video, animations that do not block reading.
- **URLs stay the same.** You can rename menu labels, but existing pages keep
  their addresses. If you propose removing a page, note it in your `README.md`.

## What exists today

The site is live. Browse it before designing.

| Area | URL |
| :--- | :--- |
| Home | `/` |
| Services | `/servicios/` |
| Blog | `/blog/` |
| Technology pages | `/tecnologia/...` |
| Privacy | `/privacidad` |
| English version | `/en/...` (every page) |

Home sections today, in order: Hero with 3D canvas, Terminal, Proof strip,
Services, Tech stack, Free checklist call to action, Projects, Method, About,
Contact.

### Current brand colors

Taken from the current NainDev logo (`public/assets/images/favicon-optimized.svg`):

| Color | Value | Use today |
| :--- | :--- | :--- |
| Cobalt blue | `#0047AB` | Logo main shape |
| Sky blue | `#00BFFF` | Logo accent |
| White | `#FFFFFF` | Logo detail |

The logo file above is SVG and can be opened in any design tool. The header
also uses `src/assets/images/logo_horizontal.png`. These colors are a reference,
not a constraint: a logo redesign may change them.

### Logo redesign

NainDev (Aitor) gives David permission to redesign the logo and brand identity
as the project needs.

- **Rights and registration, agreed in principle:** David has told Aitor that
  Aitor may register the logo David designs as the NainDev trademark. Because a
  trademark office needs the applicant to own the design, **before filing, David
  and Aitor will sign a short written assignment of the logo's rights to
  Aitor** (NainDev). David keeps the credit as its designer and may show it in
  his portfolio. If that document is not signed, NainDev keeps its current logo
  and the new logo is not used.
- **Direction:** an evolution that stays recognizable as NainDev is preferred,
  but David is free to propose what works best. The name **NainDev** stays.
- **Trademark registration:** Aitor plans to register the logo as a trademark
  in Spain at the **OEPM** (Oficina Española de Patentes y Marcas). Design it so
  it can be registered:
  - **Original and distinctive.** Do not base it on existing logos, templates,
    stock icons, AI image generators trained on other brands, or on another
    company's mark. Before finalizing, Aitor checks similar marks in the OEPM
    and EUIPO (TMview) databases.
  - **No protected symbols:** flags, coats of arms, official emblems or seals,
    currency symbols, or signs of public bodies and international organizations.
  - **Not purely generic or descriptive:** a plain gear, `</>` or a cloud alone
    is weak. A distinctive shape or lettering is stronger.
  - **Fonts with a license that allows logos and trademarks.** Prefer
    converting the lettering to outlines and note the font and its license.
  - **A clear, fixed version** to register: exact shape, and exact colors if the
    colors are part of the mark.
- **Deliverables for the logo**, inside your folder under `logo/`:

```text
logo/
├── logo-color.svg         Master vector, text converted to outlines
├── logo-mono-black.svg    One color, for documents and registration
├── logo-mono-white.svg    One color on dark backgrounds
├── logo-symbol.svg        Symbol only, square, for favicon and avatars
├── logo-horizontal.svg    Symbol and name side by side, for the header
└── logo-preview.png       All versions on light and dark backgrounds
```

- **It must work small:** readable as a 16 px and 32 px browser icon and as a
  180 px phone icon.
- In your `README.md`, list the colors (HEX), fonts and licenses, the idea
  behind the logo, and anything used as inspiration.

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
5. **Real content only.** Do not invent clients, logos, testimonials, metrics,
   case studies or awards. New copy is welcome, but facts must be real. Mark
   unknown data as `[TEXT]` or `[METRIC]`. The site has no verified metrics
   today: the "+50M" badge, the impact metrics section and the "Colaborador
   OSS" badge were removed on purpose. A metrics area may appear in the design
   only as an empty slot marked `[METRIC]`.
6. **Brand.** Keep the NainDev name. The logo and colors may be redesigned
   (see "Logo redesign").
7. **No new paid services.** Fonts, icons, images and libraries must be free
   with a license that allows commercial use, for example Google Fonts, Lucide
   icons or Unsplash photos. Note the source of every third-party asset in your
   `README.md`.
8. **No third-party trackers or embeds.** The site uses a strict privacy policy
   and a Content Security Policy. The privacy banner and privacy page stay.

## How to work (no coding knowledge needed)

Everything is already prepared. You do not need to install anything or create
branches.

| What | Value |
| :--- | :--- |
| Your branch | `design/home-redesign` |
| Your folder | `design/home-redesign/` |
| Open it in the browser | https://github.com/Nain9Dev/nain9dev.github.io/tree/design/home-redesign/design/home-redesign |

### Design

1. Design however you like, on your own computer, with any tool.
2. Save the result in a folder on your computer with this layout:

```text
home-redesign/
├── README.md            What changed and why, open questions (optional, can be empty)
├── index.html           Main prototype (opens with a double click)
├── assets/              Images, SVG and fonts used by the prototype
└── exports/             PNG or PDF screenshots of each screen
```

- The prototype is **plain HTML and CSS that opens in a browser with a double
  click**. No installation, no build step. Keep every file it needs inside the
  folder and use relative paths (`assets/logo.svg`, not `/assets/logo.svg`).
- You can make the HTML however you like: by hand, exported from a design tool,
  or with an AI assistant. If you only have images, upload the exports first;
  the HTML can come later.
- Optional: link your Penpot or Figma file in the folder's `README.md`.

### Upload (from the browser)

1. Open the link from the table above and sign in as `davidesuarez`.
2. Check that the branch selector at the top left says `design/home-redesign`.
3. Click **Add file > Upload files**.
4. Drag the **contents** of your `home-redesign` folder (files and subfolders)
   into the page.
5. In **Commit changes**, write a short summary such as
   `design: add home hero proposal`.
6. Leave **Commit directly to the design/home-redesign branch** selected and
   click **Commit changes**.

Uploading a file with the same name replaces the old version; GitHub keeps the
history. Browser uploads accept up to 100 files and 25 MB per file at a time.

### Share

- Day to day: tell Aitor in your usual chat when you upload something.
- When the proposal is final, open this link and click **Create pull request**:
  https://github.com/Nain9Dev/nain9dev.github.io/compare/main...design/home-redesign
  The pull request is only the formal handoff. It is never merged as is: Aitor
  rebuilds the design in the real site.

### Optional: GitHub Desktop

If you prefer an app for frequent uploads, install
[GitHub Desktop](https://desktop.github.com/), clone
`Nain9Dev/nain9dev.github.io`, switch to `design/home-redesign`, copy your files
into `design/home-redesign/`, then **Commit** and **Push origin**.

### New topics later

Ask Aitor for a new branch (for example `design/services-page`), or create one
from the branch selector on GitHub by typing a name that starts with `design/`.
Any other name is rejected.

## Rules for the branch

- Work only in `design/*` branches and only inside the matching folder, for
  example `design/home-redesign/`.
- Do not change files outside `design/`, especially `.github/`, `src/`,
  `public/`, `package.json` or `astro.config.mjs`. They are Aitor's code.
- Never commit passwords, API keys or private client material. The repository
  is public.
- Write file names, folder names and commit messages in English, without
  accents or spaces (`hero-dark.png`, not `Héroe oscuro.png`). Text meant for
  site visitors can be in Spanish.
- Several branches are fine, one per topic.

## Frequently asked questions

**Do I need to know how to code?**
No. Upload images and, if you can, an HTML prototype. Aitor builds the real site.

**Can I only deliver images (PNG/PDF) or a Figma/Penpot link?**
Yes, to start. An HTML prototype helps Aitor see interactions and responsive
behavior, but it is not required for the first proposal.

**Which texts do I use?**
Copy the current text from the live site, or write your own proposal. List every
text you change in the "Copy changes for approval" table of your `README.md`.

**What if I need information I do not have (a photo, a text, a figure)?**
Use a placeholder such as `[PHOTO]`, `[TEXT]` or `[METRIC]`, and ask Aitor in
chat or at `contact@naindev.com`.

**Can I change the logo?**
Yes, NainDev gives you permission. Follow "Logo redesign" so the result can be
registered as a trademark. Before Aitor registers it, you both sign a short
written assignment of the logo's rights; you keep the design credit. Without
that document, the current logo stays.

**Can I show prices, testimonials or "clients who trust us" logos?**
No. There are no public prices, testimonials or client logos yet.

**What do I call the main button?**
Anything that clearly offers a free call, for example "Agendar llamada
gratuita" / "Book a free call". Not "free audit".

**Should the site mention Contrast3D?**
Only if you think it helps. A partners section or a design credit mentioning
Contrast3D are both allowed. Do not present shared clients or joint projects:
there are none yet.

**Can I add new sections or pages?**
Yes. Explain the idea and why it helps win clients or SEO in your `README.md`.

**Can I remove the 3D animation or change the dark theme?**
Yes. Only the NainDev name, blog, service pages, technology pages and the
interactive terminal must stay. The terminal's look can change.

**How many proposals or rounds?**
No fixed number and no deadline. Upload early versions; feedback happens in chat.

**What happens if I upload something by mistake?**
Upload the corrected file with the same name or tell Aitor. Your branch never
affects the live site.

**GitHub says I cannot push or upload.**
Check that the branch selector shows `design/home-redesign`. Uploads to any
other branch are rejected on purpose. If it still fails, send Aitor a screenshot.

**Who owns the design?**
The visual design is yours and will be credited on the site in the form you
choose. The code and functionality are Aitor's. The files are public.

## Design checklist before asking for review

- [ ] Desktop (1440 px) and mobile (390 px) screens, including the open mobile menu
- [ ] Spanish and English version of every screen
- [ ] Hover, focus and active states for buttons and links
- [ ] Contrast checked (for example with the WebAIM contrast checker)
- [ ] Colors, font sizes and spacing listed in the folder's `README.md`
- [ ] Only real content, placeholders marked `[TEXT]`, `[METRIC]` or `[PHOTO]`
- [ ] WhatsApp shown as a button without a visible phone number
- [ ] One H1 per page and all important text as real text, not images
- [ ] No case studies, prices, testimonials or client logos
- [ ] If the logo changes: original design, no protected symbols, licensed fonts, all versions in `logo/`, works at 16 px
- [ ] Main action offers a free call, not a free audit; availability described as part-time and remote
- [ ] Third-party asset sources and preferred design credit listed in `README.md`
- [ ] Copy changes listed in the folder's `README.md` for Aitor's approval
- [ ] PNG or PDF exports included
