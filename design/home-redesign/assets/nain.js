/* ============================================================
   EL CAMPO DE TRAZOS — la única superficie animada del sistema.
   El átomo es el trazo del logotipo: 4 px, extremos redondos, 52°.
   Donde pasa el puntero, los trazos SE ROMPEN y la rotura se marca
   en rojo: es la interrupción del brandbook, en movimiento.
   Determinista salvo por el tiempo y el puntero; respeta
   prefers-reduced-motion dibujando un solo fotograma sin interacción.
   ============================================================ */
(function(){
  var cv=document.getElementById('field'); if(!cv) return;
  var ctx=cv.getContext('2d',{alpha:true});
  var out=document.getElementById('breakCount');
  var host=cv.parentNode;
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  var ANG=-52*Math.PI/180, DX=Math.cos(ANG), DY=Math.sin(ANG);
  var LEN=30, W=0, H=0, STEP=26, cells=[], t=0, mx=-9999, my=-9999, ripples=[], broken=0, shown=0;
  var R=210, MIN=0.18;   // radio de influencia y longitud mínima del trazo contraído

  function hash(i,j){ var n=Math.sin(i*127.1+j*311.7)*43758.5453; return n-Math.floor(n); }
  function build(){
    var dpr=Math.min(2,window.devicePixelRatio||1);
    W=cv.clientWidth; H=cv.clientHeight;
    STEP = W<760 ? 30 : 26;
    cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    cells.length=0;
    for(var j=0; j*STEP<H+STEP; j++){
      for(var i=0; i*STEP<W+STEP; i++){
        cells.push({x:i*STEP+((j%2)?STEP/2:0), y:j*STEP, h:hash(i,j), s:1, v:0});
      }
    }
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    ctx.lineCap='round';
    var hx=DX*LEN/2, hy=DY*LEN/2, n=0;
    for(var k=0;k<cells.length;k++){
      var c=cells[k];
      var wave = reduce ? 0 : 0.17*Math.sin(c.x*0.0055 + c.y*0.004 + t*0.55);
      var d = (c.x/W)*1.15 - 0.04 + wave;
      if(d<0) d=0; else if(d>1) d=1;
      if(c.h > d) continue;

      // — cuánto empuja el puntero sobre este trazo —
      var push=0;
      if(!reduce){
        var dx=c.x-mx, dy=c.y-my, dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<R){ var u=1-dist/R; push=u*u*(3-2*u); }   // caída suave, no cónica
      }
      var heat=0;                                       // el halo del clic: verde -> rojo -> verde
      for(var r=0;r<ripples.length;r++){
        var Rp=ripples[r], rdx=c.x-Rp.x, rdy=c.y-Rp.y;
        var rd=Math.abs(Math.sqrt(rdx*rdx+rdy*rdy)-Rp.r);
        if(rd<52){ var pv=(1-rd/52)*Rp.a, hv=pv*1.9; if(pv>push) push=pv; if(hv>heat) heat=hv; }
      }

      // — muelle: se contrae deprisa, vuelve a su sitio con inercia —
      if(!reduce){
        var target=1-(1-MIN)*push;
        c.v += (target-c.s)*(target<c.s ? 0.34 : 0.13);   // rigidez
        c.v *= 0.74;                                      // amortiguación
        c.s += c.v;
        if(c.s<MIN*0.9) c.s=MIN*0.9;
        if(c.s>1.06) c.s=1.06;                            // rebote corto al volver
        if(c.s<0.92) n++;
      }

      var op=0.26+d*0.74;
      var ct=1-c.s;                                        // contraído -> más presente
      var ob=op+(1-op)*ct*1.4; if(ob>1) ob=1;
      ctx.lineWidth=4;
      if(heat>0.02){                                       // mezcla hacia el rojo de marca
        var kh=heat>1?1:heat;
        var cr=Math.round(128+127*kh), cg=Math.round(255-255*kh), cb=Math.round(0+31*kh);
        ctx.strokeStyle='rgba('+cr+','+cg+','+cb+','+ob.toFixed(3)+')';
      }else{
        ctx.strokeStyle='rgba(128,255,0,'+ob.toFixed(3)+')';
      }
      ctx.beginPath();
      ctx.moveTo(c.x-hx*c.s, c.y-hy*c.s);
      ctx.lineTo(c.x+hx*c.s, c.y+hy*c.s);
      ctx.stroke();
    }
    broken=n;
  }
  function frame(){
    t+=0.016;
    for(var i=ripples.length-1;i>=0;i--){
      ripples[i].r+=8; ripples[i].a-=0.011;
      if(ripples[i].a<=0) ripples.splice(i,1);
    }
    draw();
    if(out){
      shown += (broken-shown)*0.18;
      out.textContent=('000'+Math.round(shown)).slice(-4);
    }
    requestAnimationFrame(frame);
  }
  function ripple(x,y){ if(ripples.length<4) ripples.push({x:x,y:y,r:0,a:1}); }

  build();
  addEventListener('resize',function(){ build(); if(reduce) draw(); },{passive:true});
  if(reduce){ draw(); }
  else{
    host.addEventListener('pointermove',function(e){
      var r=cv.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top;
    },{passive:true});
    host.addEventListener('pointerleave',function(){ mx=-9999; my=-9999; },{passive:true});
    host.addEventListener('pointerdown',function(e){
      var r=cv.getBoundingClientRect(); ripple(e.clientX-r.left, e.clientY-r.top);
    },{passive:true});
    requestAnimationFrame(frame);
  }
})();

/* ============================================================
   EL ISOTIPO AL PASAR EL RATÓN — la N se pliega y se despliega.
   Los tres trazos convergen en uno vertical en el centro y vuelven
   a abrirse a la N, con un rebote corto. Una vez por gesto.
   Geometría medida del archivo: trazo 113 sobre lienzo de 1000,
   barras en x=148 y x=848, diagonal (308,288)->(686,738).
   ============================================================ */
(function(){
  var host=document.getElementById('brandMark'); if(!host) return;
  var L=document.getElementById('mkL'), D=document.getElementById('mkD'), R=document.getElementById('mkR');
  if(!L||!D||!R) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var N={ L:[148,148,148,848], D:[308,288,686,738], R:[848,148,848,848] };   // la N
  var B={ L:[500,148,500,848], D:[500,148,500,848], R:[500,148,500,848] };   // el haz
  var DUR=1150, playing=false, t0=0;
  var OFF={ D:0, L:0.07, R:0.13 };            // al plegar manda la diagonal
  var OFF2={ L:0, R:0.06, D:0.13 };           // al desplegar mandan las barras

  function clamp(v){ return v<0?0:(v>1?1:v); }
  function easeInOut(x){ return x<0.5 ? 4*x*x*x : 1-Math.pow(-2*x+2,3)/2; }
  function easeOutBack(x){ var c1=1.70158, c3=c1+1; return 1+c3*Math.pow(x-1,3)+c1*Math.pow(x-1,2); }

  function setLine(el,a){ el.setAttribute('x1',a[0].toFixed(1)); el.setAttribute('y1',a[1].toFixed(1));
                          el.setAttribute('x2',a[2].toFixed(1)); el.setAttribute('y2',a[3].toFixed(1)); }
  function mix(a,b,k){ var o=[],i; for(i=0;i<4;i++) o.push(a[i]+(b[i]-a[i])*k); return o; }

  function frame(ts){
    if(!t0) t0=ts;
    var p=(ts-t0)/DUR;
    if(p>=1){ setLine(L,N.L); setLine(D,N.D); setLine(R,N.R); playing=false; t0=0; return; }
    ['L','D','R'].forEach(function(k){
      var el = k==='L'?L:(k==='D'?D:R), v;
      if(p<0.46){                                     // plegar
        var q=clamp((p-OFF[k]*0.46)/(0.46-OFF[k]*0.46*0.6));
        v=mix(N[k],B[k],easeInOut(q));
      }else if(p<0.54){                               // el haz, un respiro
        v=B[k];
      }else{                                          // desplegar, con rebote
        var q2=clamp((p-0.54-OFF2[k]*0.30)/(0.46-OFF2[k]*0.30));
        v=mix(B[k],N[k],easeOutBack(q2));
      }
      setLine(el,v);
    });
    requestAnimationFrame(frame);
  }
  function play(){ if(playing) return; playing=true; t0=0; requestAnimationFrame(frame); }

  host.addEventListener('mouseenter',play);
  host.addEventListener('focus',play);
  host.addEventListener('touchstart',play,{passive:true});
  window.naindevMark={ play:play };
})();

/* ============================================================
   LA CONSOLA — índice de la página por teclado.
   Todo lo que responde sale de la propia página: ni datos
   inventados, ni asistente simulado, ni métricas sin origen.
   ============================================================ */
(function(){
  var out=document.getElementById('termOut'), form=document.getElementById('termForm'),
      inp=document.getElementById('termIn'), chips=document.getElementById('termChips'),
      term=document.getElementById('term');
  if(!out||!form) return;

  var L=function(){ return document.documentElement.lang==='en' ? 'en' : 'es'; };
  var hist=[], hp=-1;

  var D={
    es:{
      banner:['<b>naindev · consola del sitio</b>',
              '<span class="mut">Arquitectura backend para sistemas que procesan 3D e IA a escala.</span>',
              '<span class="mut">Escribe <b>ayuda</b> para ver los comandos. ↑ recupera el anterior, Tab completa.</span>'],
      help:[{c:'servicios',d:'Los tres encargos que se pueden contratar'},
            {c:'stack',d:'Con qué está construido'},
            {c:'metodo',d:'Los cuatro pasos y su entregable'},
            {c:'casos',d:'Dos decisiones y lo que costaron'},
            {c:'escritos',d:'Los artículos, que son la muestra de trabajo'},
            {c:'sobre',d:'Quién está detrás'},
            {c:'disponibilidad',d:'Cómo se trabaja y qué hay libre'},
            {c:'contacto',d:'Correo y repositorio'},
            {c:'repo',d:'El código de este sitio'},
            {c:'ir <seccion>',d:'Salta a esa sección de la página'},
            {c:'limpiar',d:'Limpia la consola'}],
      servicios:['<b>01 · Validación geométrica</b>',
                 'Reglas deterministas sobre la malla: normales, topología, manifold, escala y presupuesto',
                 'de polígonos. Entrega un veredicto reproducible, no una estimación.',
                 '<b>02 · IA aislada del dominio</b>',
                 'El modelo entra como proveedor externo, detrás de un contrato. El dominio conserva las',
                 'reglas y sigue siendo determinista.',
                 '<b>03 · Backend que aguanta</b>',
                 'Concurrencia, cachés, particionado, mensajería y despliegue sin corte.',
                 '<span class="mut">No incluye: frontend ni infraestructura gestionada de forma continuada.</span>'],
      stack:['<b>.NET 8 · C#</b>        lenguaje y plataforma',
             '<b>SQL Server · Redis</b> datos y caché de primer nivel',
             '<b>RabbitMQ</b>           mensajería entre servicios',
             '<b>Azure · Kubernetes</b> despliegue',
             '<b>ONNX</b>              modelos, siempre detrás de un contrato',
             '<span class="mut">Huso horario UE · GMT+1.</span>'],
      metodo:['<b>01 Acotar</b>    qué entra, qué queda fuera y cuándo se da por terminado',
              '<b>02 Diseñar</b>   decisiones registradas como ADR, con la alternativa descartada',
              '<b>03 Construir</b> por hitos, con criterio de aceptación en cada uno',
              '<b>04 Entregar</b>  traspaso al equipo, con lo que hay que saber para operarlo'],
      casos:['<b>01 · Aislar el proveedor de IA detrás del dominio</b>',
             '<span class="mut">Proyecto confidencial · industria 3D</span>',
             'Clean Architecture y DDD en .NET, con el motor geométrico en un dominio puro.',
             'Compromiso: más piezas que operar — bus de mensajes, workers, binarios aparte.',
             '<b>02 · Partir la base por tenant antes que cambiar de motor</b>',
             '<span class="mut">Plataforma SaaS</span>',
             'Particionado por tenant y Redis como caché, con escrituras asíncronas por cola.',
             'Compromiso: invalidación de caché más compleja y monitorización distribuida.',
             '<span class="mut">Los dos completos, con alternativa y stack, en la sección Casos.</span>'],
      escritos:['<b>01</b> Arquitectura backend para sistemas de validación 3D deterministas',
                '<b>02</b> Control de concurrencia optimista en sistemas distribuidos',
                '<b>03</b> Clean Architecture en .NET para sistemas de IA generativa',
                '<b>04</b> FinOps para IA: cómo reducir la factura de OpenAI en Azure',
                '<b>05</b> Cómo procesar masivamente modelos 3D sin colgar tu backend',
                '<span class="mut">Once artículos en total. Son la muestra de trabajo, no relleno.</span>'],
      sobre:['<b>Aitor Nain Mendoza Vallejo</b> · arquitecto backend',
             'Diseña el backend de sistemas que procesan 3D e IA a escala, en .NET, y lleva la parte',
             'que no puede fallar.',
             '<span class="mut">Un arquitecto, no una agencia. Si necesitas un desarrollador a jornada completa, no es la persona.</span>'],
      disponibilidad:['<b>Trabajo por encargos acotados</b>, no por dedicación completa.',
                      'Auditoría, diseño de arquitectura o implementación por hitos.',
                      'Un encargo a la vez, con alcance cerrado y fecha comprometida.'],
      contacto:['<b>hola@naindev.com</b>',
                '<b>github.com/Nain9Dev</b>',
                '<span class="mut">Escribe <b>ir contacto</b> para ir al formulario.</span>'],
      repo:['Este sitio es estático y su repositorio es público: se puede auditar antes de escribir',
            'el primer correo. <b>github.com/Nain9Dev</b>'],
      nf:function(c){ return ['<span class="mut">comando no encontrado: </span><b>'+c+'</b>',
                              '<span class="mut">escribe <b>ayuda</b> para ver la lista</span>']; },
      goto:function(n){ return ['<span class="mut">saltando a </span><b>'+n+'</b>']; },
      nogoto:['<span class="mut">esa sección no existe. secciones: problema, servicios, metodo, casos, escritos, consola, sobre, contacto</span>']
    },
    en:{
      banner:['<b>naindev · site console</b>',
              '<span class="mut">Backend architecture for systems that process 3D and AI at scale.</span>',
              '<span class="mut">Type <b>help</b> for the commands. ↑ recalls the last one, Tab completes.</span>'],
      help:[{c:'services',d:'The three engagements on offer'},
            {c:'stack',d:'What it is built with'},
            {c:'method',d:'The four steps and their deliverable'},
            {c:'cases',d:'Two decisions and what they cost'},
            {c:'writing',d:'The articles, which are the work sample'},
            {c:'about',d:'Who is behind it'},
            {c:'availability',d:'How the work is scoped and what is free'},
            {c:'contact',d:'Email and repository'},
            {c:'repo',d:'The code of this site'},
            {c:'go <section>',d:'Jump to that section of the page'},
            {c:'clear',d:'Clear the console'}],
      servicios:['<b>01 · Geometric validation</b>',
                 'Deterministic rules over the mesh: normals, topology, manifold, scale and polygon',
                 'budget. It returns a reproducible verdict, not an estimate.',
                 '<b>02 · AI isolated from the domain</b>',
                 'The model enters as an external vendor behind a contract. The domain keeps the rules',
                 'and stays deterministic.',
                 '<b>03 · Backend that holds</b>',
                 'Concurrency, caching, partitioning, messaging and zero-downtime deployment.',
                 '<span class="mut">Not included: front-end or continuously managed infrastructure.</span>'],
      stack:['<b>.NET 8 · C#</b>        language and platform',
             '<b>SQL Server · Redis</b> data and first-level cache',
             '<b>RabbitMQ</b>           messaging between services',
             '<b>Azure · Kubernetes</b> deployment',
             '<b>ONNX</b>              models, always behind a contract',
             '<span class="mut">Time zone EU · GMT+1.</span>'],
      metodo:['<b>01 Scope</b>   what is in, what is out and when it is done',
              '<b>02 Design</b>  decisions recorded as ADRs, with the discarded alternative',
              '<b>03 Build</b>   by milestones, each with an acceptance criterion',
              '<b>04 Hand over</b> to the team, with what they need to operate it'],
      casos:['<b>01 · Isolate the AI vendor behind the domain</b>',
             '<span class="mut">Confidential project · 3D industry</span>',
             'Clean Architecture and DDD in .NET, with the geometry engine in a pure domain.',
             'Trade-off: more moving parts — message bus, workers, separate binary storage.',
             '<b>02 · Shard by tenant rather than change engines</b>',
             '<span class="mut">SaaS platform</span>',
             'Partitioning by tenant and Redis as a cache, with asynchronous writes over a queue.',
             'Trade-off: more complex cache invalidation and distributed monitoring.',
             '<span class="mut">Both in full, with alternative and stack, in the Case studies section.</span>'],
      escritos:['<b>01</b> Backend architecture for deterministic 3D validation systems',
                '<b>02</b> Optimistic concurrency control in distributed systems',
                '<b>03</b> Clean Architecture in .NET for generative AI systems',
                '<b>04</b> FinOps for AI: cutting the OpenAI bill on Azure',
                '<b>05</b> Processing 3D models in bulk without hanging your backend',
                '<span class="mut">Eleven articles in total. They are the work sample, not filler.</span>'],
      sobre:['<b>Aitor Nain Mendoza Vallejo</b> · backend architect',
             'Designs the backend of systems that process 3D and AI at scale, in .NET, and takes on',
             'the part that cannot fail.',
             '<span class="mut">One architect, not an agency. If you need a full-time developer, this is not the fit.</span>'],
      disponibilidad:['<b>Scoped engagements</b>, not full-time dedication.',
                      'Audit, architecture design or milestone implementation.',
                      'One engagement at a time, with fixed scope and a committed date.'],
      contacto:['<b>hola@naindev.com</b>',
                '<b>github.com/Nain9Dev</b>',
                '<span class="mut">Type <b>go contact</b> to jump to the form.</span>'],
      repo:['This site is static and its repository is public: you can audit it before writing the',
            'first email. <b>github.com/Nain9Dev</b>'],
      nf:function(c){ return ['<span class="mut">command not found: </span><b>'+c+'</b>',
                              '<span class="mut">type <b>help</b> for the list</span>']; },
      goto:function(n){ return ['<span class="mut">jumping to </span><b>'+n+'</b>']; },
      nogoto:['<span class="mut">no such section. sections: problema, servicios, metodo, casos, escritos, consola, sobre, contacto</span>']
    }
  };

  // alias -> clave
  var ALIAS={ayuda:'help',help:'help',servicios:'servicios',services:'servicios',stack:'stack',
             metodo:'metodo','método':'metodo',method:'metodo',casos:'casos',cases:'casos',
             escritos:'escritos',writing:'escritos',articulos:'escritos','artículos':'escritos',
             sobre:'sobre',about:'sobre',disponibilidad:'disponibilidad',availability:'disponibilidad',
             contacto:'contacto',contact:'contacto',repo:'repo',github:'repo',
             limpiar:'clear',clear:'clear',cls:'clear'};
  var SEC={problema:'problema',servicios:'servicios',metodo:'metodo','método':'metodo',method:'metodo',
           casos:'casos',cases:'casos',escritos:'escritos',writing:'escritos',consola:'consola',
           console:'consola',sobre:'sobre',about:'sobre',contacto:'contacto',contact:'contacto'};

  function line(html,cls){ var d=document.createElement('div'); if(cls) d.className=cls;
    d.innerHTML=html; out.appendChild(d); }
  function sep(){ var d=document.createElement('div'); d.className='sep'; out.appendChild(d); }
  function blank(){ line('&nbsp;'); }
  function scroll(){ out.scrollTop=out.scrollHeight; }

  function banner(){ out.innerHTML=''; D[L()].banner.forEach(function(x){ line(x); }); scroll(); }

  function help(){
    D[L()].help.forEach(function(h){
      line('<span>'+h.c+'</span><span class="mut">'+h.d+'</span>','row');
    });
  }

  function run(raw){
    var t=raw.trim(); if(!t) return;
    line('<span class="mut">[aitor@naindev ~]$</span> <span class="cmd">'+t.replace(/[<>&]/g,'')+'</span>');
    var parts=t.toLowerCase().split(/\s+/), c=parts[0], arg=parts[1];
    var d=D[L()];
    if(c==='ir'||c==='go'||c==='cd'){
      var id=SEC[arg||''];
      if(id){ d.goto(arg).forEach(function(x){line(x);});
              var el=document.getElementById(id); if(el) el.scrollIntoView({behavior:'smooth'}); }
      else d.nogoto.forEach(function(x){line(x);});
      blank(); scroll(); return;
    }
    var key=ALIAS[c];
    if(key==='clear'){ banner(); return; }
    if(key==='help'){ help(); blank(); scroll(); return; }
    if(key && d[key]){ d[key].forEach(function(x){ line(x); }); blank(); scroll(); return; }
    d.nf(c.replace(/[<>&]/g,'')).forEach(function(x){ line(x); }); blank(); scroll();
  }

  function buildChips(){
    chips.innerHTML='';
    D[L()].help.slice(0,9).forEach(function(h){
      var b=document.createElement('button'); b.type='button'; b.className='chip';
      b.textContent=h.c.split(' ')[0];
      b.addEventListener('click',function(){ run(b.textContent); inp.focus(); });
      chips.appendChild(b);
    });
  }
  function placeholder(){ inp.placeholder = inp.getAttribute('data-ph-'+L()); }

  form.addEventListener('submit',function(e){ e.preventDefault();
    var v=inp.value; if(!v.trim()) return; hist.unshift(v); hp=-1; run(v); inp.value=''; });

  inp.addEventListener('keydown',function(e){
    if(e.key==='ArrowUp'){ if(hist.length){ hp=Math.min(hp+1,hist.length-1); inp.value=hist[hp];
      e.preventDefault(); } }
    else if(e.key==='ArrowDown'){ if(hp>0){ hp--; inp.value=hist[hp]; } else { hp=-1; inp.value=''; }
      e.preventDefault(); }
    else if(e.key==='Tab'){
      var v=inp.value.trim().toLowerCase(); if(!v) return;
      var all=Object.keys(ALIAS).filter(function(k){ return k.indexOf(v)===0; });
      if(all.length){ inp.value=all[0]; e.preventDefault(); }
    }
  });
  term.addEventListener('click',function(e){ if(e.target.tagName!=='A') inp.focus(); });

  window.naindevConsole={ reload:function(){ banner(); buildChips(); placeholder(); } };
  banner(); buildChips(); placeholder();
})();

// Idioma — en producción son dos rutas (/ y /en/); aquí se conmuta para poder revisar las dos.
function setLang(l){
  document.documentElement.lang=l;
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed', b.dataset.lang===l?'true':'false'));
  if(window.naindevConsole) window.naindevConsole.reload();
  try{localStorage.setItem('naindev-lang',l)}catch(e){}
}
document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
try{const s=localStorage.getItem('naindev-lang'); if(s) setLang(s)}catch(e){}

// Menú móvil — foco atrapado, cierre con escape, con el botón y al elegir destino.
const sheet=document.getElementById('sheet');
const openers=document.querySelectorAll('.top .burger');
let lastFocus=null;
function openSheet(){
  lastFocus=document.activeElement;
  sheet.dataset.open='true';
  openers.forEach(b=>b.setAttribute('aria-expanded','true'));
  document.body.style.overflow='hidden';
  sheet.querySelector('nav a').focus();
}
function closeSheet(){
  sheet.dataset.open='false';
  openers.forEach(b=>b.setAttribute('aria-expanded','false'));
  document.body.style.overflow='';
  if(lastFocus) lastFocus.focus();
}
openers.forEach(b=>b.addEventListener('click',openSheet));
sheet.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',closeSheet));
sheet.querySelectorAll('nav a, .foot a').forEach(a=>a.addEventListener('click',closeSheet));
document.addEventListener('keydown',e=>{
  if(sheet.dataset.open!=='true') return;
  if(e.key==='Escape'){closeSheet();return}
  if(e.key!=='Tab') return;
  const f=[...sheet.querySelectorAll('a[href],button')].filter(el=>el.offsetParent!==null);
  if(!f.length) return;
  const first=f[0], last=f[f.length-1];
  if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()}
});
