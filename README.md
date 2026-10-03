# NainDev - Full Stack Architecture & Product Conformance

[![Astro](https://img.shields.io/badge/Astro-7.x-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![DotNet](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://naindev.com)

Professional portfolio and technical showcase focused on software architecture: .NET enterprise APIs, Python data processing and AI integrations, deterministic product conformance (3D assets and technical specifications), and interactive WebGL/WebGPU visualization.

Production Site: [www.naindev.com](https://www.naindev.com) | English: [www.naindev.com/en/](https://www.naindev.com/en/)

---

## Technical Architecture

The site is built as a static multipage application (SSG) with client-side View Transitions for smooth page transitions without single-page application framework overhead:

- **Core Framework**: Astro (Static Site Generation).
- **Frontend**: Vanilla CSS with architectural design tokens, native Web Components, and strict TypeScript.
- **Content Collections**: Statically typed Markdown/MDX schemas (`src/content.config.ts`).
- **3D Visualization**: Three.js loaded asynchronously to preserve Core Web Vitals.
- **Bilingual Delivery**: Synchronized Spanish (`/`) and English (`/en/`) static outputs generated at build time with automated translation verification.
- **Privacy & Security**: Zero client-exposed databases, privacy-friendly analytics via Plausible, and strict Content Security Policy.

### Repository Layout

```text
nain9dev.github.io/
├── docs/                # Canonical numbered architecture, requirements, and decisions
├── specs/               # Spec-driven development features (EARS requirements and tasks)
├── src/
│   ├── components/      # UI components (Header, Footer, Terminal, 3D Hero)
│   ├── content/         # Typed content collections (Blog, Services)
│   ├── layouts/         # Base HTML layouts, metadata, and JSON-LD schemas
│   └── pages/           # File-based routing and static entrypoints
├── public/              # Static assets (brand icons, data manifests, 3D models)
├── scripts/             # Automated test suite, localization sync, and verification contracts
├── astro.config.mjs     # Build settings and redirect configuration
└── .github/workflows/   # Continuous integration and deployment pipelines
```

## Local Development & Verification

```bash
# Install dependencies
npm ci

# Start local development server
npm run dev

# Run comprehensive verification suite (tests, types, build, SEO, locales, claims)
npm run check

# Preview production build locally
npm run preview
```

## Security & Intellectual Property

This repository is public to allow open auditing of frontend architecture and verification contracts. However:
- Proprietary customer data, internal business logic, and private commercial details remain strictly excluded.
- Private architectural records and working drafts belong exclusively in the git-ignored `docs/private/` directory.
- All environment variables, API tokens, and signing certificates are excluded via `.gitignore`.

---

**Aitor Nain Mendoza Vallejo**  
Full Stack Software Architect | .NET | Python | Deterministic Product Conformance  
Contact: [contact@naindev.com](mailto:contact@naindev.com) | [www.naindev.com](https://www.naindev.com)
