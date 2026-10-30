// Catalog helpers shared by the home sections and the work pages built from public/assets/data/projects.json.
import projects from '../../public/assets/data/projects.json';

export interface ProjectLink { label: string; url: string }
export interface ProjectStory { problem: string; approach: string; result: string }
export interface Project {
  id: string;
  title: string;
  status: string;
  order: number;
  featured?: boolean;
  /** 1 to 6 for the projects the home shows, in order (specs/next-projects-route, NPR-001). */
  featuredOrder?: number;
  /** True for the 3D projects that stand behind one catalog row; they stay available to the work pages (NPR-003). */
  bridge?: boolean;
  selected?: boolean;
  technologies: string[];
  links: ProjectLink[];
  thumbnail?: string;
  /** Anonymized architecture diagram of a private project in production (specs/next-private-diagrams, PD-001). */
  diagram?: string;
  story?: ProjectStory;
}

/** True for a public demo hosted on a naindev.com subdomain (the site's own infrastructure). */
export const isOwnDemo = (url: string): boolean => /^https:\/\/[a-z0-9-]+\.naindev\.com(?:\/|$)/.test(url);

/** The selected projects with an own demo, in catalog order: the home cases and the work pages share this list (SW-001, WK-001). */
export const selectedProjects = (): Project[] =>
  (projects as Project[])
    .filter((project) => project.selected && project.links.some((link) => isOwnDemo(link.url)))
    .sort((a, b) => a.order - b.order);

/** Route of a project's work page (WK-001). */
export const workPath = (id: string): string => `/trabajo/${id}/`;
