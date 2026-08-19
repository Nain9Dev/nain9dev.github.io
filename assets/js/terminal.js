document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const terminal = document.querySelector('.terminal-wrapper');
  
  if (!input || !output || !terminal) return;

  let history = [];
  let historyIndex = -1;
  let isTyping = false;
  let hasInteracted = false;
  
  // Función helper para determinar si el usuario está al final de la terminal
  function shouldAutoScroll() {
    // Tolerancia de 30px
    return output.scrollHeight - output.scrollTop - output.clientHeight < 30;
  }
  
  // Hacer que al hacer clic en cualquier parte de la terminal, se enfoque el input
  terminal.addEventListener('click', () => {
    const selection = window.getSelection();
    if (!selection.toString()) {
      input.focus({ preventScroll: true });
    }
  });
   let commands = {};
  let commandKeys = ['clear'];

  // Cargar comandos asíncronamente
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
      // Usaremos typing effect async para salidas
      return typewriterAsync(text, div);
    }
  }

  // Función asíncrona para efecto typing fluido que respeta HTML
  async function typewriterAsync(htmlString, element) {
    isTyping = true;
    input.disabled = true;
    
    const doScroll = shouldAutoScroll();
    
    output.appendChild(element);
    
    // Convertir el HTML a un fragmento temporal para iterar por nodos
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // Iteración recursiva por los nodos para simular escritura sin romper HTML
    async function processNode(node, parent) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        for (let i = 0; i < text.length; i++) {
          parent.appendChild(document.createTextNode(text.charAt(i)));
          if (doScroll) output.scrollTop = output.scrollHeight;
          // Velocidad del typing: 8ms por carácter
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
      return;
    }

    if (commands[cmd]) {
      window.plausible && window.plausible('Terminal Command', { props: { command: cmd, status: 'success' } });
      await printLine(commands[cmd]);
    } else {
      window.plausible && window.plausible('Terminal Command', { props: { command: cmdStr, status: 'failed' } });
      await printLine(`Comando no encontrado: <span class="term-text-red">${cmd.replace(/</g, "&lt;")}</span>. Usa <span class="term-text-green">help</span>.`);
    }
  }

  input.addEventListener('keydown', (e) => {
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
  });

  const welcomeText = "Conectando al servidor... Inicializando subsistemas...";
  let hasRun = false;
  
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
      })();
    }
  });
  
  observer.observe(terminal);
});
