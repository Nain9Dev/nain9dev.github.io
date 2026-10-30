// Project catalog of /proyectos/, loaded on demand by app.js (PERF-012).
import { loadProjects } from './project-catalog.js';
import { initializeProjectFilters } from './project-filters.js';
import { renderProjectError, renderProjects } from './project-view.js';
import { initializeRevealMotion } from './site-interactions.js';
import { dataUrl } from './locale.js';

export async function initializeHomeCatalog({ container, toolbar, count }) {
  const cleanups = [];
  try {
    const loaded = await loadProjects(dataUrl('projects.json'));
    const projects = loaded.filter((project) => !project.bridge); // the 3D projects stand behind one bridge row (NPR-003)
    renderProjects(container, projects);
    cleanups.push(initializeProjectFilters({ container, count, toolbar }));
    cleanups.push(initializeRevealMotion(container.querySelectorAll('[data-reveal]')));
  } catch (error) {
    console.error('Unable to render the project catalog.', error);
    renderProjectError(container);
  }
  return () => cleanups.forEach((cleanup) => typeof cleanup === 'function' && cleanup());
}
