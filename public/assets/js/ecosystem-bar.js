/**
 * NainDev Ecosystem Navigation Bar (<nain-ecosystem-bar>), version 3.1.0 (core).
 * Specs 038, 041 and 051, ADR-0007. States: handle (default), open bar, edge tab.
 * Siblings resolved from this script's URL: ecosystem-bar-panel.js (lazy) and ../data/ecosystem.v1.json.
 */
(() => {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  if (customElements.get('nain-ecosystem-bar')) return;

  const SELF_URL = (document.currentScript && document.currentScript.src) || 'https://www.naindev.com/assets/js/ecosystem-bar.js';
  const PANEL_URL = new URL('ecosystem-bar-panel.js', SELF_URL).href;
  const DATA_URL = new URL('../data/ecosystem.v1.json', SELF_URL).href;
  const DATA_SCHEMA_VERSION = 1;
  // Captured before the observer wraps fetch, so the data load is not host traffic.
  const nativeFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : null;

  const STYLES = `
    :host { --bar-bg: rgba(5, 13, 26, 0.95); --bar-border: rgba(0, 71, 171, 0.35); --bar-text: #edf1f6; --bar-text-muted: #8ba2c4; --bar-accent: #0047ab; --bar-green: #80ff00; --bar-font: system-ui, "Segoe UI", Roboto, sans-serif; --bar-mono: ui-monospace, "IBM Plex Mono", Menlo, Consolas, monospace; --bar-zindex: 2147483647; display: block; font-family: var(--bar-font); font-size: 13px; line-height: 1.4; color: var(--bar-text); box-sizing: border-box; }
    *, *::before, *::after { box-sizing: inherit; margin: 0; padding: 0; }
    .bar { position: fixed; top: 0; left: 0; right: 0; height: 38px; background: var(--bar-bg); border-bottom: 1px solid var(--bar-border); backdrop-filter: blur(16px); z-index: var(--bar-zindex); display: flex; align-items: center; justify-content: space-between; padding: 0 14px; }
    .dot, .tab { position: fixed; left: env(safe-area-inset-left, 0px); top: 62%; z-index: var(--bar-zindex); cursor: pointer; border: 1px solid var(--bar-border); background: #002b66; color: var(--bar-green); font: 900 11px var(--bar-mono); opacity: 0.45; transition: 0.15s; }
    .dot { width: 24px; height: 24px; border-radius: 50%; transform: translateX(-55%); }
    .dot::after { content: ""; position: absolute; inset: -10px -14px -10px 0; }
    .tab { width: 6px; height: 36px; border-width: 1px 1px 1px 0; border-radius: 0 6px 6px 0; }
    .dot:hover, .dot:focus-visible, .tab:hover, .tab:focus-visible { opacity: 1; }
    .dot:hover, .dot:focus-visible { transform: none; }
    .tab:hover, .tab:focus-visible { width: 12px; }
    .dot:focus-visible, .tab:focus-visible { outline: 2px solid var(--bar-green); outline-offset: 2px; }
    @media (prefers-reduced-motion: reduce) { .dot, .tab { transition: none; }
     }
    .bar-left { display: flex; align-items: center; gap: 10px; }
    .brand-link { display: inline-flex; align-items: center; gap: 7px; color: #fff; font-weight: 700; text-decoration: none; letter-spacing: -0.01em; }
    .brand-link:hover, .brand-link:focus-visible { color: var(--bar-green); outline: none; }
    .brand-mark { width: 20px; height: 20px; border-radius: 4px; background: #002b66; border: 1px solid #0047ab; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: var(--bar-green); font-family: var(--bar-mono); }
    .project-pill { display: inline-flex; align-items: center; gap: 6px; background: rgba(0, 43, 102, 0.5); border: 1px solid rgba(0, 71, 171, 0.4); padding: 2px 9px; border-radius: 9999px; font-size: 11px; color: var(--bar-text-muted); }
    .project-pill strong { color: #fff; font-weight: 600; }
    .bar-right { display: flex; align-items: center; gap: 10px; }
    .dropdown-container { position: relative; }
    .btn { appearance: none; background: transparent; border: 1px solid transparent; color: var(--bar-text); font-family: inherit; font-size: 12px; padding: 4px 10px; border-radius: 5px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-weight: 500; }
    .btn:hover { background: rgba(255, 255, 255, 0.08); }
    .btn:focus-visible { outline: 2px solid var(--bar-green); outline-offset: 2px; }
    .btn-dropdown, .btn-telemetry { background: rgba(0, 43, 102, 0.5); border-color: var(--bar-accent); }
    .btn-dropdown:hover, .btn-telemetry:hover { background: #002b66; border-color: var(--bar-green); }
    .telemetry-icon { color: var(--bar-green); }
    .menu { position: absolute; top: calc(100% + 8px); right: 0; width: 360px; max-height: 480px; overflow-y: auto; background: #060d1a; border: 1px solid var(--bar-border); border-radius: 8px; box-shadow: 0 18px 40px rgba(0, 0, 0, 0.8); padding: 10px; display: none; flex-direction: column; gap: 12px; z-index: var(--bar-zindex); }
    .menu.open { display: flex; }
    .category-group { display: flex; flex-direction: column; gap: 4px; }
    .category-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--bar-green); padding: 2px 6px; font-family: var(--bar-mono); }
    .item-link { display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; border-radius: 5px; text-decoration: none; color: var(--bar-text); }
    .item-link:hover, .item-link:focus-visible { background: rgba(0, 71, 171, 0.25); }
    .item-info { display: flex; flex-direction: column; gap: 2px; }
    .item-name { font-weight: 600; font-size: 12px; color: #fff; }
    .item-desc { font-size: 11px; color: var(--bar-text-muted); }
    .item-tag { font-size: 10px; font-family: var(--bar-mono); background: rgba(0, 43, 102, 0.8); border: 1px solid rgba(0, 71, 171, 0.6); color: #8ba2c4; padding: 2px 6px; border-radius: 4px; }
    .bar-status { display: inline-flex; align-items: center; gap: 6px; text-decoration: none; font-size: 11px; font-family: var(--bar-mono); color: var(--bar-green); background: rgba(0, 43, 102, 0.3); border: 1px solid rgba(128, 255, 0, 0.2); padding: 3px 8px; border-radius: 9999px; }
    .bar-status:hover, .bar-status:focus-visible { border-color: var(--bar-green); }
    .status-dot { width: 6px; height: 6px; background: var(--bar-green); border-radius: 50%; }
    .btn-toggle { color: var(--bar-text-muted); padding: 4px 6px; }
    .btn-toggle:hover { color: #fff; }
    @media (max-width: 640px) { .project-pill, .bar-status, .btn-telemetry span { display: none; } .bar { padding: 0 8px; } .menu { position: fixed; top: 44px; left: 8px; right: 8px; width: auto; } }
  `;

  class NainEcosystemBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._state = 'min';
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
        if (name === 'collapsed') this._state = newValue === 'false' ? 'open' : 'min';
        this.render();
      }
    }

    connectedCallback() {
      if (this.getAttribute('collapsed') === 'false') this._state = 'open';
      else if (this._store('get') === 'off') this._state = 'off';
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

    // Storage can be missing or blocked.
    _store(op, value) {
      try {
        return op === 'get' ? window.localStorage.getItem('nain_bar') : window.localStorage.setItem('nain_bar', value);
      } catch (_) {
        return null;
      }
    }

    _setState(state) {
      this._state = state;
      this._menuOpen = this._drawerOpen = false;
      this._store('set', state === 'off' ? 'off' : 'on');
      this.render();
    }

    open() { this._setState('open'); }
    minimize() { this._setState('min'); }
    hide() { this._setState('off'); }

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
      if (window.fetch && !window.__nain_fetch_observed__) {
        window.__nain_fetch_observed__ = true;
        const origFetch = window.fetch;
        window.fetch = async (...args) => {
          const start = performance.now();
          const rawUrl = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
          const method = (args[1]?.method || 'GET').toUpperCase();
          const endpoint = rawUrl.replace(window.location.origin, '');
          const emit = (type, status, payload) => window.dispatchEvent(new CustomEvent('nain:telemetry', {
            detail: { type, name: `${method} ${endpoint}`, latencyMs: Math.round(performance.now() - start), status, payload }
          }));
          try {
            const res = await origFetch(...args);
            if (rawUrl && !/\.(js|css|svg|ico)|fonts\.googleapis/.test(rawUrl)) {
              emit(method === 'GET' ? 'Query' : 'Command', res.status, { method, endpoint, status: res.status, ok: res.ok });
            }
            return res;
          } catch (err) {
            if (rawUrl && !/\.(js|css)/.test(rawUrl)) {
              emit('Fallback', 200, { notice: 'Offline / In-Browser Fallback Engine Engaged', endpoint });
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
        if (e.target.closest('.btn-hide')) return this.hide();
        if (e.target.closest('.btn-toggle')) return this.minimize();
        if (e.target.closest('.dot')) return this.open();
        if (e.target.closest('.tab')) return this.minimize();

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

      // Pressing outside the open bar returns it to the handle.
      window.addEventListener('click', (e) => {
        if (this._state === 'open' && !(e.composedPath && e.composedPath().includes(this))) this.minimize();
      });

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          if (this._drawerOpen || this._menuOpen) {
            this._drawerOpen = false;
            this._menuOpen = false;
            this.render();
          } else if (this._state === 'open') {
            this.minimize();
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
            <a href="${item.url}" class="item-link">
              <div class="item-info">
                <span class="item-name">${item.name}</span>
                <span class="item-desc">${item.desc}</span>
              </div>
              <span class="item-tag">${item.tag}</span>
            </a>
          `).join('')}
        </div>
      `).join('');

      if (this._state !== 'open') {
        const off = this._state === 'off';
        this.shadowRoot.innerHTML = `
          <style>${STYLES}</style>
          <button type="button" class="${off ? 'tab' : 'dot'}" aria-label="${off ? 'Mostrar' : 'Abrir'} barra del ecosistema NainDev">${off ? '' : 'N'}</button>
        `;
        return;
      }

      const panelStyles = this._panel ? this._panel.styles : '';
      const panelHtml = hasData && this._panel && this._drawerOpen
        ? this._panel.renderDrawer(profile, { activeTab: this._activeTab, customTelemetry: this._customTelemetry })
        : '';

      this.shadowRoot.innerHTML = `
        <style>${STYLES}${panelStyles}</style>
        <div class="bar" role="navigation" aria-label="NainDev Suite">
          <div class="bar-left">
            <a href="https://www.naindev.com/" class="brand-link">
              <span class="brand-mark">N</span>
              <span>NainDev</span>
            </a>
            <div class="project-pill">
              <span>Plataforma</span>
              <strong>${currentProjectName}</strong>
            </div>
          </div>

            <div class="bar-right">
              ${hasData ? `
                <button type="button" class="btn btn-telemetry" aria-label="Arquitectura y telemetría" title="Arquitectura y telemetría (Alt+A)">
                  <svg class="telemetry-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  <span>Arquitectura</span>
                </button>

                <div class="dropdown-container">
                  <button type="button" class="btn btn-dropdown dropdown-toggle" aria-expanded="${this._menuOpen}" aria-haspopup="true" aria-label="Proyectos del ecosistema">
                    <span>Proyectos (${catalog.reduce((acc, c) => acc + c.items.length, 0)})</span>
                    <span aria-hidden="true">&#9662;</span>
                  </button>
                  <div class="menu ${this._menuOpen ? 'open' : ''}" role="menu">
                    ${menuHtml}
                  </div>
                </div>
              ` : ''}

              <a href="https://status.naindev.com/" class="bar-status" title="Estado de los servicios">
                <span class="status-dot" aria-hidden="true"></span>
                <span>100% OK</span>
              </a>

              <button type="button" class="btn btn-toggle" aria-label="Minimizar barra del ecosistema" title="Minimizar">&#9662;</button>
              <button type="button" class="btn btn-toggle btn-hide" aria-label="Ocultar barra del ecosistema" title="Ocultar">&#10005;</button>
            </div>
        </div>
        ${panelHtml}
      `;
    }
  }

  customElements.define('nain-ecosystem-bar', NainEcosystemBar);
})();
