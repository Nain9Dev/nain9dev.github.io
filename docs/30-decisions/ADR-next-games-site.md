# ADR-next: The public games get their own index site at games.naindev.com

Status: Proposed
Date: 2026-11-21

## Context

The 3D projects are leaving this portfolio (OQ-017). DSE and Contrast Viewer promote the validation and visualization projects from their own sites; the repositories and demo hosts stay under the NainDev domain (B-023 and B-024 superseded). Orbe Runner 3D and Pong Arcade 3D are games: they belong to neither commercial product, and a game on the Viewer or DSE site would blur what each product sells. Today they survive only as hidden bridge rows in `projects.json` and as entries under "Web Games (Zero Engine)" in the ecosystem bar.

`playables.naindev.com` already exists but is a portfolio of single-file ad playables whose build enforces ad-network rules; it is not a home for full games. Each game already has its own repository, its own GitHub Pages deployment and its own subdomain. What is missing is one place that lists them and can take more, larger games.

## Decision

- Create a static index site at `https://games.naindev.com/`, in a new repository `Nain9Dev/games`, deployed to GitHub Pages by its own workflow like `playables`.
- The site lists games from one data file. A card is title, one sentence, technology tag, play link and source link. Adding a game is one entry and one capture.
- The games keep their repositories and their hosts. The index only links; nothing is redirected, proxied or moved, so no existing URL changes.
- The site is separate from `playables.naindev.com` and does not run its validator.
- This portfolio links to the new site from the ecosystem bar only after it answers 200 with both games listed. Until then nothing changes here.
- The listings of Nain3D and the MCP validator on the DSE site, and of ParametriCAD on the Contrast Viewer site, are separate decisions of the owner and David, made in their own repositories; they only link to the existing demo hosts.

## Consequences

- One more repository, one more Pages deployment and one more DNS record to maintain (B-029, B-030).
- The name `games` says what the site is and leaves room for larger games, either as their own subdomain or under `games.naindev.com/<slug>`.
- The wildcard DNS of `naindev.com` means the host will resolve before it is configured; checks must use the HTTP response, not DNS.
- The ecosystem-bar guards change when the link is added (GS-009).

## Alternatives considered

- **`play.naindev.com`**: shorter, but close to `playables.` and says less about the content.
- **Extend `playables`**: its validator rejects anything that is not a single-file ad; relaxing it would weaken the rule that makes that site trustworthy.
- **Keep the games in this portfolio**: the portfolio is about software and backend work, and the migration decided they leave (OQ-017).
- **A path on `www.naindev.com` (for example `/juegos/`)**: couples the games to this site's budgets and guards, and makes a larger game awkward to host.
- **List them on the Contrast Viewer site**: the audience and product are industrial visualization; games dilute it.
- **No index, only the ecosystem bar**: leaves the games with no description or capture and no place for future ones.
