// Icons for the technology chips of the project cards (spec next-portfolio-ecosystem-hero, VIS-004).
// Only technologies whose SVG ships in /assets/icons are listed; the others render as text-only chips.
const TECH_ICONS = {
  'Python': '/assets/icons/python-original.svg',
  'C#': '/assets/icons/csharp-original.svg',
  'TypeScript': '/assets/icons/typescript-original.svg',
  '.NET': '/assets/icons/dotnetcore-original.svg',
  '.NET 10': '/assets/icons/dotnetcore-original.svg',
  'ASP.NET Core': '/assets/icons/dotnetcore-original.svg',
  'Three.js': '/assets/icons/threejs-original.svg',
  'FastAPI': '/assets/icons/fastapi-original.svg',
  'Docker': '/assets/icons/docker-original.svg',
  'Pydantic': '/assets/icons/pydantic.svg',
  'PostgreSQL': '/assets/icons/postgresql.svg',
  'React': '/assets/icons/react-original.svg',
  'Vue 3': '/assets/icons/vuedotjs.svg',
  'SQL Server': '/assets/icons/microsoftsqlserver-plain.svg',
  'GitHub Actions': '/assets/icons/githubactions.svg',
  'MCP': '/assets/icons/modelcontextprotocol.svg',
  'Tailwind CSS': '/assets/icons/tailwindcss.svg',
  'Azure': '/assets/icons/azure-original.svg',
};

export function techIcon(technology) {
  return TECH_ICONS[technology] ?? null;
}
