import { initializeRevealMotion } from "./site-interactions.js";

export class CaseStudiesManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.dataPath = '/assets/data/case-studies.json';
    this.cleanupReveal = null;
    this.observer = null;
    this.cardListeners = [];
    
    if (!this.container) {
      console.warn(`[CaseStudiesManager] Contenedor #${containerId} no encontrado.`);
      return;
    }
  }

  async init() {
    console.log('[CaseStudiesManager] init() ejecutado');
    if (!this.container) {
      return this;
    }
    try {
      const data = await this.fetchData();
      if (data && data.length > 0) {
        this.render(data);
        
        this.observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            this.initMermaid();
            if (this.observer) {
              this.observer.disconnect();
              this.observer = null;
            }
          }
        }, { rootMargin: '200px' });
        this.observer.observe(this.container);
        
        this.cleanupReveal = initializeRevealMotion(this.container.querySelectorAll("[data-reveal]"));
        
        const cards = this.container.querySelectorAll('.case-study-card');
        cards.forEach(card => {
          const titleElement = card.querySelector('.case-study-title');
          const clickHandler = () => {
            if (titleElement) {
              window.plausible && window.plausible('View Case Study', { props: { title: titleElement.textContent } });
            }
          };
          card.addEventListener('click', clickHandler);
          this.cardListeners.push({ element: card, handler: clickHandler });
        });
      }
    } catch (error) {
      console.error('[CaseStudiesManager] Error inicializando.', error);
    }
    return this;
  }

  async fetchData() {
    const response = await fetch(this.dataPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  render(studies) {
    const html = studies.map(study => this.createCardHTML(study)).join('');
    this.container.innerHTML = `<div class="case-studies-grid">${html}</div>`;
  }

  createCardHTML(study) {
    const decisionsHtml = study.decisions.map(d => `<li>${d}</li>`).join('');
    const resultsHtml = study.results.map(r => `<li>${r}</li>`).join('');
    
    let diagramHtml = '';
    if (study.diagram) {
      diagramHtml = `
        <div class="case-study-diagram">
          <div class="mermaid">
            ${study.diagram}
          </div>
        </div>
      `;
    }

    const techHtml = study.technologies ? study.technologies.map(tech => `<span class="tech-badge-small">${tech}</span>`).join('') : '';
    const techSection = techHtml ? `
      <div class="case-study-section tech-section">
        <div class="tech-badge-container" style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem;">
          ${techHtml}
        </div>
      </div>
    ` : '';

    return `
      <article class="case-study-card" data-reveal>
        <div class="case-study-header">
          <p class="case-study-eyebrow">${study.title}</p>
          <h3 class="case-study-title">${study.subtitle}</h3>
        </div>
        <div class="case-study-body">
          <div class="case-study-section">
            <h4>El Problema</h4>
            <p>${study.problem}</p>
          </div>
          <div class="case-study-section">
            <h4>Decisiones Arquitectónicas</h4>
            <ul class="case-study-list decisions-list">
              ${decisionsHtml}
            </ul>
          </div>
          ${diagramHtml}
          <div class="case-study-section">
            <h4>Trade-offs</h4>
            <p class="case-study-tradeoff">${study.tradeoffs || study.tradeOffs}</p>
          </div>
          <div class="case-study-section results-section">
            <h4>Resultados</h4>
            <ul class="case-study-list results-list">
              ${resultsHtml}
            </ul>
          </div>
          ${techSection}
        </div>
      </article>
    `;
  }

  initMermaid() {
    if (window.mermaid) {
      window.mermaid.initialize({ startOnLoad: true, theme: 'dark' });
      window.mermaid.run();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
    script.onload = () => {
      if (window.mermaid) {
        window.mermaid.initialize({ startOnLoad: true, theme: 'dark' });
        window.mermaid.run();
      }
    };
    document.head.appendChild(script);
  }

  destroy() {
    if (this.cleanupReveal) {
      this.cleanupReveal();
      this.cleanupReveal = null;
    }
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.cardListeners.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler);
    });
    this.cardListeners = [];
  }
}
