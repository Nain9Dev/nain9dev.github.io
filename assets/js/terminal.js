document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const terminal = document.querySelector('.terminal-wrapper');
  
  if (!input || !output || !terminal) return;

  let history = [];
  let historyIndex = -1;
  let isTyping = false;
  
  // Hacer que al hacer clic en cualquier parte de la terminal, se enfoque el input
  terminal.addEventListener('click', () => {
    const selection = window.getSelection();
    if (!selection.toString()) {
      input.focus();
    }
  });
  
  // Objeto con todos los comandos disponibles
  const commands = {
    help: () => `
      <table class="term-table">
        <tr><th class="term-text-blue">Comando</th><th>Descripción</th></tr>
        <tr><td class="term-text-green">story</td><td>La historia detrás del proyecto confidencial (Problema & Solución)</td></tr>
        <tr><td class="term-text-green">metrics</td><td>KPIs y métricas de impacto de la arquitectura</td></tr>
        <tr><td class="term-text-green">diagram</td><td>Diagrama ASCII de arquitectura de Validación 3D</td></tr>
        <tr><td class="term-text-green">stack</td><td>Stack técnico desglosado por capas</td></tr>
        <tr><td class="term-text-green">why-me</td><td>¿Por qué contratar a Aitor Nain? Argumentos de valor</td></tr>
        <tr><td class="term-text-green">workflow</td><td>Proceso de trabajo y arquitectura</td></tr>
        <tr><td class="term-text-green">demo</td><td>Simulación de servicio de validación 3D</td></tr>
        <tr><td class="term-text-green">philosophy</td><td>Principios de diseño de software</td></tr>
        <tr><td class="term-text-green">chat</td><td>Asistente virtual simulado</td></tr>
        <tr><td class="term-text-green">experience</td><td>Experiencia profesional destacada</td></tr>
        <tr><td class="term-text-green">contact</td><td>Información de contacto y enlaces</td></tr>
        <tr><td class="term-text-green">clear</td><td>Limpia la terminal</td></tr>
      </table>`,
    story: () => `
      <span class="term-text-yellow">>> INITIALIZING NARRATIVE PROTOCOL...</span><br><br>
      # <strong class="term-text-blue">EL RETO:</strong> La industria 3D y de robótica se enfrenta a un problema: la IA generativa produce modelos rápidos, pero a menudo con inconsistencias estructurales. Validarlos manualmente frena la automatización.<br><br>
      # <strong class="term-text-blue">LA COLABORACIÓN:</strong> Me uní como colaborador técnico a <strong class="term-text-yellow">un proyecto confidencial del sector industrial</strong>. Mi misión: diseñar una arquitectura backend privada capaz de procesar y validar modelos en tiempo real mediante IA.<br><br>
      # <strong class="term-text-blue">EL ESTADO:</strong> El proyecto se encuentra bajo estricta confidencialidad (NDA). Estamos construyendo un sistema robusto, asíncrono y de grado industrial para garantizar la calidad de assets 3D en flujos automatizados.`,

    metrics: () => `
      <span class="term-text-yellow">>> FETCHING TELEMETRY DATA...</span><br><br>
      > <strong class="term-text-blue">Performance Metrics (Proyecto Confidencial):</strong><br>
      - Volumen de procesamiento: <span class="term-text-green">[REDACTED] modelos/hora</span><br>
      - Precisión de validación: <span class="term-text-green">Grado Industrial</span><br>
      - Integración de ecosistema: <span class="term-text-green">Arquitectura basada en Agentes</span><br>
      - Latencia: <span class="term-text-green">Optimizado para tiempo real</span><br><br>
      <span class="term-text-yellow">* Los detalles específicos de rendimiento y benchmarks están protegidos por NDA.</span>`,

    diagram: () => `<div class="term-ascii">
    [LLM / IA Generativa]
             │ 
             ▼ (Asset Data)
    ┌───────────────────┐
    │  API Gateway      │
    └────────┬──────────┘
             │ JSON-RPC / REST
    ┌────────▼──────────┐
    │ Backend de Lógica │
    └────────┬──────────┘
             │ gRPC
    ┌────────▼──────────┐      ┌────────────────┐
    │  Microservicio    │◄────►│ Motor de       │
    │  de Procesamiento │      │ Validación     │
    └────────┬──────────┘      └────────────────┘
             │
             ▼ Valid Asset
    [ Database / Storage ]
</div>`,

    stack: () => `
      <strong class="term-text-yellow">>> CORE BACKEND & DATA</strong><br>
      - C# / .NET (Sistemas Críticos, Alto Rendimiento)<br>
      - Bases de datos relacionales, Caché, CQRS, DDD<br><br>
      <strong class="term-text-yellow">>> AI & 3D INTEGRATION</strong><br>
      - Protocolos de comunicación con LLMs<br>
      - Sistemas backend para procesamiento asíncrono<br><br>
      <strong class="term-text-yellow">>> INFRASTRUCTURE & OPS</strong><br>
      - Contenedores, Cloud Architecture, CI/CD<br>
      - Arquitecturas distribuidas y Zero Downtime Deployments`,

    "why-me": () => `
      <span class="term-text-yellow">>> QUERYING VALUE PROPOSITION...</span><br><br>
      1. <strong class="term-text-green">Ejecutor Técnico:</strong> Transformo lógica de negocio compleja en implementaciones de código sólidas y escalables.<br>
      2. <strong class="term-text-green">Determinismo en el Caos:</strong> Implemento sistemas con contratos estrictos y validación férrea en entornos de IA.<br>
      3. <strong class="term-text-green">Puente entre mundos:</strong> Conecto la innovación tecnológica con la fiabilidad innegociable del backend empresarial.<br>
      4. <strong class="term-text-green">Visión de Arquitectura:</strong> Diseño sistemas tolerantes a fallos y preparados para escalar horizontalmente.`,

    workflow: () => `
      <strong class="term-text-blue">MI PROCESO DE TRABAJO COMO ARQUITECTO BACKEND</strong><br><br>
      <strong class="term-text-yellow">1. Escucha activa de la lógica de negocio</strong><br>
      - Entiendo el dominio del problema en profundidad<br>
      - Traduzco requerimientos funcionales en especificaciones técnicas<br><br>
      <strong class="term-text-yellow">2. Diseño arquitectónico</strong><br>
      - Clean Architecture + DDD + CQRS<br>
      - Defino puertos y adaptadores para máxima flexibilidad<br><br>
      <strong class="term-text-yellow">3. Implementación en código</strong><br>
      - Desarrollo de backend robusto (Sistemas críticos, ecosistemas seguros)<br>
      - Integración de servicios asíncronos y procesamiento masivo<br><br>
      <strong class="term-text-yellow">4. Despliegue y escalado</strong><br>
      - Estrategias de contenedores y nube<br>
      - Monitorización y observabilidad<br><br>
      <strong class="term-text-yellow">5. Iteración continua</strong><br>
      - Refinamiento de la arquitectura basado en métricas y feedback`,

    demo: () => `
      <strong class="term-text-blue">DEMO GENÉRICA - SERVICIO DE VALIDACIÓN</strong><br><br>
      Cargando asset...<br>
      <span class="term-text-green">[####################] 100%</span><br><br>
      <strong class="term-text-yellow">Analisis de integridad:</strong><br>
      - Estructura: <span class="term-text-green">OK</span><br>
      - Metadatos: <span class="term-text-green">OK</span><br>
      - Reglas de negocio: <span class="term-text-red">Anomalías detectadas</span><br><br>
      <strong class="term-text-yellow">Correccion automatica (Backend Service):</strong><br>
      -> Aplicando heurísticas de reparación... (<span class="term-text-green">OK</span>)<br>
      -> Re-validando contratos de datos... (<span class="term-text-green">OK</span>)<br><br>
      <span class="term-text-green">Proceso completado en [REDACTED] ms.</span><br>
      * Nota: Los algoritmos específicos y tiempos reales del proyecto son confidenciales.`,

    philosophy: () => `
      <strong class="term-text-blue">MI FILOSOFIA DE ARQUITECTURA</strong><br><br>
      <span class="term-text-yellow">"La arquitectura no es un fin, es un medio para que el negocio evolucione sin dolor."</span> - Aitor Nain<br><br>
      + <strong class="term-text-green">Determinismo ante todo:</strong> Sistemas que se comportan de forma predecible<br>
      + <strong class="term-text-green">Escalabilidad por diseño:</strong> Piensa en 10x desde el dia 1<br>
      + <strong class="term-text-green">Codigo como documento:</strong> Legible, mantenible y probado<br>
      + <strong class="term-text-green">Agnóstico a tecnologia:</strong> Elijo la herramienta adecuada para cada problema<br>
      + <strong class="term-text-green">IA como aliada:</strong> Integro modelos sin atarme a ninguno`,

    chat: () => `
      <strong class="term-text-blue">Assistant:</strong> Hola, soy el asistente terminal de Aitor.<br>
      <strong class="term-text-blue">Assistant:</strong> Aitor está actualmente diseñando arquitecturas backend de alto rendimiento. Si necesitas escalar sistemas críticos o integrar flujos complejos, usa el comando <span class="term-text-green">contact</span>.`,

    experience: () => `
      <strong class="term-text-yellow">Backend Architecture Collaborator @ Proyecto Confidencial (Industria 3D / AI)</strong><br>
      - Diseño de backend e integración de IA (Detalles bajo NDA).<br>
      - Construcción técnica de infraestructura para procesamiento masivo.<br><br>
      <strong class="term-text-yellow">Backend Specialist @ SaaS Platform</strong><br>
      - Mantenimiento y optimización de sistemas críticos (C#, SQL Server).<br>
      - Estrategias de sharding, caché distribuida y concurrencia sin bloqueos.`,

    contact: () => `
      <strong class="term-text-blue">Email:</strong> <a href="mailto:contact@naindev.com">contact@naindev.com</a><br>
      <strong class="term-text-blue">LinkedIn:</strong> <a href="https://www.linkedin.com/in/aitor-nain/" target="_blank">linkedin.com/in/aitor-nain/</a><br>
      <strong class="term-text-blue">GitHub:</strong> <a href="https://github.com/Nain9Dev" target="_blank">github.com/Nain9Dev</a><br>
      <br><span class="term-text-yellow">>> Escríbeme y analicemos tu arquitectura técnica.</span>`,
      
    status: () => `[<span class="term-text-green">OK</span>] API Gateway (Latencia p95: 42ms)<br>[<span class="term-text-green">OK</span>] Database Primary (Carga: 12%)<br>[<span class="term-text-green">OK</span>] Validation Engine (Sandboxed)<br>Uptime: 99.97% - Todos los sistemas operando con normalidad.`
  };

  const commandKeys = Object.keys(commands).concat(['clear']);

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
          output.scrollTop = output.scrollHeight;
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
    input.focus();
    output.scrollTop = output.scrollHeight;
  }

  async function processCommand(raw) {
    if (isTyping) return;
    const cmdStr = raw.trim();
    if (!cmdStr) return;
    
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
      window.plausible && window.plausible('Terminal Command', { props: { command: cmd } });
      await printLine(commands[cmd]());
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
        await typewriterAsync(commands['status']() + "<br><br>Escribe <span class=\"term-text-green\">help</span> para ver los comandos disponibles.", div2);
      })();
    }
  });
  
  observer.observe(terminal);
});
