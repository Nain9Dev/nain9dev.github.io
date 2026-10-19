# Organization Facebook page

Status: In progress (local; not pushed)

## Objective

On 2026-10-18 the owner created the brand Facebook page "NainDev" (category software company) and kept his personal Facebook profile private and empty. Spec 042 left Facebook out because the page did not exist. The page is a brand channel and belongs in the `Organization` `sameAs`.

## Requirements

- SEO-022: When any page is rendered, the `Organization` `sameAs` shall also list the brand Facebook page `https://www.facebook.com/profile.php?id=61595195565055`.
- SEO-023: When any page is rendered, the `Person` `sameAs` shall not list the brand Facebook page (brand channel, as in SEO-019 and SEO-021).

## Edge cases

- The page has no vanity username yet, so the numeric `profile.php?id=` URL is the canonical one. If a username is set later, the `sameAs` entry must be updated to it in a new spec; both URLs resolve to the same page.
- The page is new (0 followers on 2026-10-18). It is listed on the owner's decision; it carries the same bio, website and contact email (no phone, no address) as the other brand profiles.
- The personal Facebook profile is never listed: it is private by owner decision.

## Out of scope

- A visible Facebook link in the page footer or the ecosystem bar.
- Wikidata, address, telephone (specs 036 and 040).

## Session state

- Last updated: 2026-10-18
- Done: spec, tests (SEO-022 observed failing first), implementation, owner push (`aaf4b92`), deploy (first run failed on the intermittent Lighthouse TBT gate; the rerun passed), production check: the Facebook URL is in the JSON-LD of `/` and `/en/` on 2026-10-18.
- Next: —
- Blocked: —
