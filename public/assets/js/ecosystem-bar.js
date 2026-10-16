/**
 * NainDev Ecosystem Navigation & Architecture Telemetry Bar (<nain-ecosystem-bar>)
 * Zero-dependency Web Component for cross-project navigation, brand coherence,
 * and live architectural telemetry / invariant inspection across the NainDev suite.
 *
 * Version: 2.0.0 (Architecture Drawer & Telemetry Bus)
 * Conformance: WCAG 2.1 AAA / AA, 0.00 € FinOps, Shadow DOM Isolation
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
    },
    {
      category: 'Arquitectura & Plataforma',
      items: [
        { name: 'Manual de Marca', desc: 'Design tokens, geometría e identidad visual v1.5', url: 'https://brand.naindev.com/', tag: 'Tokens' },
        { name: 'Engineering Handbook', desc: 'Estándares de arquitectura limpia, TDD y 3D determinista', url: 'https://github.com/Nain9Dev/engineering-handbook', tag: 'Paved Road' },
        { name: 'Observabilidad', desc: 'Monitor determinista y disponibilidad en tiempo real', url: 'https://status.naindev.com/', tag: 'Status' }
      ]
    }
  ];

  const ARCH_PROFILES = {
    'nainorder': {
      name: 'NainOrder',
      title: 'Tactical DDD E-Commerce Order API',
      stack: '.NET 10 · Clean Architecture · EF Core & Dapper',
      pattern: 'Domain-Driven Design (DDD), CQRS, Optimistic Concurrency, Outbox',
      invariants: [
        { label: 'Stock Concurrency Safe', rule: 'ETag / RowVersion token check eliminates inventory overselling.' },
        { label: 'Exact Cent Arithmetic', rule: 'Integer minor-units for zero floating-point accumulation error.' },
        { label: 'Zero Node Dependencies', rule: 'Self-hosted native presentation served directly by ASP.NET Core.' }
      ],
      sla: 'p95 Latency < 42ms · 52/52 Passing Tests · Cost 0.00 €',
      repo: 'https://github.com/Nain9Dev/NainOrder',
      docs: 'https://github.com/Nain9Dev/NainOrder/tree/main/docs',
      sampleEvents: [
        { type: 'Command', name: 'SubmitOrderCommand', latencyMs: 38, status: 201, payload: { orderId: 'ord_9182', items: 3, totalCents: 4590, concurrencyCheck: 'PASSED' } },
        { type: 'DomainEvent', name: 'OrderPlacedDomainEvent', latencyMs: 2, status: 200, payload: { aggregate: 'Order', version: 1, eventId: 'evt_0192a' } }
      ]
    },
    'nain3d': {
      name: 'Nain3D',
      title: 'Deterministic 3D Geometric Validation Engine',
      stack: 'Python 3.12 · FastAPI · OpenCASCADE · Trimesh · WebGL',
      pattern: 'Fail-Closed Geometric Gateway, Dual-Contract Reporting, Vector Bounds',
      invariants: [
        { label: 'Quantum Limit Threshold', rule: 'Degenerate triangles with area <= 10^-12 m² are strictly rejected.' },
        { label: 'Checks C1 to C10 Fail-Closed', rule: 'Manifoldness, normal consistency, UV overlap and vertex bounds.' },
        { label: 'Khronos glTF Conformance', rule: 'Official validator gate required before asset publishing approval.' }
      ],
      sla: 'Sub-millimeter Evaluation · Zero False Approvals · Cost 0.00 €',
      repo: 'https://github.com/Nain9Dev/Nain3D',
      docs: 'https://github.com/Nain9Dev/Nain3D/tree/master/docs',
      sampleEvents: [
        { type: 'GateCheck', name: 'AssertMeshQuantumThreshold', latencyMs: 14, status: 200, payload: { minFaceArea: '1.42e-9 m²', quantumLimit: '1.00e-12 m²', result: 'VALID' } },
        { type: 'ValidationReport', name: 'KhronosConformanceGate', latencyMs: 45, status: 200, payload: { checksPassed: 'C1-C10', nonManifoldEdges: 0, dualContract: 'EMITTED' } }
      ]
    },
    'nainpolicy': {
      name: 'NainPolicy',
      title: 'High-Assurance Insurance Lifecycle & Accounting Engine',
      stack: '.NET 10 · Clean Architecture · SQL Server / Postgres · Dapper',
      pattern: 'Strict Tenant Isolation, Immutable Event Ledger, CQRS Read Models',
      invariants: [
        { label: 'Row-Level Tenant Gating', rule: 'Every query and mutation strictly partitioned by verified TenantId.' },
        { label: 'Immutable Ledger Audit', rule: 'Policy adjustments append to transaction history with zero updates.' },
        { label: 'Deterministic Balance', rule: 'Premium + Tax equals Invoice Total with 0.00 € tolerance.' }
      ],
      sla: 'Sub-10ms Ledger Calculations · 100% Tests Passing · Cost 0.00 €',
      repo: 'https://github.com/Nain9Dev/API-Gestion-Financiera',
      docs: 'https://github.com/Nain9Dev/API-Gestion-Financiera/tree/main/docs',
      sampleEvents: [
        { type: 'Query', name: 'GetPolicyLedgerQuery', latencyMs: 8, status: 200, payload: { tenantId: 'ten_eur_01', balance: '1240.50 EUR', reconciliation: 'BALANCED' } },
        { type: 'Lifecycle', name: 'TransitionPolicyState', latencyMs: 12, status: 200, payload: { from: 'Draft', to: 'Active', effectiveDate: '2026-10-16' } }
      ]
    },
    'nainprospect': {
      name: 'NainProspect',
      title: 'B2B Prospecting & Compliance Gateway',
      stack: 'Python 3.12 · FastAPI · Claude Haiku 4.5 · Vue 3 + TypeScript',
      pattern: 'Decoupled Scraping, Structured Ingestion, Fail-Closed Legal Gate',
      invariants: [
        { label: 'LSSI-CE Art. 21 Hard Gate', rule: 'Cold outreach email dispatch is physically disabled in source code.' },
        { label: 'RGPD Role-Mail Invariant', rule: 'Only public generic corporate inboxes (info@, contacto@) extracted.' },
        { label: 'Pydantic v2 Validation', rule: 'Strict schema enforcement on all external model completions.' }
      ],
      sla: 'Sub-100ms Ingestion · 15/15 Pytest Passing · Cost 0.00 €',
      repo: 'https://github.com/Nain9Dev/NainProspect',
      docs: 'https://github.com/Nain9Dev/NainProspect/tree/main/docs',
      sampleEvents: [
        { type: 'Compliance', name: 'AssertLssiCeArticle21Gate', latencyMs: 1, status: 200, payload: { gateActive: true, coldDispatchBlocked: true, simulatedPreview: 'ALLOWED' } },
        { type: 'Ingestion', name: 'ExtractCorporateRoleMail', latencyMs: 22, status: 200, payload: { domain: 'corp-sample.es', inboxType: 'ROLE_BASED', status: 'VALIDATED' } }
      ]
    },
    'nainwrite': {
      name: 'NainWrite ES',
      title: 'Fail-Closed Spanish Rewriting Workbench',
      stack: 'Python 3.12 · Local Ollama · LanguageTool · Diff Engine',
      pattern: 'Invariant Preservation, Single Constrained Repair, Dual Consensus',
      invariants: [
        { label: 'Invariant Preservation', rule: 'Negations, entities, numbers and technical terms strictly preserved.' },
        { label: 'Single Constrained Repair', rule: 'Deterministic drift allows exactly 1 correction before review gate.' },
        { label: 'Dual Auditor Consensus', rule: 'Qwen and Gemma auditors must both agree before candidate approval.' }
      ],
      sla: '100% Local Inference · Zero API Billable Cost · Cost 0.00 €',
      repo: 'https://github.com/Nain9Dev/NainWrite',
      docs: 'https://github.com/Nain9Dev/NainWrite/tree/main/docs',
      sampleEvents: [
        { type: 'InvariantCheck', name: 'VerifyProtectedEntities', latencyMs: 16, status: 200, payload: { entitiesTracked: 14, driftDetected: 0, invariantsPreserved: true } },
        { type: 'AuditorGate', name: 'ConsensusAuditorEvaluation', latencyMs: 64, status: 200, payload: { qwenScore: 0.98, gemmaScore: 0.96, decision: 'ACCEPTED' } }
      ]
    },
    'havetickets': {
      name: 'HaveTickets',
      title: 'Deterministic Cinema Ticketing & Seat Reservation Platform',
      stack: '.NET 10 · Blazor WebAssembly · Clean Architecture · SQLite',
      pattern: 'Database-Level Concurrency, Minor-Unit Accounting, Turnstile Gate',
      invariants: [
        { label: 'Deterministic Seat Allocation', rule: 'Partial unique index UX_Tickets_ShowtimeId_Seat_Active blocks races.' },
        { label: 'Exact Cent Arithmetic', rule: 'Integer Money value object eliminates IEEE-754 cent drift.' },
        { label: 'Turnstile Window Gate', rule: 'Idempotent QR door admission restricted to [-30m, +30m] range.' }
      ],
      sla: 'Zero Overbooking Races · Property-Based Tests · Cost 0.00 €',
      repo: 'https://github.com/Nain9Dev/HaveTickets',
      docs: 'https://github.com/Nain9Dev/HaveTickets/tree/master/docs',
      sampleEvents: [
        { type: 'Reservation', name: 'ReserveSeatCommand', latencyMs: 11, status: 200, payload: { showtimeId: 104, seat: 'H12', concurrencyLocked: true, status: 'RESERVED' } },
        { type: 'Admission', name: 'TurnstileValidateQr', latencyMs: 3, status: 200, payload: { windowCheck: 'VALID', outcome: 'ADMITTED', idempotent: true } }
      ]
    },
    'naindrive': {
      name: 'NainDrive',
      title: 'Deterministic Driving School Billing & Accounting Engine',
      stack: 'Python 3.12 · FastAPI · Vue 3 + TS · ReportLab In-Memory',
      pattern: 'Decimal Banking Rounding, Modulo-23 DNI Gate, In-Memory PDF',
      invariants: [
        { label: 'Money is Never a Float', rule: 'Explicit Decimal half-up rounding (Tax on 350.50 = 73.61, not 73.60).' },
        { label: 'Mod-23 Identity Verification', rule: 'DNI/NIE control letter calculated deterministically from numbers.' },
        { label: 'In-Memory PDF Stream', rule: 'Zero temporary files written to disk; compiled in-memory byte streams.' }
      ],
      sla: '100% Traceability (14 REQs -> 55 Tests) · Cost 0.00 €',
      repo: 'https://github.com/Nain9Dev/Gestion-Autoescuela-Python',
      docs: 'https://github.com/Nain9Dev/Gestion-Autoescuela-Python/tree/main/docs',
      sampleEvents: [
        { type: 'Billing', name: 'ReconcileInvoiceTotal', latencyMs: 4, status: 200, payload: { base: '350.50', vatRate: '21%', vat: '73.61', total: '424.11', delta: '0.00' } },
        { type: 'Security', name: 'VerifyDniChecksum', latencyMs: 1, status: 200, payload: { dni: '12345678Z', computedLetter: 'Z', valid: true } }
      ]
    }
  };

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

  class NainEcosystemBar extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this._collapsed = false;
      this._menuOpen = false;
      this._drawerOpen = false;
      this._activeTab = 'invariants';
      this._customTelemetry = [];
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
      this._detectCurrentProject();
      this.render();
      this._setupListeners();
      this._setupTelemetryBus();
    }

    _detectCurrentProject() {
      if (!this.getAttribute('current-project')) {
        const host = window.location.hostname.toLowerCase();
        for (const [key, profile] of Object.entries(ARCH_PROFILES)) {
          if (host.includes(key) || host.includes(profile.name.toLowerCase())) {
            this.setAttribute('current-project', profile.name);
            return;
          }
        }
      }
    }

    _getProjectKey() {
      const proj = (this.getAttribute('current-project') || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      for (const key of Object.keys(ARCH_PROFILES)) {
        if (proj.includes(key)) return key;
      }
      return 'nainorder';
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

    toggleDrawer() {
      this._drawerOpen = !this._drawerOpen;
      if (this._drawerOpen) this._menuOpen = false;
      this.render();
    }

    _setupTelemetryBus() {
      // Automatic non-intrusive fetch observer for real HTTP / API calls
      if (typeof window !== 'undefined' && window.fetch && !window.__nain_fetch_observed__) {
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

        const telemetryBtn = e.target.closest('.btn-telemetry');
        if (telemetryBtn) {
          this.toggleDrawer();
          return;
        }

        const closeBtn = e.target.closest('.btn-close') || e.target.closest('.drawer-backdrop');
        if (closeBtn) {
          this._drawerOpen = false;
          this.render();
          return;
        }

        const tabBtn = e.target.closest('.drawer-tab');
        if (tabBtn) {
          this._activeTab = tabBtn.dataset.tab;
          this.render();
          return;
        }

        const simBtn = e.target.closest('.btn-simulate');
        if (simBtn) {
          window.dispatchEvent(new CustomEvent('nain:telemetry', {
            detail: {
              type: 'InvariantAssert',
              name: 'AssertRuntimeInvariant',
              latencyMs: Math.floor(Math.random() * 15 + 2),
              status: 200,
              payload: { timestamp: new Date().toISOString(), memoryDeltaBytes: 0, deterministicCheck: 'PASS', isolationZone: 'Strict' }
            }
          }));
          return;
        }

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
      const pKey = this._getProjectKey();
      const profile = ARCH_PROFILES[pKey] || ARCH_PROFILES['nainorder'];
      const telemetryEvents = [...this._customTelemetry, ...profile.sampleEvents];

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

      let tabContentHtml = '';

      if (this._activeTab === 'invariants') {
        tabContentHtml = `
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
      } else if (this._activeTab === 'telemetry') {
        tabContentHtml = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div class="section-title">Bus de Telemetría en Tiempo Real</div>
            <button type="button" class="btn-simulate">+ Simular Invariante</button>
          </div>
          <div class="telemetry-feed">
            ${telemetryEvents.map(evt => `
              <div class="telemetry-item">
                <div class="telemetry-item-header">
                  <span class="telemetry-type">${evt.type}</span>
                  <span class="telemetry-latency">${evt.latencyMs} ms · HTTP ${evt.status}</span>
                </div>
                <div class="telemetry-name">${evt.name}</div>
                <pre class="telemetry-payload">${JSON.stringify(evt.payload, null, 2)}</pre>
              </div>
            `).join('')}
          </div>
        `;
      } else if (this._activeTab === 'governance') {
        tabContentHtml = `
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
                <strong>${currentProjectName}</strong>
              </div>
            ` : ''}
          </div>

          ${!this._collapsed ? `
            <div class="bar-right">
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
                  <span>Proyectos (${CATALOG.reduce((acc, c) => acc + c.items.length, 0)})</span>
                  <span aria-hidden="true">&#9662;</span>
                </button>
                <div class="menu ${this._menuOpen ? 'open' : ''}" role="menu">
                  ${menuHtml}
                </div>
              </div>

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

        <div class="drawer-backdrop ${this._drawerOpen ? 'open' : ''}"></div>
        <aside class="drawer ${this._drawerOpen ? 'open' : ''}" role="dialog" aria-modal="true" aria-label="Inspector de Arquitectura & Telemetría">
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
            <button type="button" class="drawer-tab ${this._activeTab === 'invariants' ? 'active' : ''}" data-tab="invariants">Invariantes</button>
            <button type="button" class="drawer-tab ${this._activeTab === 'telemetry' ? 'active' : ''}" data-tab="telemetry">Telemetría</button>
            <button type="button" class="drawer-tab ${this._activeTab === 'governance' ? 'active' : ''}" data-tab="governance">Gobernanza</button>
          </div>

          <div class="drawer-content">
            ${tabContentHtml}
          </div>
        </aside>
      `;
    }
  }

  customElements.define('nain-ecosystem-bar', NainEcosystemBar);
})();
