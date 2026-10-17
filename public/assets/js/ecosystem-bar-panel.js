/**
 * NainDev Ecosystem Bar: architecture and telemetry panel (ES module).
 * Loaded by ecosystem-bar.js the first time the panel opens (spec 041, ADR-0007).
 */

export const styles = `
    /* ARCHITECTURE DRAWER & BACKDROP */
    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(4, 9, 20, 0.65);
      backdrop-filter: blur(4px);
      z-index: calc(var(--bar-zindex) - 1);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .drawer-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      max-width: 95vw;
      background: #050e1c;
      border-left: 1px solid rgba(0, 71, 171, 0.5);
      box-shadow: -12px 0 40px rgba(0, 0, 0, 0.85);
      z-index: var(--bar-zindex);
      transform: translateX(100%);
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .drawer.open {
      transform: translateX(0);
    }

    .drawer-header {
      padding: 16px 20px;
      background: #002b66;
      border-bottom: 1px solid rgba(0, 71, 171, 0.5);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .drawer-title-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .drawer-title {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.01em;
    }

    .drawer-subtitle {
      font-size: 11px;
      color: var(--bar-green);
      font-family: var(--bar-mono);
      margin-top: 2px;
    }

    .btn-close {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      font-size: 16px;
      line-height: 1;
      width: 28px;
      height: 28px;
      border-radius: 5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #fff;
    }

    .drawer-tabs {
      display: flex;
      border-bottom: 1px solid rgba(0, 71, 171, 0.4);
      background: #061122;
    }

    .drawer-tab {
      flex: 1;
      appearance: none;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--bar-text-muted);
      font-family: inherit;
      font-size: 11px;
      font-weight: 600;
      padding: 10px 8px;
      cursor: pointer;
      transition: all 0.15s ease;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .drawer-tab:hover {
      color: #fff;
      background: rgba(0, 71, 171, 0.15);
    }

    .drawer-tab.active {
      color: var(--bar-green);
      border-bottom-color: var(--bar-green);
      background: rgba(0, 43, 102, 0.4);
    }

    .drawer-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .meta-box {
      background: rgba(0, 43, 102, 0.25);
      border: 1px solid rgba(0, 71, 171, 0.4);
      border-radius: 6px;
      padding: 12px;
    }

    .meta-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      padding: 4px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .meta-row:last-child {
      border-bottom: none;
    }

    .meta-label {
      color: var(--bar-text-muted);
    }

    .meta-val {
      font-weight: 600;
      font-family: var(--bar-mono);
      font-size: 11px;
      color: #fff;
    }

    .meta-val.green {
      color: var(--bar-green);
    }

    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--bar-green);
      font-family: var(--bar-mono);
      margin-bottom: 8px;
    }

    .invariant-card {
      background: #08152c;
      border: 1px solid rgba(0, 71, 171, 0.4);
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 8px;
    }

    .invariant-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 4px;
    }

    .check-icon {
      color: var(--bar-green);
      font-weight: 800;
    }

    .invariant-label {
      font-weight: 600;
      font-size: 12px;
      color: #fff;
    }

    .invariant-rule {
      font-size: 11px;
      color: var(--bar-text-muted);
      line-height: 1.4;
      padding-left: 18px;
    }

    .telemetry-feed {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .telemetry-item {
      background: #061122;
      border: 1px solid rgba(0, 71, 171, 0.4);
      border-radius: 6px;
      padding: 10px;
      font-family: var(--bar-mono);
      font-size: 11px;
    }

    .telemetry-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .telemetry-type {
      background: rgba(0, 71, 171, 0.4);
      color: var(--bar-green);
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 700;
    }

    .telemetry-latency {
      color: var(--bar-green);
      font-size: 10px;
    }

    .telemetry-name {
      font-weight: 600;
      color: #fff;
      margin-bottom: 6px;
    }

    .telemetry-payload {
      background: #030812;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 4px;
      padding: 8px;
      overflow-x: auto;
      color: #8ba2c4;
      font-size: 10px;
      line-height: 1.35;
      white-space: pre;
    }

    .btn-simulate {
      appearance: none;
      background: #002b66;
      border: 1px solid var(--bar-accent);
      color: #fff;
      font-family: var(--bar-mono);
      font-size: 11px;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      text-align: center;
      font-weight: 600;
      transition: all 0.15s ease;
    }

    .btn-simulate:hover {
      background: #0047ab;
      border-color: var(--bar-green);
      color: var(--bar-green);
      box-shadow: 0 0 10px var(--bar-green-glow);
    }

    .link-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: rgba(0, 43, 102, 0.4);
      border: 1px solid rgba(0, 71, 171, 0.5);
      color: #fff;
      text-decoration: none;
      padding: 8px 12px;
      border-radius: 5px;
      font-size: 11px;
      font-weight: 500;
      transition: all 0.15s ease;
    }

    .link-button:hover {
      background: rgba(0, 71, 171, 0.6);
      border-color: var(--bar-green);
      color: var(--bar-green);
    }
  `;

// Telemetry values come from the host page, so they are escaped before reaching innerHTML.
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function tabContent(profile, state) {
  if (state.activeTab === 'invariants') {
    return `
      <div class="meta-box">
        <div class="meta-row">
          <span class="meta-label">Arquitectura</span>
          <span class="meta-val">${profile.stack}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Patrón de Diseño</span>
          <span class="meta-val">${profile.pattern}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">FinOps Recurrente</span>
          <span class="meta-val green">0,00 € / mes (Verificado)</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Métricas / SLA</span>
          <span class="meta-val green">${profile.sla}</span>
        </div>
      </div>

      <div>
        <div class="section-title">Compuertas Deterministas Activas</div>
        ${profile.invariants.map(inv => `
          <div class="invariant-card">
            <div class="invariant-header">
              <span class="check-icon">✓</span>
              <span class="invariant-label">${inv.label}</span>
            </div>
            <div class="invariant-rule">${inv.rule}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (state.activeTab === 'telemetry') {
    const events = [...state.customTelemetry, ...profile.sampleEvents];
    return `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div class="section-title">Bus de Telemetría en Tiempo Real</div>
        <button type="button" class="btn-simulate">+ Simular Invariante</button>
      </div>
      <div class="telemetry-feed">
        ${events.map(evt => `
          <div class="telemetry-item">
            <div class="telemetry-item-header">
              <span class="telemetry-type">${esc(evt.type)}</span>
              <span class="telemetry-latency">${esc(evt.latencyMs)} ms · HTTP ${esc(evt.status)}</span>
            </div>
            <div class="telemetry-name">${esc(evt.name)}</div>
            <pre class="telemetry-payload">${esc(JSON.stringify(evt.payload, null, 2))}</pre>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `
    <div class="section-title">Documentación & Gobernanza</div>
    <div style="display: flex; flex-direction: column; gap: 8px;">
      <a href="${profile.repo}" target="_blank" rel="noopener noreferrer" class="link-button">
        <span>Repositorio Oficial en GitHub</span>
      </a>
      <a href="${profile.docs}" target="_blank" rel="noopener noreferrer" class="link-button">
        <span>Especificación & ADRs (docs/)</span>
      </a>
      <a href="https://github.com/Nain9Dev/engineering-handbook" target="_blank" rel="noopener noreferrer" class="link-button">
        <span>NainDev Engineering Handbook (Paved Road)</span>
      </a>
      <a href="https://brand.naindev.com/" target="_blank" rel="noopener noreferrer" class="link-button">
        <span>Manual de Marca & Design Tokens v1.5</span>
      </a>
      <a href="https://status.naindev.com/" target="_blank" rel="noopener noreferrer" class="link-button">
        <span>Monitor de Observabilidad & Estado</span>
      </a>
    </div>
  `;
}

export function renderDrawer(profile, state) {
  const tab = (id, label) => `<button type="button" class="drawer-tab ${state.activeTab === id ? 'active' : ''}" data-tab="${id}">${label}</button>`;
  return `
    <div class="drawer-backdrop open"></div>
    <aside class="drawer open" role="dialog" aria-modal="true" aria-label="Inspector de Arquitectura & Telemetría">
      <div class="drawer-header">
        <div class="drawer-title-wrap">
          <span class="brand-mark">N</span>
          <div>
            <div class="drawer-title">${profile.name} — ${profile.title}</div>
            <div class="drawer-subtitle">INSPECTOR DE ARQUITECTURA & COMPUERTAS</div>
          </div>
        </div>
        <button type="button" class="btn-close" aria-label="Cerrar panel de arquitectura">&#10005;</button>
      </div>

      <div class="drawer-tabs">
        ${tab('invariants', 'Invariantes')}
        ${tab('telemetry', 'Telemetría')}
        ${tab('governance', 'Gobernanza')}
      </div>

      <div class="drawer-content">
        ${tabContent(profile, state)}
      </div>
    </aside>
  `;
}

// Returns true when the click belonged to the panel. The host exposes closeDrawer() and setTab(tab).
export function handleClick(event, host) {
  if (event.target.closest('.btn-close') || event.target.closest('.drawer-backdrop')) {
    host.closeDrawer();
    return true;
  }

  const tabBtn = event.target.closest('.drawer-tab');
  if (tabBtn) {
    host.setTab(tabBtn.dataset.tab);
    return true;
  }

  if (event.target.closest('.btn-simulate')) {
    window.dispatchEvent(new CustomEvent('nain:telemetry', {
      detail: {
        type: 'InvariantAssert',
        name: 'AssertRuntimeInvariant',
        latencyMs: Math.floor(Math.random() * 15 + 2),
        status: 200,
        payload: { timestamp: new Date().toISOString(), memoryDeltaBytes: 0, deterministicCheck: 'PASS', isolationZone: 'Strict' }
      }
    }));
    return true;
  }

  return false;
}
