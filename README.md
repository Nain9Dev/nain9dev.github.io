# naindev.com · round 4 prototype (preview)

This branch holds only the viewable prototype of round 4 of the naindev.com redesign ("fusion"):
the two expressions, Deep blue and Paper, on the home, the 22-project catalogue, the inner pages and
brandbook v2.0. It is a design proposal by David Esteban for Aitor. It is not the published site and
it does not replace anything on `main`.

It shares no history with `main`, so it carries no workflows and nothing here builds or deploys.

## Where it comes from

`site/` is a byte-for-byte copy of `design/home-redesign/` on the
[`design/home-redesign`](https://github.com/Nain9Dev/nain9dev.github.io/tree/design/home-redesign/design/home-redesign)
branch at commit `89e15d8`: the ten pages, `brandbook/index.html` and `assets/`. That branch is the
source of truth. Change the prototype there, not here. The full round lives there too: the critique
with before and after captures, the exports in both expressions, `tools/check.mjs` and the README
section "Round 4 — fusion", which explains how to port the work to `main`.

At that commit `node tools/check.mjs` passed 23 of 23 checks, in both expressions and both languages.

The only new files are the review index at the root (`index.html`, `preview.css`, `preview.js`) and
this README.

## How to view it

```sh
git fetch origin design/round-4-preview
git switch design/round-4-preview
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. The index links to every page in Spanish and English.
Serve it over HTTP: opened as a file, browsers do not load the fonts.

- The header switch changes between Deep blue (default) and Paper. The choice is stored in the
  browser under `theme`, the key `main` already uses, and applies to the index and every page.
- The language follows `?lang=es|en` or the ES / EN buttons and is stored under `naindev-lang`.
- With no stored choice, the pages follow the operating system's light or dark preference.
- The brandbook is in Spanish only and follows the system preference.

## Contents

| Path | What it is |
| :-- | :-- |
| `index.html`, `preview.css`, `preview.js` | Review index in ES and EN, both expressions. Strict CSP, no inline script or style |
| `site/index.html` | Home: hero, services in three families, six projects with a public demo, case studies, how I work, Contrast3D, contact. 7 screens at 1440 |
| `site/proyectos.html` | All 22 projects with filters |
| `site/servicios.html`, `site/servicio-validacion-3d.html` | Services (15, in three families) and one service in detail |
| `site/casos.html` | Two architecture decisions and what they cost |
| `site/escritos.html`, `site/articulo.html` | Article index and the long-read template |
| `site/tecnologia.html`, `site/contacto.html`, `site/lab.html` | Technology page, contact, motion pieces |
| `site/brandbook/index.html` | Brandbook v2.0, self-contained (fonts embedded, no script) |
| `site/assets/` | Shared CSS and JS, own fonts with their OFL licences, logo, favicons and project captures |
