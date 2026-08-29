export function getTechnologyRouteParam(technology: string): string {
  if (!technology.includes('#')) {
    return technology;
  }

  return technology
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/#/g, 'sharp')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

export function getTechnologyHref(technology: string): string {
  return `/tecnologia/${encodeURIComponent(getTechnologyRouteParam(technology))}/`;
}
