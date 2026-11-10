# Plan: IndexNow submission

- `scripts/lib/indexnow.mjs`: the key, `sitemapUrls` and `buildIndexNowPayload`, covered by `scripts/indexnow.test.mjs`.
- `public/<key>.txt`: the key file, copied to the site root by the Astro build.
- `scripts/submit-indexnow.mjs`: reads the live sitemap and posts the payload to `https://api.indexnow.org/IndexNow`; `--dry-run` only prints it.
