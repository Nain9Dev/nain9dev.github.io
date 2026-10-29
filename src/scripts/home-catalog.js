// Project catalog of the home and /proyectos/, loaded on demand by app.js (PERF-012).
// With `selection` (the home) it shows only the six projects that carry a `featuredOrder`, in that order, and
// has no filter bar (specs/next-projects-route, NPR-001).
import { loadProjects } from './project-catalog.js';
import { initializeProjectFilters } from './project-filters.js';
import { renderProjectError, renderProjects } from './project-view.js';
import { initializeRevealMotion } from './site-interactions.js';
import { dataUrl } from './locale.js';

export async function initializeHomeCatalog({ container, toolbar, count, selection = false }) {
  const cleanups = [];
  try {
    const loaded = await loadProjects(dataUrl('projects.json'));
    const projects = selection
      ? loaded.filter((project) => project.featuredOrder !== undefined).sort((a, b) => a.featuredOrder - b.featuredOrder)
      : loaded;
    renderProjects(container, projects);
    if (!selection) cleanups.push(initializeProjectFilters({ container, count, toolbar }));
    cleanups.push(initializeRevealMotion(container.querySelectorAll('[data-reveal]')));
  } catch (error) {
    console.error('Unable to render the project catalog.', error);
    renderProjectError(container);
  }
  return () => cleanups.forEach((cleanup) => typeof cleanup === 'function' && cleanup());
}
