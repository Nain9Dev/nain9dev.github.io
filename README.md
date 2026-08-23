# NainDev - Arquitectura Backend y Sistemas 3D

[![Astro](https://img.shields.io/badge/Astro-5.x-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![WebGL](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://naindev.com)

**Portafolio profesional B2B** focalizado en Arquitectura de Software, sistemas distribuidos en .NET, IA Generativa y visualización 3D (WebGL).

🌐 **Sitio en Producción:** [www.naindev.com](https://www.naindev.com)

---

## 🎯 Objetivo del Proyecto

Este repositorio aloja la infraestructura Frontend del portafolio. Su diseño sigue una filosofía estricta de **Ingeniería Comercial**:
- **Cero dependencias superfluas:** Carga ultra-rápida (Sub-1s) para maximizar la conversión técnica.
- **Islands Architecture (Astro):** El renderizado 3D complejo (Three.js) ocurre solo en el cliente de manera aislada, sin bloquear el hilo principal.
- **Estrategia SEO B2B:** Clústeres temáticos (Topic Clusters) en MDX para atraer CTOs y Tech Leads.
- **Privacidad desde el Diseño:** Sin bases de datos propias expuestas, analítica privacy-friendly (Plausible) y CSP (Content Security Policy) estricta.

## 🏗️ Arquitectura Técnica

El portal es una aplicación estática multipágina (SSG) vitaminada con *View Transitions* para simular una experiencia SPA, sin el altísimo coste de memoria de React/Vue en el cliente.

- **Framework Core:** Astro 5.x
- **Gestión de Contenido:** Markdown/MDX tipado estáticamente con Zod (`src/content.config.ts`).
- **Motor 3D:** Three.js (Cargado asíncronamente para optimizar Core Web Vitals).
- **Estilos:** Vanilla CSS / CSS Modules (Cero utilidades masivas, máximo control a nivel de token arquitectónico).

### Estructura de Directorios

```text
nain9dev.github.io/
├── src/
│   ├── components/      # Componentes de UI (Header, Footer, Terminal, WebGL)
│   ├── content/         # Colecciones (Blog, Servicios, Casos) en MDX
│   ├── layouts/         # Layouts base y gestión de <head> / SEO
│   └── pages/           # Enrutamiento basado en archivos (File-based routing)
├── public/              # Assets estáticos (Imágenes, modelos 3D, robots.txt)
├── astro.config.mjs     # Configuración central (Redirecciones 301, Vite chunks)
└── .github/workflows/   # CI/CD pipelines para GitHub Pages
```

## 🚀 Despliegue (CI/CD)

El sistema está configurado para integración continua. Cualquier push a la rama `main` dispara automáticamente la GitHub Action que compila el sitio de forma estática y lo despliega en GitHub Pages.

```bash
# Desarrollo Local (Terminal background interactiva)
npm run dev

# Compilación Estática para Producción
npm run build

# Previsualización del Build Local
npm run preview
```

## 🔐 Seguridad y Propiedad Intelectual

Este repositorio es público exclusivamente para auditar el código frontend de la arquitectura. Sin embargo:
- Las auditorías internas, KPIs, planes de conversión (CRO) y datos estratégicos de clientes **están excluidos del repositorio** para preservar el secreto de negocio B2B.
- Todas las variables de entorno locales y tokens de APIs de mailing están protegidas.

---
**Aitor Nain**  
*Senior Software Architect | .NET | Unity/3D | Cloud Computing*  
Contacto Comercial: [naindev.com](https://www.naindev.com)
