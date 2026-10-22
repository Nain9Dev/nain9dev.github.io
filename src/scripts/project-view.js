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
  const article = createElement("article", "project-card");
  article.dataset.featured = String(Boolean(project.featured));
  article.dataset.projectCard = "";
  article.dataset.categories = project.categories.join(" ");
  // The entrance stagger comes from CSS :nth-child steps (spec 045), not from inline delays.
  article.dataset.reveal = "";
  // Cards without a capture open with a numbered cover band drawn by CSS from this value (spec 047, IP-008).
  article.dataset.index = String(index + 1).padStart(2, "0");
  if (!project.thumbnail) article.classList.add("project-card-plain");

  const header = createElement("div", "project-card-header");
  const hasLiveDemo = project.links.some((link) => /^https:\/\/[a-z0-9-]+\.naindev\.com(\/|$)/.test(link.url));
  header.append(
    createElement("p", hasLiveDemo ? "project-status is-live" : "project-status", project.status),
    createElement("span", "project-index", String(index + 1).padStart(2, "0"))
  );

  const title = createElement("h3", "project-title", project.title);
  const summary = createElement("p", "project-summary", project.summary);
  // The long technical proof stays one click away so the card reads visually first (VIS-005).
  // With a capture, the summary joins it: the picture, the title and the chips carry the card (spec 046, VS-010).
  const detail = createElement("details", "project-detail");
  detail.append(createElement("summary", "", message('projectDetail')));
  if (project.thumbnail) detail.append(summary);
  detail.append(createElement("p", "project-proof", project.proof));

  const technologies = createElement("ul", "tag-list");
  technologies.setAttribute("aria-label", message('projectTechnologies', { name: project.title }));
  project.technologies.forEach((technology) => {
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

  if (project.thumbnail) {
    // Decorative preview of the live demo; the title below names it (spec next-portfolio-refresh, VIS-003).
    const picture = createElement("img", "project-thumb");
    picture.src = project.thumbnail;
    picture.alt = "";
    picture.loading = "lazy";
    picture.decoding = "async";
    picture.width = 640;
    picture.height = 360;
    article.append(picture);
  }

  article.append(header, title);
  if (!project.thumbnail) article.append(summary);
  article.append(technologies, detail, links);
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
