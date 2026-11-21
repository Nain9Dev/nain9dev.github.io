# Games site and cross-site listings for the 3D projects

Status: Proposed (owner review pending; nothing here is implemented)

## Objective

The 3D projects leave this portfolio (OQ-017, specs/next-3d-migration), but two things are still missing, as the owner stated on 2026-11-21:

1. Nain3D, ParametriCAD and the MCP validator are promoted by the DSE and Contrast Viewer sites, which only link to them. The repositories and the demo hosts stay under the NainDev domain (B-023 and B-024, superseded 2026-10-31).
2. The two public games, Orbe Runner 3D (`orbe.naindev.com`) and Pong Arcade 3D (`pong.naindev.com`), fit neither DSE (deterministic validation) nor Contrast Viewer (industrial visualization), and today only appear as hidden bridge rows in `projects.json` and under "Web Games (Zero Engine)" in `ecosystem.v1.json`. They need a self-explanatory home that can also hold larger games later.

This spec proposes that home: a static index site at `https://games.naindev.com/`, in its own repository (see `docs/30-decisions/ADR-next-games-site.md`).

## Facts checked on 2026-11-21

- `orbe-runner-3d` deploys to GitHub Pages from `main` (`.github/workflows/deploy.yml`, `CNAME` is `orbe.naindev.com`). `pong-arcade` is served by GitHub Pages from the `main` branch root (Pages API: legacy build, `https://pong.naindev.com/`, no workflow). Both have their own repository under `Nain9Dev`.
- `playables` (`playables.naindev.com`) is a separate portfolio of single-file ad playables; its build runs a fail-closed validator for ad-network rules (MRAID, size). A full game would fail it.
- The DNS zone of `naindev.com` resolves any subdomain to Cloudflare (a made-up host answered with the same addresses as `games.` and `play.`). A DNS answer therefore proves nothing about a subdomain being configured; only an HTTP 200 with the expected content does.
- Nothing is configured today for `games.naindev.com`: no repository, no Pages project, no `CNAME`.

## Requirements (EARS)

Part A: the games site (new repository, not this one).

- **GS-001 (index)**: When a visitor opens `https://games.naindev.com/`, the site shall list every published game as a card with its title, a one-sentence description, a technology tag, a play link and a source link.
- **GS-002 (single data file)**: The site shall read its cards from one data file (`games.json`), and the build shall fail when an entry lacks a field or when a play or source link is not an `https://` URL.
- **GS-003 (no URL moves)**: Each game shall keep its own repository and its own host (`orbe.naindev.com`, `pong.naindev.com`); the games site shall only link to them and shall not redirect or proxy them.
- **GS-004 (scales by data)**: When a game is added, the change shall be one entry in `games.json` plus its capture, with no change to the generator.
- **GS-005 (separate from Playables)**: The games site shall not apply the ad-network validator of `playables`, and `playables.naindev.com` shall stay a separate site.
- **GS-006 (static)**: The site shall be static files served by GitHub Pages, built and deployed by a workflow in its repository, like `playables`.

Part B: listings on the commercial sites (other repositories, owner and David decide).

- **GS-007 (listing, not moving)**: Where the owner approves it, the DSE site shall list Nain3D (and the MCP validator) and the Contrast Viewer site shall list ParametriCAD, each linking to its existing demo host and repository. No repository, host or URL changes.

Part C: this portfolio.

- **GS-008 (no change before it exists)**: Until `https://games.naindev.com/` answers 200 and lists both games, this portfolio shall change nothing about Orbe Runner and Pong (same rule as M3-002).
- **GS-009 (link when live)**: When the games site is live, the ecosystem bar shall link to it from the "Web Games" category, and the guards that count or list ecosystem entries shall be updated in the same change.

## Edge cases

- Verify `games.naindev.com` by its content, not by DNS (wildcard zone, see the facts above).
- `playables.naindev.com` is already listed under "Web Games (Zero Engine)"; whether the games site links to it as a sibling is OQ-020.
- ParametriCAD was recorded as DSE-bound on 2026-10-31 and the owner now places it in the Viewer site; the recorded decision needs updating if the owner confirms (OQ-020).

## Out of scope

- Visual design of the games site.
- Moving any repository, changing any game's host or touching the games' code.
- Changing `projects.json` rows for Orbe and Pong (the owner asked on 2026-11-21 to leave them as they are for now).
- Changes inside the DSE and Contrast Viewer repositories, which are the owner's and David's.

## Session state

- Last updated: 2026-11-21
- Done: spec and ADR written as Proposed; open questions and blockers registered.
- Next: owner review; then the tasks in `tasks.md`.
- Blocked: OQ-020 and B-029 to B-031 (owner decisions and accounts).
