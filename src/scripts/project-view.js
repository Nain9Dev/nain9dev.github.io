function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function createProjectLink(link) {
  const anchor = createElement("a", "project-link", link.label);
  anchor.href = link.url;

  if (link.url.startsWith("https://")) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.append(" ↗");
  }

  return anchor;
}

function createProjectCard(project, index) {
  // Compact row: the catalog is the complete inventory; the selected work above tells the stories
  // (specs/049-selected-work, HN-004).
  const article = createElement("article", "project-row");
  article.dataset.featured = String(Boolean(project.featured));
  article.dataset.projectCard = "";
  article.dataset.categories = project.categories.join(" ");
  // The entrance stagger comes from CSS :nth-child steps (spec 045), not from inline delays.
  article.dataset.reveal = "";
  article.dataset.index = String(index + 1).padStart(2, "0");

  const header = createElement("div", "project-row-head");
  const hasLiveDemo = project.links.some((link) => /^https:\/\/[a-z0-9-]+\.naindev\.com(\/|$)/.test(link.url));
  header.append(
    createElement("span", "project-index", String(index + 1).padStart(2, "0")),
    createElement("h3", "project-title", project.title),
    createElement("p", hasLiveDemo ? "project-status is-live" : "project-status", project.status)
  );

  const summary = createElement("p", "project-summary", project.summary);
  // Summary and proof stay one click away so the row reads as an index (VIS-005, VS-010).
  const detail = createElement("details", "project-detail");
  detail.append(createElement("summary", "", message('projectDetail')));
  detail.append(summary, createElement("p", "project-proof", project.proof));

  const technologies = createElement("ul", "tag-list");
  technologies.setAttribute("aria-label", message('projectTechnologies', { name: project.title }));
  project.technologies.slice(0, 4).forEach((technology) => {
    const chip = createElement("li");
    const iconPath = techIcon(technology);
    if (iconPath) {
      const icon = createElement("img", "tech-chip-icon");
      icon.src = iconPath;
      icon.alt = "";
      icon.width = 14;
      icon.height = 14;
      icon.loading = "lazy";
      chip.append(icon);
    }
    chip.append(technology);
    technologies.append(chip);
  });

  const links = createElement("div", "project-links");
  if (project.private) {
    links.append(createElement("p", "project-private", message('projectPrivate')));
  }
  project.links.forEach((link) => links.append(createProjectLink(link)));

  article.append(header, technologies, detail, links);
  return article;
}

export function renderProjects(container, projects) {
  const fragment = document.createDocumentFragment();
  projects.forEach((project, index) => fragment.append(createProjectCard(project, index)));

  container.replaceChildren(fragment);
  container.setAttribute("aria-busy", "false");
}

export function renderProjectError(container) {
  const notice = createElement(
    "p",
    "notice",
    message('projectError')
  );
  const link = createElement("a", "", ` ${message('openGitHub')}`);
  link.href = "https://github.com/Nain9Dev";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  notice.append(link);

  container.replaceChildren(notice);
  container.setAttribute("aria-busy", "false");
}
import { message } from './locale.js';
import { techIcon } from './tech-icons.js';
