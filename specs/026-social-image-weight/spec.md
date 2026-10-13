# Specification: Social preview image weight

Status: In progress

## Objective

The default Open Graph image `og-cover-v2.png` weighs 1.5 MB at 1731×909. LinkedIn, WhatsApp and other crawlers download it for every share preview, and slow or capped fetchers may time out and show no image. On 2026-10-13 the owner asked to compress it.

## Functional requirements (EARS)

- **SOC-001**: When a page declares the default social image, the file shall be a 1200×630 JPEG of at most 200 KB, and the declared `og:image:width` and `og:image:height` shall match the file.
- **SOC-002**: When sources reference the default social image, they shall all use the new file; the 1.5 MB PNG shall not be published.

## Edge cases and error handling

- Platforms cache previews by URL; the new file name makes them fetch the lighter image on the next scrape.

## Out of scope

- Redesigning the image.

## Acceptance criteria

- `scripts/social-image.test.mjs` fails before the change and passes after it, inside `npm run check`.
- Visual comparison of the old and new images shows no meaningful loss.

## Session state

- Last updated: 2026-10-13, implementation session
- Done: T01.
- Next: T02 after deploy.
- Blocked: —
