# IndexNow submission

Status: In progress

## Objective

Let Bing and the other IndexNow engines (Yandex, Seznam, Naver) learn about new and changed pages of the main site within minutes, instead of waiting for a crawl. Bing's index is also used by several other search products.

## Requirements

- DISC-012: When the owner runs `scripts/submit-indexnow.mjs`, it shall send the URLs of the live sitemap of `www.naindev.com` to IndexNow with the site key and its key location, and shall refuse URLs of another host and lists of 0 or more than 10000 URLs.
- DISC-013: The site shall publish the IndexNow key file at the root, with the key as its only content.

## Edge cases

- The key is public by design: the protocol proves ownership by fetching the file from the site root.
- The key file proves ownership of `www.naindev.com` only. The demo subdomains would each need their own key file and are not covered.
- The submission is a manual step after a deploy, so no workflow gains write access or a secret; `--dry-run` prints the payload.

## Out of scope

- Submitting from CI after each deploy (a later decision if the manual step is forgotten).

## Session state

- Last updated: 2026-11-10
- Done: payload builder, key file, submit script and tests.
- Next: owner review and merge; then run `node scripts/submit-indexnow.mjs` once the key file is live.
- Blocked: nothing.
