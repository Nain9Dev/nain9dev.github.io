// Home-only project catalog, loaded on demand by app.js (PERF-012).
import { loadProjects } from './project-catalog.js';
import { initializeProjectFilters } from './project-filters.js';
import { renderProjectError, renderProjects } from './project-view.js';
import { initializeRevealMotion } from './site-interactions.js';
import { dataUrl } from './locale.js';

export async function initializeHomeCatalog({ container, toolbar, count }) {
  const cleanups = [];
  try {
    const projects = await loadProjects(dataUrl('projects.json'));
    renderProjects(container, projects);
    cleanups.push(initializeProjectFilters({ container, count, toolbar }));
    cleanups.push(initializeRevealMotion(container.querySelectorAll('[data-reveal]')));
  } catch (error) {
    console.error('Unable to render the project catalog.', error);
    renderProjectError(container);
  }
  return () => cleanups.forEach((cleanup) => typeof cleanup === 'function' && cleanup());
}
