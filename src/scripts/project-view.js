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

// Private projects in production carry an anonymized architecture diagram (specs/next-private-diagrams, PD-004).
// The SVG is a static file of this site, fetched the first time the disclosure opens and inlined so it reads the
// theme tokens; while the row stays closed nothing is requested, and a failed load removes the figure.
function createDiagram(project, detail) {
  const figure = createElement("figure", "arch-diagram project-diagram");
  figure.tabIndex = 0;
  figure.setAttribute("aria-label", message('projectDiagram'));
  figure.setAttribute("aria-busy", "true");
  let requested = false;
  detail.addEventListener("toggle", async () => {
    if (!detail.open || requested) return;
    requested = true;
    try {
      const response = await fetch(assetUrl(project.diagram));
      const svg = response.ok ? await response.text() : "";
      if (!svg.trimStart().startsWith("<svg")) throw new Error(`Unexpected diagram response for ${project.id}`);
      figure.innerHTML = svg;
      figure.removeAttribute("aria-busy");
    } catch (error) {
      console.error("Unable to load the architecture diagram.", error);
      figure.remove();
    }
  });
  return figure;
}

// The picture of a row (DF-036): the capture of the demo when there is one, otherwise the mark of the first
// technology that has one. It is decorative: the title and the status already name the project.
function createCapture(project) {
  const media = createElement("div", project.thumbnail ? "project-capture" : "project-capture is-mark");
  media.setAttribute("aria-hidden", "true");
  const source = project.thumbnail ? project.thumbnail.replace(/\.webp$/, "-400.webp") : project.technologies.map(techIcon).find(Boolean);
  if (source) {
    const image = createElement("img");
    image.src = source;
    image.alt = "";
    image.width = project.thumbnail ? 400 : 28;
    image.height = project.thumbnail ? 225 : 28;
    image.loading = "lazy";
    image.decoding = "async";
    media.append(image);
  }
  return media;
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
  if (project.diagram) {
    detail.firstChild.textContent = message('projectDetailDiagram');
    detail.append(createDiagram(project, detail));
  }

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

  const body = createElement("div", "project-row-body");
  body.append(header, technologies, detail, links);
  article.append(createCapture(project), body);
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
import { assetUrl, message } from './locale.js';
import { techIcon } from './tech-icons.js';
