export function initTechStack() {
  const container = document.getElementById('tech-stack-container');
  if (!container) return;

  fetch('/assets/data/tech-stack.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo tech-stack.json');
      }
      return response.json();
    })
    .then(data => {
      renderTechStack(data.categories, container);
      setupIntersectionObserver();
    })
    .catch(error => {
      console.error('Error al inicializar Tech Stack:', error);
      container.innerHTML = '<p class="notice">Error al cargar las tecnologías.</p>';
    });
}

function renderTechStack(categories, container) {
  const fragment = document.createDocumentFragment();

  categories.forEach(category => {
    const categoryEl = document.createElement('div');
    categoryEl.className = 'tech-category-group';
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'tech-category-title';
    titleEl.textContent = category.name;
    categoryEl.appendChild(titleEl);

    const gridEl = document.createElement('div');
    gridEl.className = 'tech-category';

    category.items.forEach(item => {
      const badge = document.createElement('div');
      badge.className = 'tech-badge';
      badge.setAttribute('data-reveal', ''); // Para animación de scroll
      
      const icon = document.createElement('img');
      icon.src = item.icon;
      icon.alt = `Icono de ${item.name}`;
      icon.loading = 'lazy';
      icon.className = 'tech-icon';
      
      const name = document.createElement('span');
      name.className = 'tech-name';
      name.textContent = item.name;

      badge.appendChild(icon);
      badge.appendChild(name);
      gridEl.appendChild(badge);
    });

    categoryEl.appendChild(gridEl);
    fragment.appendChild(categoryEl);
  });

  container.appendChild(fragment);
}

function setupIntersectionObserver() {
  // Reutiliza la lógica de data-reveal que ya puede existir, o implementa una sencilla aquí.
  // Como el portfolio probablemente ya tiene un observer global para [data-reveal], 
  // podríamos no necesitar implementarlo, pero por si acaso despachamos un evento o usamos la API nativa.
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  document.querySelectorAll('#tech-stack-container .tech-badge').forEach(el => {
    observer.observe(el);
  });
}
