// Catalog helpers shared by the home sections built from public/assets/data/projects.json.

/** True for a public demo hosted on a naindev.com subdomain (the site's own infrastructure). */
export const isOwnDemo = (url: string): boolean => /^https:\/\/[a-z0-9-]+\.naindev\.com(?:\/|$)/.test(url);
