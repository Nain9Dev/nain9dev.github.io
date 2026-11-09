// Discoverability baseline of a public host (specs/next-seo-host-audit, DISC-008 and DISC-009).
const MAIN_HOST = 'www.naindev.com';

/** Hosts to audit: the main site plus every own demo of the project catalog, once each. */
export function hostsFromCatalog(catalog) {
  const hosts = [MAIN_HOST];
  for (const project of catalog) {
    for (const link of project.links ?? []) {
      const match = /^https:\/\/([a-z0-9-]+\.naindev\.com)(?:\/|$)/.exec(link.url);
      if (match && !hosts.includes(match[1])) hosts.push(match[1]);
    }
  }
  return hosts;
}

const attribute = (tag, name) => new RegExp(`\\b${name}="([^"]*)"`).exec(tag)?.[1];
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => match[0]);
const metaContent = (html, key) => tags(html, 'meta')
  .filter(tag => attribute(tag, 'name') === key || attribute(tag, 'property') === key)
  .map(tag => attribute(tag, 'content'));

/** Returns the findings for one host; an empty list means the baseline is met. */
export function auditHost({ host, page, robots, sitemap, llms }) {
  if (page.status !== 200) return [`${host}: page answered HTTP ${page.status}`];
  const findings = [];
  const report = message => findings.push(`${host}: ${message}`);
  const html = page.body;
  const canonical = `https://${host}/`;

  const canonicals = tags(html, 'link').filter(tag => attribute(tag, 'rel') === 'canonical').map(tag => attribute(tag, 'href'));
  if (canonicals.length !== 1 || canonicals[0] !== canonical) report(`needs exactly one canonical equal to ${canonical}`);

  if (metaContent(html, 'robots').some(value => /noindex/i.test(value ?? ''))) report('the page is noindex');

  const descriptions = metaContent(html, 'description');
  const length = descriptions[0]?.length ?? 0;
  // Over 160 characters only risks a truncated snippet; the audit fails on missing, duplicated, very short or very long text.
  if (descriptions.length !== 1 || length < 70 || length > 200) report(`description must be one meta of 70 to 200 characters (found ${length})`);

  const ogUrl = metaContent(html, 'og:url')[0];
  const ogImage = metaContent(html, 'og:image')[0];
  if (!metaContent(html, 'og:title')[0] || !metaContent(html, 'og:description')[0] || ogUrl !== canonical || !/^https:\/\//.test(ogImage ?? '')) {
    report('Open Graph needs title, description, og:url equal to the canonical and an absolute image');
  }
  if (!metaContent(html, 'twitter:card')[0]) report('Twitter card is missing');

  const blocks = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gis)].map(match => match[1]);
  const parsed = blocks.map(block => { try { return JSON.parse(block); } catch { return null; } });
  if (blocks.length === 0 || parsed.some(value => value === null)) report('JSON-LD is missing or does not parse');

  if (robots.status !== 200 || /^\s*Disallow:\s*\/\s*$/m.test(robots.body) || !/^\s*User-agent:/im.test(robots.body)) {
    report('robots.txt must exist and not block the site');
  } else if (!new RegExp(`^\\s*Sitemap:\\s*https://${host.replaceAll('.', '\\.')}/`, 'im').test(robots.body)) {
    report('robots.txt must advertise a Sitemap on the same host');
  }

  // The sitemap is the one robots.txt advertises: a urlset that lists the root, or an index of sitemaps.
  const isIndex = sitemap.body.includes('<sitemapindex') && sitemap.body.includes('<loc>');
  const listsRoot = sitemap.body.includes('<urlset') && sitemap.body.includes(`<loc>${canonical}</loc>`);
  if (sitemap.status !== 200 || !(isIndex || listsRoot)) report('the advertised sitemap must list the canonical root or be a sitemap index');

  if (llms.status !== 200 || !/^# \S/.test(llms.body)) report('llms.txt must be Markdown that starts with an H1');

  return findings;
}
