# Plan: SEO host audit

- `scripts/lib/host-audit.mjs`: pure `auditHost` and `hostsFromCatalog`, covered by `scripts/host-audit.test.mjs`.
- `scripts/audit-hosts.mjs`: fetches `/`, `/robots.txt`, the sitemap advertised by robots (or `/sitemap.xml`) and `/llms.txt` per host and exits 1 on any finding.
- `.github/workflows/seo-audit.yml`: weekly cron and manual dispatch; no dependencies to install.
- Alerting is the failed scheduled run; no write permission is added.
