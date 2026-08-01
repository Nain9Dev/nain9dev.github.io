# NainDev portfolio

Portfolio estático de Aitor Nain para presentar su experiencia, proyectos personales y disponibilidad profesional.

## Objetivo

El sitio debe ayudar a que un posible cliente o responsable técnico entienda rápidamente:

- mi experiencia y las tecnologías con las que trabajo;
- los proyectos que he desarrollado y su estado real;
- las tareas de backend en las que puedo ayudar;
- mi disponibilidad y forma de contacto.

## Arquitectura

La web no requiere framework ni dependencias de producción. GitHub Pages sirve directamente los archivos estáticos.

```text
assets/
├── css/                 # Design system and responsive layout
├── data/projects.json   # Public project catalog
├── images/              # Public visual assets
└── js/                  # Catalog loading and DOM rendering
scripts/                 # Local server and validation
index.html               # Main commercial page
404.html                 # Custom not-found page
```

El contenido de los proyectos está separado de la presentación:

- `projects.json` contiene el catálogo de proyectos;
- `project-catalog.js` carga y valida los datos;
- `project-view.js` crea la presentación usando APIs seguras del DOM;
- `app.js` compone el comportamiento de la página;
- `main.css` contiene tokens, layout y componentes visuales.

La web se mantiene deliberadamente sencilla: HTML, CSS y JavaScript sin dependencias de producción.

## Añadir un proyecto

1. Añade una entrada a `assets/data/projects.json`.
2. Describe únicamente el trabajo que se pueda revisar y declara el estado real.
3. Usa enlaces `https://` o rutas internas que comiencen por `/`.
4. Ejecuta `npm run check`.
5. Revisa que el proyecto muestre una habilidad útil para el tipo de trabajo que buscas.

## Desarrollo local

Requiere Node.js 24 o posterior y no instala paquetes.

```bash
npm start
```

El servidor local escucha por defecto en `http://127.0.0.1:4173`.

## Validación

```bash
npm run check
```

La comprobación valida el catálogo, las referencias locales, todos los archivos y scripts JavaScript públicos —incluido el código embebido de las demos—, los enlaces externos abiertos en una pestaña nueva y el límite de publicación de la documentación privada.

## Seguridad y privacidad

- No hay cookies, analítica, formularios ni almacenamiento de datos personales.
- No se carga JavaScript, CSS ni tipografía de terceros.
- La Content Security Policy limita los recursos al propio dominio.
- Los datos del catálogo se insertan con APIs del DOM y `textContent`, no con HTML dinámico.
- La documentación interna reside en `.portfolio-private/`, está ignorada por Git y no debe añadirse con `git add -f`.

GitHub Pages no permite configurar todos los encabezados HTTP desde este repositorio. Si el riesgo o las capacidades futuras cambian, se debe reevaluar el hosting antes de añadir autenticación, formularios o datos personales.

## Publicación

El repositorio está preparado para GitHub Pages y conserva el dominio definido en `CNAME`. Publicar, hacer push o modificar la configuración de Pages son acciones separadas y requieren una decisión explícita.
