export const defaultSEO = {
  siteName: 'NainDev',
  title: 'NainDev | Aitor Nain · Arquitectura Backend, 3D e IA',
  description: 'Aitor Nain Mendoza Vallejo, también conocido como NainDev, diseña arquitectura backend para validación 3D, IA generativa y sistemas críticos .NET.',
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
    casos: 'Casos de estudio',
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
