import { message } from './locale.js';

export function initializeDemoModal(root = document) {
  let modalContainer = null;

  function createModal() {
    modalContainer = document.createElement("div");
    modalContainer.className = "demo-modal-overlay";
    modalContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      opacity: 0;
      transition: opacity 0.25s ease;
      box-sizing: border-box;
    `;

    const modalBox = document.createElement("div");
    modalBox.className = "demo-modal-box";
    modalBox.style.cssText = `
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #334155;
      border-radius: 12px;
      padding: 2rem;
      max-width: 640px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.75);
      position: relative;
      font-family: inherit;
      text-align: left;
      box-sizing: border-box;
    `;

    const closeButton = document.createElement("button");
    closeButton.textContent = "✕";
    closeButton.setAttribute("aria-label", message('closeModal'));
    closeButton.style.cssText = `
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.35rem;
      cursor: pointer;
      line-height: 1;
      padding: 0.25rem;
    `;
    closeButton.addEventListener("click", closeModal);

    const title = document.createElement("h3");
    title.textContent = message('demoTitle');
    title.style.cssText = "margin: 0 0 0.75rem 0; font-size: 1.35rem; font-weight: 700; color: #f8fafc;";

    const desc = document.createElement("p");
    desc.textContent = message('demoDescription');
    desc.style.cssText = "color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-top: 0; margin-bottom: 1.5rem;";

    const actionContainer = document.createElement("div");
    actionContainer.style.cssText = "display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem;";

    const triggerBtn = document.createElement("button");
    triggerBtn.textContent = message('demoTrigger');
    triggerBtn.style.cssText = `
      background: #3b82f6;
      color: #ffffff;
      padding: 0.85rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.2s ease, opacity 0.2s ease;
      box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.4);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    `;
    triggerBtn.addEventListener("mouseover", () => {
      if (!triggerBtn.disabled) triggerBtn.style.background = "#2563eb";
    });
    triggerBtn.addEventListener("mouseout", () => {
      if (!triggerBtn.disabled) triggerBtn.style.background = "#3b82f6";
    });

    const consoleBox = document.createElement("div");
    consoleBox.style.cssText = `
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 1.25rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 0.88rem;
      line-height: 1.7;
      color: #38bdf8;
      min-height: 150px;
      max-height: 260px;
      overflow-y: auto;
      text-align: left;
      white-space: pre-wrap;
      word-break: break-all;
    `;
    consoleBox.textContent = message('demoReady');

    triggerBtn.addEventListener("click", () => {
      triggerBtn.disabled = true;
      triggerBtn.style.opacity = "0.7";
      triggerBtn.style.cursor = "not-allowed";
      triggerBtn.textContent = message('demoProcessing');
      consoleBox.style.color = "#10b981";
      consoleBox.innerHTML = "";

      const steps = [
        { delay: 10, text: message('demoStep1') },
        { delay: 420, text: message('demoStep2') },
        { delay: 850, text: message('demoStep3') },
        { delay: 1500, text: message('demoStep4') },
        { delay: 1900, text: `\n${message('demoStep5')}` }
      ];

      steps.forEach((step, idx) => {
        setTimeout(() => {
          const line = document.createElement("div");
          line.textContent = step.text;
          if (idx === 4) {
            line.style.color = "#fbbf24";
            line.style.fontWeight = "bold";
            line.style.marginTop = "0.5rem";
          }
          consoleBox.appendChild(line);
          consoleBox.scrollTop = consoleBox.scrollHeight;

          if (idx === steps.length - 1) {
            triggerBtn.disabled = false;
            triggerBtn.style.opacity = "1";
            triggerBtn.style.cursor = "pointer";
            triggerBtn.textContent = message('demoAgain');
          }
        }, step.delay);
      });

      fetch("https://api-notificaciones-demo.naindev.com/api/v1/Notifications/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: "Reclutador Web",
          senderEmail: "evaluator@naindev.com",
          subject: "Prueba 1-Clic Demo",
          message: "Verification initiated from portfolio demo modal"
        })
      }).catch(() => {
        // Silent fallback to interactive simulation when offline or pre-deployment
      });
    });

    actionContainer.appendChild(triggerBtn);
    modalBox.append(closeButton, title, desc, actionContainer, consoleBox);
    modalContainer.appendChild(modalBox);

    modalContainer.addEventListener("click", (event) => {
      if (event.target === modalContainer) {
        closeModal();
      }
    });

    document.body.appendChild(modalContainer);
    requestAnimationFrame(() => {
      if (modalContainer) {
        modalContainer.style.opacity = "1";
      }
    });
  }

  function closeModal() {
    if (modalContainer) {
      modalContainer.style.opacity = "0";
      const currentModal = modalContainer;
      modalContainer = null;
      setTimeout(() => {
        currentModal?.remove();
      }, 250);
    }
  }

  root.addEventListener("click", (event) => {
    const link = event.target.closest('a[href="#demo-notificaciones"]');
    if (link) {
      event.preventDefault();
      if (!modalContainer) {
        createModal();
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalContainer) {
      closeModal();
    }
  });
}
