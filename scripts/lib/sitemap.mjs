// Sitemap with language alternates and optional lastmod (specs/next-seo-discovery, DISC-003 and DISC-004).
const escapeXml = value => value
  .replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')
  .replaceAll('<', '&lt;').replaceAll('>', '&gt;');

export function buildSitemap(entries) {
  const urls = entries.flatMap(({ es, en, lastmod }) => {
    if (lastmod !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error(`Invalid lastmod for ${es}: ${lastmod}`);
    const alternates = [['es', es], ['en', en], ['x-default', es]]
      .map(([code, href]) => `<xhtml:link rel="alternate" hreflang="${code}" href="${escapeXml(href)}"/>`).join('');
    return [es, en].map(loc => `<url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${alternates}</url>`);
  });
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>\n`;
}
