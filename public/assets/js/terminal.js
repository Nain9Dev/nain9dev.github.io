let terminalCleanup = null;

document.addEventListener('astro:page-load', () => {
  console.log('[Terminal] Iniciando terminal.js');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const terminal = document.querySelector('.terminal-wrapper');
  
  if (!input || !output || !terminal) return;
  
  // Accesibilidad: permitir a lectores de pantalla leer la salida
  output.setAttribute('aria-live', 'polite');
  output.setAttribute('role', 'log');
  output.setAttribute('aria-relevant', 'additions');
  
  // Añadir placeholder inicial
  input.placeholder = "Escribe 'help' para ver comandos...";

  let history = [];
  try {
    const saved = localStorage.getItem('terminalCmdHistory');
    if (saved) history = JSON.parse(saved);
  } catch (e) {}

  let historyIndex = history.length;
  let isTyping = false;
  let hasInteracted = false;
  let hasRun = false;

  // Restaurar salida si existe
  const savedOutput = localStorage.getItem('terminalOutput');
  if (savedOutput) {
    output.innerHTML = savedOutput;
    hasRun = true;
    hasInteracted = true;
    output.scrollTop = output.scrollHeight;
  }
  
  function saveState() {
    if (history.length > 50) history = history.slice(-50);
    localStorage.setItem('terminalCmdHistory', JSON.stringify(history));
    
    // Limitar el número de elementos visuales en el output
    while (output.children.length > 100) {
      output.removeChild(output.firstChild);
    }
    localStorage.setItem('terminalOutput', output.innerHTML);
  }

  function shouldAutoScroll() {
    return output.scrollHeight - output.scrollTop - output.clientHeight < 30;
  }
  
  const onTerminalClick = () => {
    const selection = window.getSelection();
    if (!selection.toString()) {
      input.focus({ preventScroll: true });
    }
  };
  terminal.addEventListener('click', onTerminalClick);

  let commands = {};
  let commandKeys = ['clear'];

  fetch('/assets/data/terminal-commands.json')
    .then(response => response.json())
    .then(data => {
      commands = data;
      commandKeys = Object.keys(commands).concat(['clear']);
    })
    .catch(error => {
      console.error('[Terminal] Error cargando comandos:', error);
      commands = { help: "Error cargando sistema base. Contactar administrador." };
    });

  function printLine(text, isCommand = false) {
    const div = document.createElement('div');
    div.style.marginBottom = '0.5rem';
    if (isCommand) {
      div.innerHTML = `<span class="prompt-text">[aitor@naindev.com ~]$</span> ${text}`;
      output.appendChild(div);
      output.scrollTop = output.scrollHeight;
      return Promise.resolve();
    } else {
      return typewriterAsync(text, div);
    }
  }

  async function typewriterAsync(htmlString, element) {
    isTyping = true;
    input.disabled = true;
    
    const doScroll = shouldAutoScroll();
    
    output.appendChild(element);
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    async function processNode(node, parent) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          parent.appendChild(document.createTextNode(text.charAt(i)));
          if (doScroll) output.scrollTop = output.scrollHeight;
          await new Promise(resolve => setTimeout(resolve, 8));
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        parent.appendChild(clone);
        for (const child of node.childNodes) {
          await processNode(child, clone);
        }
      }
    }
    
    await processNode(tempDiv, element);
    
    isTyping = false;
    input.disabled = false;
    input.focus({ preventScroll: true });
    if (doScroll) output.scrollTop = output.scrollHeight;
  }

  async function processCommand(raw) {
    if (isTyping) return;
    const cmdStr = raw.trim();
    if (!cmdStr) return;
    
    if (!hasInteracted && cmdStr.toLowerCase() !== 'clear') {
      hasInteracted = true;
      window.plausible && window.plausible('Terminal Interaction', { props: { firstCommand: true } });
    }
    
    printLine(cmdStr, true);
    history.push(cmdStr);
    historyIndex = history.length;
    
    const parts = cmdStr.split(' ');
    const cmd = parts[0].toLowerCase();

    if (cmd === 'clear') {
      output.innerHTML = '';
      saveState();
      return;
    }

    if (commands[cmd]) {
      window.plausible && window.plausible('TerminalCommand', { props: { command: cmd, status: 'success' } });
      await printLine(commands[cmd]);
      saveState();
    } else {
      window.plausible && window.plausible('TerminalCommand', { props: { command: cmdStr, status: 'failed' } });
      await printLine(`Comando no encontrado: <span class="term-text-red">${cmd.replace(/</g, "&lt;")}</span>. Usa <span class="term-text-green">help</span>.`);
      saveState();
    }
  }

  const onKeyDown = (e) => {
    if (isTyping) {
      e.preventDefault();
      return;
    }
    
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      processCommand(val);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value.toLowerCase();
      const match = commandKeys.find(c => c.startsWith(val));
      if (match) {
        input.value = match;
      }
    }
  };
  input.addEventListener('keydown', onKeyDown);

  const onOutputClick = (e) => {
    const link = e.target.closest('a');
    if (link && link.href.includes('/casos/')) {
      window.plausible && window.plausible('CaseStudyView', { props: { source: 'terminal', url: link.href } });
    }
  };
  output.addEventListener('click', onOutputClick);

  const welcomeText = "Conectando al servidor... Inicializando subsistemas...";
  
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !hasRun) {
      hasRun = true;
      (async () => {
        const div = document.createElement('div');
        div.style.marginBottom = '0.5rem';
        await typewriterAsync(welcomeText, div);
        const div2 = document.createElement('div');
        div2.style.marginBottom = '0.5rem';
        const statusText = commands['status'] || "[<span class=\"term-text-green\">OK</span>] API Gateway (Latencia p95: 42ms)<br>[<span class=\"term-text-green\">OK</span>] Database Primary (Carga: 12%)<br>[<span class=\"term-text-green\">OK</span>] Validation Engine (Sandboxed)<br>Uptime: 99.97% - Todos los sistemas operando con normalidad.";
        await typewriterAsync(statusText + "<br><br>Escribe <span class=\"term-text-green\">help</span> para ver los comandos disponibles.", div2);
        saveState();
      })();
    }
  });
  
  observer.observe(terminal);

  // Registro de función de limpieza para este componente particular
  terminalCleanup = () => {
    console.log('[Terminal] Limpiando recursos...');
    terminal.removeEventListener('click', onTerminalClick);
    input.removeEventListener('keydown', onKeyDown);
    output.removeEventListener('click', onOutputClick);
    observer.disconnect();
  };
});

document.addEventListener('astro:before-swap', () => {
  if (terminalCleanup) {
    terminalCleanup();
    terminalCleanup = null;
  }
});
