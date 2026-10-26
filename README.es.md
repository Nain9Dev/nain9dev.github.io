# NainDev - Arquitectura Full Stack y Conformidad de Producto

[![English](https://img.shields.io/badge/Language-English-blue?style=flat-square)](README.md)
[![Español](https://img.shields.io/badge/Idioma-Espa%C3%B1ol-emerald?style=flat-square)](README.es.md)
[![Astro](https://img.shields.io/badge/Astro-7.x-FF5D01?style=for-the-badge&logo=astro&logoColor=white)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![DotNet](https://img.shields.io/badge/.NET-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)](https://dotnet.microsoft.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-All_Rights_Reserved-red?style=for-the-badge)](LICENSE)
[![Deployed on GitHub Pages](https://img.shields.io/badge/Deployed_on-GitHub_Pages-222222?style=for-the-badge&logo=github&logoColor=white)](https://naindev.com)

Portfolio profesional y escaparate técnico centrado en arquitectura de software: APIs empresariales en .NET, procesamiento de datos e integraciones de IA en Python, validación determinista de producto (modelos 3D y especificaciones técnicas) y visualización interactiva WebGL/WebGPU.

Sitio en Producción: [www.naindev.com](https://www.naindev.com) | Inglés: [www.naindev.com/en/](https://www.naindev.com/en/)

---

## Arquitectura Técnica

El sitio está construido como una aplicación multipágina estática (SSG) con View Transitions en el cliente para lograr transiciones de página fluidas sin la sobrecarga de un framework SPA:

- **Framework Núcleo**: Astro (Generación Estática).
- **Frontend**: Vanilla CSS con tokens de diseño arquitectónico, Web Components nativos y TypeScript estricto.
- **Colecciones de Contenido**: Esquemas tipados estáticamente con Markdown/MDX (`src/content.config.ts`).
- **Visualización 3D**: Three.js cargado de forma asíncrona para preservar las Core Web Vitals.
- **Entrega Bilingüe**: Salidas estáticas sincronizadas en español (`/`) e inglés (`/en/`) generadas en tiempo de compilación con verificación automatizada de traducciones.
- **Privacidad y Seguridad**: Sin bases de datos expuestas en cliente, analítica respetuosa con la privacidad mediante Plausible y estricta Content Security Policy.

### Estructura del Repositorio

```text
nain9dev.github.io/
├── docs/                # Arquitectura canónica numerada, requisitos y decisiones
├── specs/               # Especificaciones por fases (requisitos EARS y tareas)
├── src/
│   ├── components/      # Componentes UI (Header, Footer, Terminal, Hero 3D)
│   ├── content/         # Colecciones de contenido tipadas (Blog, Servicios)
│   ├── layouts/         # Layouts base HTML, metadatos y esquemas JSON-LD
│   └── pages/           # Enrutamiento basado en archivos y puntos de entrada estáticos
├── public/              # Recursos estáticos (iconos, manifiestos de datos, modelos 3D)
├── scripts/             # Suite de pruebas automatizadas, sincronización y contratos
├── astro.config.mjs     # Configuración de compilación y redirecciones
└── .github/workflows/   # Pipelines de integración y despliegue continuo
```

## Desarrollo Local y Verificación

```bash
# Instalar dependencias
npm ci

# Iniciar servidor de desarrollo local
npm run dev

# Ejecutar suite integral de verificación (tests, tipos, build, SEO, locales, afirmaciones)
npm run check

# Previsualizar build de producción localmente
npm run preview
```

## Seguridad y Propiedad Intelectual

Este repositorio es público para permitir auditorías técnicas abiertas de arquitectura frontend, contratos de verificación y Core Web Vitals. No obstante:
- **Licencia**: Código disponible con todos los derechos reservados ([LICENSE](LICENSE)). El código fuente se proporciona exclusivamente para evaluación técnica y auditoría. No se autoriza su alojamiento en terceros, publicación, réplica del diseño visual o copia de casos de estudio y textos comerciales.
- **Protección de Marca**: La marca "NainDev", logotipos, marcas comerciales y tokens de identidad visual son propiedad intelectual exclusiva de Aitor Nain Mendoza Vallejo.
- **Privacidad de Datos**: Datos comerciales de clientes, reglas de negocio internas y detalles comerciales privados quedan estrictamente excluidos.
- Los registros arquitectónicos privados y borradores internos residen exclusivamente en el directorio ignorado por git `docs/private/`.
- Todas las variables de entorno, tokens de API y certificados de firma están excluidos mediante `.gitignore`.

---

**Aitor Nain Mendoza Vallejo**  
Arquitecto de Software Full Stack | .NET | Python | Validación Determinista de Producto  
Contacto: [contact@naindev.com](mailto:contact@naindev.com) | [www.naindev.com](https://www.naindev.com)
