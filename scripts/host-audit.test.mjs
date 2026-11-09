import test from 'node:test';
import assert from 'node:assert/strict';
import { auditHost, hostsFromCatalog } from './lib/host-audit.mjs';

const host = 'demo.naindev.com';
const canonical = `https://${host}/`;
const description = 'A factual description of the demo that is long enough to be useful in a search result snippet.';

const html = `<!doctype html><html lang="en"><head>
<title>Demo | NainDev</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${canonical}">
<meta property="og:title" content="Demo"><meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="https://www.naindev.com/cover.jpg">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"Demo","author":{"@id":"https://www.naindev.com/#person"}}</script>
</head><body><h1>Demo</h1></body></html>`;

const healthy = () => ({
  host,
  page: { status: 200, body: html },
  robots: { status: 200, body: `User-agent: *\nAllow: /\n\nSitemap: ${canonical}sitemap.xml\n` },
  sitemap: { status: 200, body: `<?xml version="1.0"?><urlset><url><loc>${canonical}</loc></url></urlset>` },
  llms: { status: 200, body: '# Demo\n\n> Summary.\n' },
});

test('a host that meets the baseline has no findings (DISC-008)', () => {
  assert.deepEqual(auditHost(healthy()), []);
});

test('a missing or wrong canonical is reported', () => {
  const none = healthy();
  none.page.body = html.replace(/<link rel="canonical"[^>]*>/, '');
  assert(auditHost(none).some(finding => finding.includes('canonical')));
  const wrong = healthy();
  wrong.page.body = html.replace(`href="${canonical}"`, 'href="https://other.naindev.com/"');
  assert(auditHost(wrong).some(finding => finding.includes('canonical')));
});

test('a noindex page, a short description or missing social tags are reported', () => {
  const noindex = healthy();
  noindex.page.body = html.replace('<title>', '<meta name="robots" content="noindex"><title>');
  assert(auditHost(noindex).some(finding => finding.includes('noindex')));
  const short = healthy();
  short.page.body = html.replaceAll(description, 'Too short.');
  assert(auditHost(short).some(finding => finding.includes('description')));
  const bare = healthy();
  bare.page.body = html.replace(/<meta property="og:[^>]*>/g, '').replace(/<meta name="twitter:card"[^>]*>/, '');
  assert(auditHost(bare).some(finding => finding.includes('Open Graph')));
  assert(auditHost(bare).some(finding => finding.includes('Twitter')));
});

test('missing or invalid JSON-LD is reported', () => {
  const none = healthy();
  none.page.body = html.replace(/<script type="application\/ld\+json">.*?<\/script>/s, '');
  assert(auditHost(none).some(finding => finding.includes('JSON-LD')));
  const broken = healthy();
  broken.page.body = html.replace('"name":"Demo"', '"name":');
  assert(auditHost(broken).some(finding => finding.includes('JSON-LD')));
});

test('robots.txt must exist, allow the site and advertise a sitemap on the same host', () => {
  const blocked = healthy();
  blocked.robots.body = 'User-agent: *\nDisallow: /\n';
  assert(auditHost(blocked).some(finding => finding.includes('robots.txt')));
  const foreign = healthy();
  foreign.robots.body = 'User-agent: *\nAllow: /\nSitemap: https://other.naindev.com/sitemap.xml\n';
  assert(auditHost(foreign).some(finding => finding.includes('Sitemap')));
  const missing = healthy();
  missing.robots = { status: 404, body: '' };
  assert(auditHost(missing).some(finding => finding.includes('robots.txt')));
});

test('a sitemap answered by the SPA shell does not count', () => {
  const shell = healthy();
  shell.sitemap.body = html;
  assert(auditHost(shell).some(finding => finding.includes('advertised sitemap')));
  const missing = healthy();
  missing.sitemap = { status: 404, body: '' };
  assert(auditHost(missing).some(finding => finding.includes('advertised sitemap')));
});

test('a sitemap index is accepted as the advertised sitemap', () => {
  const index = healthy();
  index.sitemap.body = '<?xml version="1.0"?><sitemapindex><sitemap><loc>https://demo.naindev.com/sitemap-0.xml</loc></sitemap></sitemapindex>';
  assert.deepEqual(auditHost(index), []);
});

test('llms.txt must be Markdown that starts with an H1, not the SPA shell', () => {
  const shell = healthy();
  shell.llms.body = html;
  assert(auditHost(shell).some(finding => finding.includes('llms.txt')));
  const missing = healthy();
  missing.llms = { status: 404, body: '' };
  assert(auditHost(missing).some(finding => finding.includes('llms.txt')));
});

test('an unreachable page is reported once and stops the other checks', () => {
  const down = healthy();
  down.page = { status: 503, body: '' };
  assert.deepEqual(auditHost(down), [`${host}: page answered HTTP 503`]);
});

test('the host list comes from the catalog demos plus the main site, once each', () => {
  const catalog = [
    { links: [{ url: 'https://mcp.naindev.com/' }, { url: 'https://github.com/Nain9Dev/x' }] },
    { links: [{ url: 'https://tai.naindev.com' }] },
    { links: [{ url: 'https://mcp.naindev.com/' }] },
    { links: [] },
    { links: [{ url: 'https://datumstatutum.com/' }] },
  ];
  assert.deepEqual(hostsFromCatalog(catalog), ['www.naindev.com', 'mcp.naindev.com', 'tai.naindev.com']);
});
