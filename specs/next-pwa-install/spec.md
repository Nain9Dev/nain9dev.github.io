# Specification: Installable site (Android and iOS)

Status: Implemented and merged (#93, 2026-11-13). The owner's install on real phones is open (T05).

## Objective

A visitor on a phone can install `www.naindev.com` from the browser and open it like an app: its own icon and
name on the home screen and a window with no browser bar. Android Chrome and iOS Safari are the targets.

This is the reference for the same change in every public product site of the ecosystem (`*.naindev.com`).
An audit on 2026-11-13 found 3 of 19 live sites installable (Nain3D, ParametriCAD AI, NainOrder); the other
16, this one included, publish no web app manifest. Each repository carries its own spec; the contract below
is the shared part.

## Shared contract (every product site)

Verified against the published criteria on 2026-11-13 (web.dev "install criteria", MDN "Making PWAs
installable", WebKit "Web Push for Web Apps on iOS and iPadOS"):

- Chrome on Android offers the install when the page is served over HTTPS and links a manifest with `name` or
  `short_name`, a 192 px and a 512 px icon, `start_url`, and `display` set to `standalone`, `fullscreen` or
  `minimal-ui`. A service worker is not a requirement.
- iOS opens the site as an app when the manifest `display` is `standalone`. It takes the icon from
  `apple-touch-icon` before the manifest icons and the label from `apple-mobile-web-app-title`.
- A maskable icon keeps its mark inside a centred circle whose radius is 40% of the icon width. Icons with
  purpose `any` and `maskable` are separate files.

Names approved by the owner on 2026-11-13. `short_name` is the label under the icon and stays within 12
characters so no launcher truncates it; `name` is what the install dialog shows.

| Host | `short_name` | `name` |
| :--- | :--- | :--- |
| www | NainDev | NainDev · Arquitectura de software |
| status | NainStatus | NainDev Status |
| brand | NainBrand | NainDev Brandbook |
| configurator | NainConfig | NainConfigurator |
| modernizer | Modernizer | NainLegacyModernizer |
| mcp | Nain MCP | Nain MCP Validator |
| policy | NainPolicy | NainPolicy |
| notify | NainNotify | NainNotify |
| drive | NainDrive | NainDrive · Autoescuela |
| write | NainWrite | NainWrite |
| prospect | NainProspect | NainProspect |
| tai | NainTAI | NainTAI · Simulacros TAI |
| gamehaven | GameHaven | GameHaven |
| tickets | HaveTickets | HaveTickets |
| pong | Pong Arcade | Pong Arcade 3D |
| orbe | Orbe Runner | Orbe Runner 3D |

## Functional requirements (EARS)

- **INS-001**: The site shall publish `/manifest.webmanifest`, and every built page, in both languages, shall
  link it with `<link rel="manifest" href="/manifest.webmanifest">`. A redirect stub (`http-equiv="refresh"`)
  is not a page and carries no tags.
- **INS-002**: The manifest shall declare `id`, `start_url` and `scope` as `/`, `display` as `standalone`,
  `lang` as `es`, `name` as `NainDev · Arquitectura de software`, `short_name` as `NainDev`, the site
  description as `description`, and `theme_color` and `background_color` as the dark theme background
  (`#070b16`). It shall not declare `prefer_related_applications`.
- **INS-003**: The manifest shall declare three PNG icons that exist at the declared size: 192 px and 512 px
  with purpose `any`, and 512 px with purpose `maskable`.
- **INS-004**: The maskable icon shall be opaque edge to edge and shall keep every pixel of the mark inside
  the centred circle whose radius is 40% of the icon width.
- **INS-005**: The install icons shall be generated from the brand mark by `npm run generate:brand-icons`, and
  `npm run check:brand-icons` shall fail when a committed icon differs from the generated one.
- **INS-006**: Every built page shall carry the iOS tags: `apple-touch-icon` (180 px), an
  `apple-mobile-web-app-title` equal to the manifest `short_name`, `mobile-web-app-capable` and
  `apple-mobile-web-app-capable` set to `yes`, and `apple-mobile-web-app-status-bar-style` set to `black`.
- **INS-007**: `npm run check` shall fail if INS-001 to INS-006 regress.

## Edge cases and error handling

- English pages link the same manifest. One origin is one installed app: its name stays in Spanish, the
  primary locale, and it starts on `/`; the language switch keeps working inside the installed window.
- The page keeps its own `theme-color` per colour scheme and theme toggle; the manifest value only paints the
  splash screen and the window before the first page loads.
- The site policy (`default-src 'self'`) already allows a same-origin manifest and same-origin icons. No
  policy change.
- The install icons live in `/icons/`, outside `/assets/`, so they do not inherit the one-year immutable cache
  of that path and a redrawn mark reaches installed devices.
- Offline: the site registers no service worker, so an installed window without network shows the browser's
  own offline screen. No stale copy of a page can be served.

## Out of scope

- A service worker, offline pages or any cache (owner decision of 2026-11-13: installable only, in this round).
- An in-page install button or iOS instructions; the browser's own install entry is the way in.
- Screenshots for the richer Android install dialog.
- A store package (Trusted Web Activity or a native shell).
- The other product repositories: each one carries its own spec and pull request.

## Acceptance criteria

- `npm run check` passes with the new test file in the list.
- Chrome reports no installability error for the built site (DevTools protocol `Page.getInstallabilityErrors`
  on a local preview).
- After the deploy, the live manifest answers 200 with a manifest media type, and the owner installs the site
  on an Android phone and on an iPhone: the icon shows the mark uncropped, the label reads `NainDev` and the
  window opens with no browser bar.

## Session state

<!-- Session handoff: keep current. What is done, what is verified, what is next, what is blocked. -->
- Last updated: 2026-11-14, session pwa-install
- Done: audit of the 19 live hosts; names and scope approved by the owner; T01 to T04; merged as #93.
- Verified: `npm run check` passes; on the live site the manifest answers 200 as `application/manifest+json`,
  the icons answer 200 and Chrome reports no installability error on `/` and `/en/` (2026-11-14).
- Rollout of the shared contract, state on 2026-11-14: the same Chrome probe reports no installability error
  on 17 of the 19 live hosts. The 13 hosts merged in this round are `status`, `brand`, `pong`, `orbe`, `mcp`,
  `write`, `drive`, `notify`, `tickets`, `gamehaven`, `policy`, `prospect` and `tai`; `3d`, `parametricad`
  and `order` were installable before it. `configurator` and `modernizer` have their pull requests open
  (NainConfigurator#32, behind the runner fix #33, and NainLegacyModernizer#13).
- Two owner decisions taken during the rollout: HaveTickets had only the stock icon of its project template
  and now carries an HT monogram; the size budget of the NainLegacyModernizer demo went from 210 to 220 KB to
  hold the icons.
- Next: T05, the owner's install on an Android phone and an iPhone, here and in each product repository.
- Blocked: nothing. T05 needs the owner's phones.
