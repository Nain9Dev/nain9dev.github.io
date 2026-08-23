import { initializeRevealMotion } from "./site-interactions.js";

export class ImpactMetricsManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.dataPath = '/assets/data/impact-metrics.json';
    this.cleanupReveal = null;
    
    if (!this.container) {
      console.warn(`[ImpactMetricsManager] Contenedor #${containerId} no encontrado.`);
      return;
    }
  }

  async init() {
    console.log('[ImpactMetricsManager] init() ejecutado');
    if (!this.container) {
      return this;
    }
    try {
      const data = await this.fetchData();
      if (data && data.length > 0) {
        this.render(data);
        this.cleanupReveal = initializeRevealMotion(this.container.querySelectorAll("[data-reveal]"));
      }
    } catch (error) {
      console.error('[ImpactMetricsManager] Error inicializando.', error);
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

  render(metrics) {
    const html = metrics.map(metric => this.createCardHTML(metric)).join('');
    this.container.innerHTML = `<div class="impact-metrics-grid">${html}</div>`;
  }

  createCardHTML(metric) {
    return `
      <article class="impact-metric-card" data-reveal>
        ${metric.icon ? `<div class="impact-metric-icon" style="font-size: 2rem; margin-bottom: 0.5rem;">${metric.icon}</div>` : ''}
        <div class="impact-metric-value">${metric.value}</div>
        <h3 class="impact-metric-label">${metric.label}</h3>
        ${metric.description ? `<p class="impact-metric-description">${metric.description}</p>` : ''}
      </article>
    `;
  }

  destroy() {
    if (this.cleanupReveal) {
      this.cleanupReveal();
      this.cleanupReveal = null;
    }
  }
}
