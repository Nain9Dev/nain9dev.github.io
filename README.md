<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="docs/assets/banner-light.svg">
  <img src="docs/assets/banner-dark.svg" alt="NainDev Portfolio - Full Stack Architecture & Product Conformance" width="100%">
</picture>

<div align="center">

[![Language: English](https://img.shields.io/badge/Language-English-blue?style=flat-square)](README.md)
[![Versión en Español](https://img.shields.io/badge/Versi%C3%B3n-Espa%C3%B1ol-red?style=flat-square)](README.es.md)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-naindev.com-38bdf8?style=flat-square&logo=google-chrome&logoColor=white)](https://naindev.com)
[![Astro](https://img.shields.io/badge/Astro-7.x-FF5D01?style=flat-square&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-007ACC?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![WCAG 2.2 AA](https://img.shields.io/badge/WCAG-2.2%20AA%20Compliant-80FF00?style=flat-square&logo=checkmarx&logoColor=black)](https://www.w3.org/WAI/WCAG22/quickref/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=flat-square)](LICENSE)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222222?style=flat-square&logo=github&logoColor=white)](https://naindev.com)

**Professional portfolio and technical showcase focused on software architecture: .NET enterprise APIs, Python data processing, deterministic product conformance, and interactive 3D WebGL visualization.**

[Production Portal](https://www.naindev.com) &bull; [English Version](https://www.naindev.com/en/) &bull; [Architecture Runbook](docs/60-runbook.md)

</div>

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

This repository is public to allow open technical auditing of frontend architecture, verification contracts, and Core Web Vitals. However:
- **License**: Source-Available / All Rights Reserved ([LICENSE](LICENSE)). The source code is available for technical evaluation and auditing. No permission is granted to re-host, publish, replicate the visual design, or copy the case studies and marketing text.
- **Brand Protection**: The "NainDev" name, trademarks, logos, and visual identity tokens remain the exclusive intellectual property of Aitor Nain Mendoza Vallejo.
- **Data Privacy**: Proprietary customer data, internal business logic, and private commercial details remain strictly excluded.
- Private architectural records and working drafts belong exclusively in the git-ignored `docs/private/` directory.
- All environment variables, API tokens, and signing certificates are excluded via `.gitignore`.

---

**Aitor Nain Mendoza Vallejo**  
Full Stack Software Architect | .NET | Python | Deterministic Product Conformance  
Contact: [contact@naindev.com](mailto:contact@naindev.com) | [www.naindev.com](https://www.naindev.com)
