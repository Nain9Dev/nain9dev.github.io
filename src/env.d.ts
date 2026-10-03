/// <reference types="astro/client" />

declare global {
  interface Window {
    // Injected by external Plausible script; referenced in analytics.js
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    // Exposed from BaseLayout for terminal.js command tracking
    trackTerminalCommand?: (command: string) => void;
  }
}

export {};
