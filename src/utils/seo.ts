export const defaultSEO = {
  siteName: 'NainDev',
  title: 'NainDev | Aitor Nain · Arquitecto de Software Full Stack',
  description: 'Aitor Nain Mendoza Vallejo (NainDev), arquitecto de software full stack: conformidad determinista de productos, backends en Python y .NET e IA con supervisión humana.',
  image: '/assets/images/og-cover-v2.png',
  imageAlt: 'Representación visual de API, lógica de negocio y datos para NainDev',
  author: 'Aitor Nain Mendoza Vallejo',
  robots: 'index, follow, max-image-preview:large',
};

export function getBreadcrumbItems(pathname: string, title: string) {
  if (/^\/404(?:\.html)?\/?$/.test(pathname)) return [];
  const breadcrumbs = [{ name: 'Inicio', item: '/' }];
  const parts = pathname.split('/').filter(Boolean);
  if (!parts.length) return breadcrumbs;
  const hubNames: Record<string, string> = {
    blog: 'Blog',
    servicios: 'Servicios',
  };
  const hubName = hubNames[parts[0]];
  if (parts.length > 1 && hubName) {
    breadcrumbs.push({ name: hubName, item: `/${parts[0]}/` });
  }
  breadcrumbs.push({
    name: title.replace(/\s+\|\s+NainDev$/, ''),
    item: pathname.endsWith('/') ? pathname : `${pathname}/`,
  });
  return breadcrumbs;
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
