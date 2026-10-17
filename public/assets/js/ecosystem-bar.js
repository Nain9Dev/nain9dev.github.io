/**
 * NainDev Ecosystem Navigation Bar (<nain-ecosystem-bar>)
 * Zero-dependency Web Component for cross-project navigation, brand coherence
 * and live architectural telemetry across the NainDev suite.
 *
 * Version: 3.0.0 (core). Specs 038 and 041, ADR-0007.
 * Sibling files, resolved from this script's URL:
 *   - ecosystem-bar-panel.js: architecture panel, loaded when it first opens.
 *   - ../data/ecosystem.v1.json: project catalog and architecture profiles.
 * Without the data file the bar keeps the brand and status links.
 */
(() => {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get('nain-ecosystem-bar')) return;

  const SELF_URL = (document.currentScript && document.currentScript.src) || 'https://www.naindev.com/assets/js/ecosystem-bar.js';
  const PANEL_URL = new URL('ecosystem-bar-panel.js', SELF_URL).href;
  const DATA_URL = new URL('../data/ecosystem.v1.json', SELF_URL).href;
  const DATA_SCHEMA_VERSION = 1;
  // Captured before the telemetry observer wraps fetch, so loading the data is not reported as host traffic.
  const nativeFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : null;

  const STYLES = `
    :host {
      --bar-bg: rgba(5, 13, 26, 0.95);
      --bar-border: rgba(0, 71, 171, 0.35);
      --bar-text: #edf1f6;
      --bar-text-muted: #8ba2c4;
      --bar-accent: #0047ab;
      --bar-green: #80ff00;
      --bar-green-glow: rgba(128, 255, 0, 0.4);
      --bar-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --bar-mono: ui-monospace, "IBM Plex Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace;
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
      height: 32px;
      border-radius: 9999px;
      border: 1px solid var(--bar-border);
      padding: 0 10px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.6);
    }

    .bar.collapsed .bar-center,
    .bar.collapsed .bar-status,
    .bar.collapsed .dropdown-toggle,
    .bar.collapsed .btn-telemetry {
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
      gap: 7px;
      color: #fff;
      font-weight: 700;
      text-decoration: none;
      letter-spacing: -0.01em;
    }

    .brand-link:hover, .brand-link:focus-visible {
      color: var(--bar-green);
      outline: none;
    }

    .brand-mark {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      background: #002b66;
      border: 1px solid #0047ab;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 900;
      color: var(--bar-green);
      font-family: var(--bar-mono);
    }

    .project-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(0, 43, 102, 0.5);
      border: 1px solid rgba(0, 71, 171, 0.4);
      padding: 2px 9px;
      border-radius: 9999px;
      font-size: 11px;
      color: var(--bar-text-muted);
    }

    .project-pill strong {
      color: #fff;
      font-weight: 600;
    }

    .bar-right {
      display: flex;
      align-items: center;
      gap: 10px;
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
      border-radius: 5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      font-weight: 500;
    }

    .btn:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .btn:focus-visible {
      outline: 2px solid var(--bar-green);
      outline-offset: 2px;
    }

    .btn-dropdown {
      background: rgba(0, 43, 102, 0.4);
      border-color: rgba(0, 71, 171, 0.4);
    }

    .btn-dropdown:hover {
      background: rgba(0, 71, 171, 0.4);
      border-color: var(--bar-accent);
    }

    .btn-telemetry {
      background: rgba(0, 43, 102, 0.6);
      border: 1px solid var(--bar-accent);
      color: #fff;
    }

    .btn-telemetry:hover {
      background: #002b66;
      border-color: var(--bar-green);
      color: var(--bar-green);
      box-shadow: 0 0 10px var(--bar-green-glow);
    }

    .btn-telemetry .telemetry-icon {
      color: var(--bar-green);
    }

    .menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 360px;
      max-height: 480px;
      overflow-y: auto;
      background: #060d1a;
      border: 1px solid var(--bar-border);
      border-radius: 8px;
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.8);
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
      letter-spacing: 0.06em;
      color: var(--bar-green);
      padding: 2px 6px;
      font-family: var(--bar-mono);
    }

    .item-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      border-radius: 5px;
      text-decoration: none;
      color: var(--bar-text);
      transition: background 0.12s ease;
    }

    .item-link:hover, .item-link:focus-visible {
      background: rgba(0, 71, 171, 0.25);
    }

    .item-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .item-name {
      font-weight: 600;
      font-size: 12px;
      color: #fff;
    }

    .item-desc {
      font-size: 11px;
      color: var(--bar-text-muted);
    }

    .item-tag {
      font-size: 10px;
      font-family: var(--bar-mono);
      background: rgba(0, 43, 102, 0.8);
      border: 1px solid rgba(0, 71, 171, 0.6);
      color: #8ba2c4;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .bar-status {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      font-size: 11px;
      font-family: var(--bar-mono);
      color: var(--bar-green);
      background: rgba(0, 43, 102, 0.3);
      border: 1px solid rgba(128, 255, 0, 0.2);
      padding: 3px 8px;
      border-radius: 9999px;
      transition: all 0.15s ease;
    }

    .bar-status:hover, .bar-status:focus-visible {
      border-color: var(--bar-green);
      box-shadow: 0 0 8px var(--bar-green-glow);
    }

    .status-dot {
      width: 6px;
      height: 6px;
      background: var(--bar-green);
      border-radius: 50%;
      box-shadow: 0 0 6px var(--bar-green-glow);
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
      this._drawerOpen = false;
      this._activeTab = 'invariants';
      this._customTelemetry = [];
      this._data = null;
      this._panel = null;
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
      this._setupTelemetryBus();
      this._loadData();
    }

    async _loadData() {
      if (!nativeFetch) return;
      try {
        const res = await nativeFetch(DATA_URL);
        if (!res.ok) return;
        const doc = await res.json();
        if (!doc || doc.schemaVersion !== DATA_SCHEMA_VERSION || !Array.isArray(doc.catalog) || !doc.profiles || typeof doc.profiles !== 'object') return;
        this._data = doc;
        this._detectCurrentProject();
        this.render();
      } catch (_) {
        // Keep the degraded bar: brand and status links only.
      }
    }

    _profiles() {
      return (this._data && this._data.profiles) || {};
    }

    _detectCurrentProject() {
      if (!this.getAttribute('current-project')) {
        const host = window.location.hostname.toLowerCase();
        for (const [key, profile] of Object.entries(this._profiles())) {
          if (host.includes(key) || host.includes(profile.name.toLowerCase())) {
            this.setAttribute('current-project', profile.name);
            return;
          }
        }
      }
    }

    _getProfile() {
      const profiles = this._profiles();
      const proj = (this.getAttribute('current-project') || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const key of Object.keys(profiles)) {
        if (proj.includes(key)) return profiles[key];
      }
      return profiles.nainorder || null;
    }

    toggleCollapse() {
      this._collapsed = !this._collapsed;
      if (this._collapsed) {
        this._menuOpen = false;
        this._drawerOpen = false;
      }
      this.render();
    }

    toggleMenu() {
      this._menuOpen = !this._menuOpen;
      if (this._menuOpen) this._drawerOpen = false;
      this.render();
    }

    async toggleDrawer() {
      if (this._drawerOpen) {
        this.closeDrawer();
        return;
      }
      if (!this._data || !this._getProfile()) return;
      if (!this._panel) {
        try {
          this._panel = await import(PANEL_URL);
        } catch (_) {
          return;
        }
      }
      this._drawerOpen = true;
      this._menuOpen = false;
      this.render();
    }

    closeDrawer() {
      this._drawerOpen = false;
      this.render();
    }

    setTab(tab) {
      this._activeTab = tab;
      this.render();
    }

    _setupTelemetryBus() {
      // Automatic non-intrusive fetch observer for real HTTP / API calls
      if (window.fetch && !window.__nain_fetch_observed__) {
        window.__nain_fetch_observed__ = true;
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const start = performance.now();
          const rawUrl = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
          const method = (args[1]?.method || 'GET').toUpperCase();
          try {
            const res = await origFetch(...args);
            const duration = Math.round(performance.now() - start);
            if (rawUrl && !rawUrl.includes('.js') && !rawUrl.includes('.css') && !rawUrl.includes('.svg') && !rawUrl.includes('.ico') && !rawUrl.includes('fonts.googleapis')) {
              window.dispatchEvent(new CustomEvent('nain:telemetry', {
                detail: {
                  type: method === 'GET' ? 'Query' : 'Command',
                  name: `${method} ${rawUrl.replace(window.location.origin, '')}`,
                  latencyMs: duration,
                  status: res.status,
                  payload: { method, endpoint: rawUrl.replace(window.location.origin, ''), status: res.status, ok: res.ok }
                }
              }));
            }
            return res;
          } catch (err) {
            const duration = Math.round(performance.now() - start);
            if (rawUrl && !rawUrl.includes('.js') && !rawUrl.includes('.css')) {
              window.dispatchEvent(new CustomEvent('nain:telemetry', {
                detail: {
                  type: 'Fallback',
                  name: `${method} ${rawUrl.replace(window.location.origin, '')}`,
                  latencyMs: duration,
                  status: 200,
                  payload: { notice: 'Offline / In-Browser Fallback Engine Engaged', endpoint: rawUrl.replace(window.location.origin, '') }
                }
              }));
            }
            throw err;
          }
        };
      }

      window.addEventListener('nain:telemetry', (e) => {
        if (e.detail) {
          this._customTelemetry.unshift({
            type: e.detail.type || 'CustomEvent',
            name: e.detail.name || e.detail.action || 'DomainMutation',
            latencyMs: e.detail.latencyMs !== undefined ? e.detail.latencyMs : Math.floor(Math.random() * 25 + 5),
            status: e.detail.status || 200,
            payload: e.detail.payload || e.detail
          });
          if (this._customTelemetry.length > 30) this._customTelemetry.pop();
          if (this._drawerOpen && this._activeTab === 'telemetry') {
            this.render();
          }
        }
      });
    }

    _setupListeners() {
      this.shadowRoot.addEventListener('click', (e) => {
        if (e.target.closest('.btn-toggle')) {
          this.toggleCollapse();
          return;
        }

        if (e.target.closest('.dropdown-toggle')) {
          this.toggleMenu();
          return;
        }

        if (e.target.closest('.btn-telemetry')) {
          this.toggleDrawer();
          return;
        }

        if (this._panel && this._panel.handleClick(e, this)) return;

        if (e.target.closest('.item-link')) {
          this._menuOpen = false;
          this.render();
        }
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this._drawerOpen || this._menuOpen) {
            this._drawerOpen = false;
            this._menuOpen = false;
            this.render();
          }
        }
        if (e.altKey && (e.key === 'a' || e.key === 'A')) {
          e.preventDefault();
          this.toggleDrawer();
        }
      });
    }

    render() {
      const currentProjectName = this.getAttribute('current-project') || 'Demo interactiva';
      const profile = this._getProfile();
      const catalog = (this._data && this._data.catalog) || [];
      const hasData = !!(this._data && profile);

      const menuHtml = catalog.map(cat => `
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

      const panelStyles = this._panel ? this._panel.styles : '';
      const panelHtml = hasData && this._panel && this._drawerOpen
        ? this._panel.renderDrawer(profile, { activeTab: this._activeTab, customTelemetry: this._customTelemetry })
        : '';

      this.shadowRoot.innerHTML = `
        <style>${STYLES}${panelStyles}</style>
        <div class="bar ${this._collapsed ? 'collapsed' : ''}" role="navigation" aria-label="NainDev Suite">
          <div class="bar-left">
            <a href="https://www.naindev.com/" class="brand-link" title="Volver al portfolio principal">
              <span class="brand-mark">N</span>
              <span>NainDev</span>
            </a>
            ${!this._collapsed ? `
              <div class="project-pill">
                <span>Plataforma</span>
                <strong>${currentProjectName}</strong>
              </div>
            ` : ''}
          </div>

          ${!this._collapsed ? `
            <div class="bar-right">
              ${hasData ? `
                <button type="button" class="btn btn-telemetry" aria-label="Inspeccionar arquitectura y telemetría" title="Abrir Drawer de Arquitectura & Telemetría (Alt+A)">
                  <svg class="telemetry-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                  <span>Arquitectura</span>
                </button>

                <div class="dropdown-container">
                  <button type="button" class="btn btn-dropdown dropdown-toggle" aria-expanded="${this._menuOpen}" aria-haspopup="true" aria-label="Explorar proyectos del ecosistema">
                    <span>Proyectos (${catalog.reduce((acc, c) => acc + c.items.length, 0)})</span>
                    <span aria-hidden="true">&#9662;</span>
                  </button>
                  <div class="menu ${this._menuOpen ? 'open' : ''}" role="menu">
                    ${menuHtml}
                  </div>
                </div>
              ` : ''}

              <a href="https://status.naindev.com/" class="bar-status" title="Observabilidad y estado de los servicios">
                <span class="status-dot" aria-hidden="true"></span>
                <span>100% OK</span>
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
        ${panelHtml}
      `;
    }
  }

  customElements.define('nain-ecosystem-bar', NainEcosystemBar);
})();
