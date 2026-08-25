/// <reference types="astro/client" />

declare global {
  interface Window {
    // Inyectada por el script externo de Plausible (analytics.js la consulta antes de usarla).
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    // Expuesta desde BaseLayout para que terminal.js (script estático) pueda registrar comandos.
    trackTerminalCommand?: (command: string) => void;
  }
}

export {};
