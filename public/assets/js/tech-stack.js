export function initTechStack() {
  const container = document.getElementById('tech-stack-container');
  if (!container) return;

  fetch(dataUrl('tech-stack.json'))
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load tech-stack.json');
      }
      return response.json();
    })
    .then(data => {
      renderTechStack(data.categories, container);
      setupIntersectionObserver();
    })
    .catch(error => {
      console.error('Failed to initialize tech stack:', error);
      const notice = document.createElement('p');
      notice.className = 'notice';
      notice.textContent = message('technologyError');
      container.replaceChildren(notice);
    });
}

function renderTechStack(categories, container) {
  container.innerHTML = '';
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
      badge.setAttribute('data-reveal', ''); // Scroll reveal target
      
      const icon = document.createElement('img');
      icon.src = item.icon;
      icon.alt = message('technologyIcon', { name: item.name });
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
  // Reveal animation fallback for dynamically injected badges
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
import { dataUrl, message } from './locale.js';
