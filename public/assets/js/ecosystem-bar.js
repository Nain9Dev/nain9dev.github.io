/**
 * NainDev Ecosystem Navigation Bar (<nain-ecosystem-bar>)
 * Zero-dependency Web Component for cross-project navigation, brand coherence, and status visibility.
 */
(() => {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get('nain-ecosystem-bar')) return;

  const CATALOG = [
    {
      category: 'Backend & Cloud (.NET / Python)',
      items: [
        { name: 'NainPolicy', desc: 'Insurance operations engine & accounting', url: 'https://policy.naindev.com/', tag: '.NET 10' },
        { name: 'NainOrder', desc: 'Tactical DDD e-commerce order API', url: 'https://order.naindev.com/', tag: '.NET 10' },
        { name: 'NainDrive', desc: 'Driving school management & accounting', url: 'https://drive.naindev.com/', tag: 'Python' },
        { name: 'NainNotify', desc: 'Asynchronous notification dispatch worker', url: 'https://notify.naindev.com/', tag: '.NET 10' },
        { name: 'NainTAI', desc: 'Civil service examination simulator', url: 'https://tai.naindev.com/', tag: '.NET 10' }
      ]
    },
    {
      category: '3D Geometry & Validation',
      items: [
        { name: 'Nain3D', desc: 'Deterministic 3D asset validation engine', url: 'https://3d.naindev.com/', tag: 'FastAPI' },
        { name: 'ParametriCAD AI', desc: 'Parametric CAD engine & WebGL viewer', url: 'https://parametricad.naindev.com/', tag: 'OpenCASCADE' },
        { name: 'NainConfigurator', desc: 'Modular product configurator engine', url: 'https://configurator.naindev.com/', tag: '.NET 10' }
      ]
    },
    {
      category: 'Workbenches & Applications',
      items: [
        { name: 'NainProspect', desc: 'B2B lead generation & outreach pipeline', url: 'https://prospect.naindev.com/', tag: 'FastAPI' },
        { name: 'NainWrite', desc: 'Deterministic Spanish text rewriting workbench', url: 'https://write.naindev.com/', tag: 'TypeScript' },
        { name: 'HaveTickets', desc: 'Cinema ticketing & seat reservation platform', url: 'https://tickets.naindev.com/', tag: 'Blazor' },
        { name: 'GameHaven', desc: 'Indie game digital desktop storefront', url: 'https://gamehaven.naindev.com/', tag: 'WPF / Web' }
      ]
    },
    {
      category: 'Web Games (Zero Engine)',
      items: [
        { name: 'Orbe3D', desc: 'Procedural 3D arcade endless runner', url: 'https://orbe.naindev.com/', tag: 'Three.js' },
        { name: 'PongArcade', desc: 'Continuous collision 3D arena pong', url: 'https://pong.naindev.com/', tag: 'Canvas / WebGL' }
      ]
    }
  ];

  const STYLES = `
    :host {
      --bar-bg: rgba(9, 12, 19, 0.94);
      --bar-border: rgba(255, 255, 255, 0.08);
      --bar-text: #e2e8f0;
      --bar-text-muted: #94a3b8;
      --bar-accent: #38bdf8;
      --bar-accent-hover: #0ea5e9;
      --bar-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --bar-zindex: 2147483647;
      display: block;
      font-family: var(--bar-font);
      font-size: 13px;
      line-height: 1.4;
      color: var(--bar-text);
      box-sizing: border-box;
    }

    *, *::before, *::after {
      box-sizing: inherit;
      margin: 0;
      padding: 0;
    }

    .bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 38px;
      background: var(--bar-bg);
      border-bottom: 1px solid var(--bar-border);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: var(--bar-zindex);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .bar.collapsed {
      top: 10px;
      right: 14px;
      left: auto;
      width: auto;
      height: 30px;
      border-radius: 9999px;
      border: 1px solid var(--bar-border);
      padding: 0 10px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    }

    .bar.collapsed .bar-center,
    .bar.collapsed .bar-status,
    .bar.collapsed .dropdown-toggle {
      display: none;
    }

    .bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #fff;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: -0.01em;
    }

    .brand-link:hover, .brand-link:focus-visible {
      color: var(--bar-accent);
      outline: 2px solid var(--bar-accent);
      outline-offset: 2px;
      border-radius: 4px;
    }

    .brand-mark {
      width: 18px;
      height: 18px;
      border-radius: 4px;
      background: linear-gradient(135deg, #0284c7, #38bdf8);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      color: #040914;
    }

    .project-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 2px 8px;
      border-radius: 9999px;
      font-size: 11px;
      color: var(--bar-text-muted);
    }

    .project-pill strong {
      color: var(--bar-text);
      font-weight: 500;
    }

    .bar-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .dropdown-container {
      position: relative;
    }

    .btn {
      appearance: none;
      background: transparent;
      border: 1px solid transparent;
      color: var(--bar-text);
      font-family: inherit;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .btn:focus-visible {
      outline: 2px solid var(--bar-accent);
      outline-offset: 2px;
    }

    .btn-dropdown {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .btn-dropdown:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 360px;
      max-height: 480px;
      overflow-y: auto;
      background: #0b0f19;
      border: 1px solid var(--bar-border);
      border-radius: 8px;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
      padding: 10px;
      display: none;
      flex-direction: column;
      gap: 12px;
      z-index: var(--bar-zindex);
    }

    .menu.open {
      display: flex;
    }

    .category-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .category-title {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--bar-text-muted);
      padding: 2px 6px;
    }

    .item-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      border-radius: 6px;
      text-decoration: none;
      color: var(--bar-text);
      transition: background 0.12s ease;
    }

    .item-link:hover, .item-link:focus-visible {
      background: rgba(255, 255, 255, 0.06);
      outline: none;
    }

    .item-info {
      display: flex;
      flex-direction: column;
    }

    .item-name {
      font-weight: 500;
      font-size: 12px;
      color: #fff;
    }

    .item-desc {
      font-size: 11px;
      color: var(--bar-text-muted);
    }

    .item-tag {
      font-size: 10px;
      background: rgba(56, 189, 248, 0.12);
      color: var(--bar-accent);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }

    .bar-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: var(--bar-text-muted);
      text-decoration: none;
      padding: 3px 8px;
      border-radius: 6px;
    }

    .bar-status:hover, .bar-status:focus-visible {
      color: #fff;
      outline: 2px solid var(--bar-accent);
      outline-offset: 2px;
    }

    .status-dot {
      width: 7px;
      height: 7px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
    }

    .btn-toggle {
      color: var(--bar-text-muted);
      padding: 4px 6px;
      border-radius: 4px;
    }

    .btn-toggle:hover {
      color: #fff;
    }
  `;

  class NainEcosystemBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._collapsed = false;
      this._menuOpen = false;
    }

    static get observedAttributes() {
      return ['current-project', 'collapsed'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue !== newValue) {
        if (name === 'collapsed') {
          this._collapsed = newValue !== null && newValue !== 'false';
        }
        this.render();
      }
    }

    connectedCallback() {
      this.render();
      this._setupListeners();
    }

    toggleCollapse() {
      this._collapsed = !this._collapsed;
      if (this._collapsed) {
        this._menuOpen = false;
      }
      this.render();
    }

    toggleMenu() {
      this._menuOpen = !this._menuOpen;
      this.render();
    }

    _setupListeners() {
      this.shadowRoot.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.btn-toggle');
        if (toggleBtn) {
          this.toggleCollapse();
          return;
        }

        const dropdownBtn = e.target.closest('.dropdown-toggle');
        if (dropdownBtn) {
          this.toggleMenu();
          return;
        }

        // Close dropdown when clicking an item link
        if (e.target.closest('.item-link')) {
          this._menuOpen = false;
          this.render();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this._menuOpen) {
          this._menuOpen = false;
          this.render();
        }
      });

      document.addEventListener('click', (e) => {
        if (!this.contains(e.target) && this._menuOpen) {
          this._menuOpen = false;
          this.render();
        }
      });
    }

    render() {
      const currentProject = this.getAttribute('current-project') || 'Demo interactiva';

      const menuHtml = CATALOG.map(cat => `
        <div class="category-group">
          <div class="category-title">${cat.category}</div>
          ${cat.items.map(item => `
            <a href="${item.url}" class="item-link" title="${item.desc}">
              <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-desc">${item.desc}</span>
              </div>
              <span class="item-tag">${item.tag}</span>
            </a>
          `).join('')}
        </div>
      `).join('');

      this.shadowRoot.innerHTML = `
        <style>${STYLES}</style>
        <div class="bar ${this._collapsed ? 'collapsed' : ''}" role="navigation" aria-label="NainDev Suite">
          <div class="bar-left">
            <a href="https://www.naindev.com/" class="brand-link" title="Volver al portfolio principal">
              <span class="brand-mark">N</span>
              <span>NainDev</span>
            </a>
            ${!this._collapsed ? `
              <div class="project-pill">
                <span>Plataforma</span>
                <strong>${currentProject}</strong>
              </div>
            ` : ''}
          </div>

          ${!this._collapsed ? `
            <div class="bar-right">
              <div class="dropdown-container">
                <button type="button" class="btn btn-dropdown dropdown-toggle" aria-expanded="${this._menuOpen}" aria-haspopup="true" aria-label="Explorar proyectos del ecosistema">
                  <span>Proyectos (${CATALOG.reduce((acc, c) => acc + c.items.length, 0)})</span>
                  <span aria-hidden="true">&#9662;</span>
                </button>
                <div class="menu ${this._menuOpen ? 'open' : ''}" role="menu">
                  ${menuHtml}
                </div>
              </div>

              <a href="https://status.naindev.com/" class="bar-status" title="Observabilidad y estado de los servicios">
                <span class="status-dot" aria-hidden="true"></span>
                <span>Estado: 100% OK</span>
              </a>

              <button type="button" class="btn btn-toggle" aria-label="Minimizar barra del ecosistema" title="Minimizar">
                &#9650;
              </button>
            </div>
          ` : `
            <button type="button" class="btn btn-toggle" aria-label="Expandir barra del ecosistema" title="Expandir">
              &#9660;
            </button>
          `}
        </div>
      `;
    }
  }

  customElements.define('nain-ecosystem-bar', NainEcosystemBar);
})();
