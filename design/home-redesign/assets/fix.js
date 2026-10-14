/* ============================================================
   MODO FIX — añade #fix a la URL y la página se vuelve editable.
   Mover: arrastrar o flechas (Mayús = 10 px). Ancho: tirador de la
   esquina. Guarda en el navegador y exporta un JSON que David pega
   en el chat; ese JSON se aplica luego desde assets/fix.data.js.
   ============================================================ */
(function(){
  var SEL = 'h1,h2,h3,h4,p,ul,ol,dl,img,figure,.card,.case,.fic,.term,.diagram,.tramaBox,'+
            '.data,.posts,.rows,.cells,.heroCard,.cota,.brk,.btn,.chip,.deliv,.facts,.avail';
  var KEY = 'nain-fix:' + (location.pathname.split('/').pop() || 'index.html');
  var state = {}, sel = null, ON = /(^|[#&])fix\b/i.test(location.hash) || /fix/i.test(location.hash);

  /* — ids deterministas: sección / etiqueta + orden — */
  function tagAll(){
    var roots = document.querySelectorAll('header.top, section, footer');
    for (var i=0;i<roots.length;i++){
      var sec = roots[i], sid = sec.id || sec.tagName.toLowerCase()+i, n = {};
      var els = sec.querySelectorAll(SEL);
      for (var j=0;j<els.length;j++){
        var el = els[j];
        if (el.closest('.fixui')) continue;
        var t = el.tagName.toLowerCase() + (el.className && typeof el.className==='string' && el.className.split(' ')[0] ? '.'+el.className.split(' ')[0] : '');
        n[t] = (n[t]||0)+1;
        el.setAttribute('data-fix', sid+'/'+t+'#'+n[t]);
      }
    }
  }

  function applyOne(el,v){
    if(!el) return;
    var t = '';
    if (v.dx || v.dy) t = 'translate('+(v.dx||0)+'px,'+(v.dy||0)+'px)';
    el.style.transform = t;
    if (v.w) el.style.width = v.w+'px';
    if (v.mw) el.style.maxWidth = v.mw+'px';
  }
  function applyAll(data){
    for (var k in data){
      var el = document.querySelector('[data-fix="'+k.replace(/"/g,'\\"')+'"]');
      applyOne(el, data[k]);
    }
  }

  tagAll();
  if (window.NAIN_FIX) { state = JSON.parse(JSON.stringify(window.NAIN_FIX)); applyAll(state); }
  if (!ON) return;                                   // sin #fix, solo se aplican los arreglos

  try { var saved = localStorage.getItem(KEY); if (saved){ state = JSON.parse(saved); applyAll(state); } } catch(e){}

  /* — interfaz — */
  var css = document.createElement('style');
  css.textContent =
   '.fixui{position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#1D1D1B;color:#EDF1F6;'+
   'font-family:"IBM Plex Mono",monospace;font-size:12px;border-top:2px solid #80FF00;'+
   'display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:10px 16px}'+
   '.fixui b{color:#80FF00;font-weight:500}'+
   '.fixui button{font:inherit;background:none;border:1px solid #4E6B92;color:#EDF1F6;border-radius:4px;'+
   'padding:6px 10px;cursor:pointer}'+
   '.fixui button:hover{border-color:#80FF00;color:#80FF00}'+
   '.fixui .sp{margin-left:auto}'+
   '.fixjson{position:fixed;inset:auto 16px 56px 16px;z-index:9999;max-height:40vh;display:none}'+
   '.fixjson textarea{width:100%;height:34vh;background:#1D1D1B;color:#80FF00;border:1px solid #4E6B92;'+
   'border-radius:4px;font-family:"IBM Plex Mono",monospace;font-size:12px;padding:12px}'+
   '[data-fix]:hover{outline:1px dashed rgba(128,255,0,.7);outline-offset:2px}'+
   '.fixsel{outline:2px solid #80FF00!important;outline-offset:2px}'+
   '.fixhandle{position:absolute;width:14px;height:14px;background:#80FF00;border-radius:2px;'+
   'cursor:ew-resize;z-index:9998}'+
   'body.fixon{cursor:crosshair}';
  document.head.appendChild(css);
  document.body.classList.add('fixon');

  var bar = document.createElement('div');
  bar.className = 'fixui';
  bar.innerHTML = '<b>MODO FIX</b><span id="fixsel">nada seleccionado</span>'+
    '<span class="sp"></span>'+
    '<button id="fixCopy">Copiar JSON</button>'+
    '<button id="fixShow">Ver JSON</button>'+
    '<button id="fixResetOne">Reiniciar elemento</button>'+
    '<button id="fixResetAll">Reiniciar todo</button>'+
    '<button id="fixExit">Salir</button>';
  document.body.appendChild(bar);

  var panel = document.createElement('div');
  panel.className = 'fixui fixjson';
  panel.style.background = 'transparent';
  panel.style.border = '0';
  panel.innerHTML = '<textarea id="fixArea" spellcheck="false"></textarea>';
  document.body.appendChild(panel);

  var handle = document.createElement('div');
  handle.className = 'fixhandle fixui';
  handle.style.display = 'none';
  document.body.appendChild(handle);

  function label(){
    document.getElementById('fixsel').textContent = sel ? sel.getAttribute('data-fix') +
      '  ·  dx '+(get(sel).dx||0)+'  dy '+(get(sel).dy||0)+(get(sel).w?('  w '+get(sel).w):'') : 'nada seleccionado';
  }
  function get(el){ var k = el.getAttribute('data-fix'); return state[k] || (state[k] = {}); }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(clean())); }catch(e){} }
  function clean(){
    var o = {};
    for (var k in state){ var v = state[k]; if (v.dx||v.dy||v.w||v.mw) o[k]=v; }
    return o;
  }
  function placeHandle(){
    if(!sel){ handle.style.display='none'; return; }
    var r = sel.getBoundingClientRect();
    handle.style.display='block';
    handle.style.left = (r.right + scrollX - 7)+'px';
    handle.style.top  = (r.bottom + scrollY - 7)+'px';
    handle.style.position='absolute';
  }
  function select(el){
    if (sel) sel.classList.remove('fixsel');
    sel = el; if (sel) sel.classList.add('fixsel');
    label(); placeHandle();
  }

  /* — selección y arrastre — */
  var drag = null;
  document.addEventListener('mousedown', function(e){
    if (e.target.closest('.fixui')) return;
    var el = e.target.closest('[data-fix]');
    if (!el) return;
    e.preventDefault();
    select(el);
    var v = get(el);
    drag = {x:e.clientX, y:e.clientY, dx:v.dx||0, dy:v.dy||0};
  });
  document.addEventListener('mousemove', function(e){
    if (!drag || !sel) return;
    var v = get(sel);
    v.dx = Math.round(drag.dx + (e.clientX-drag.x));
    v.dy = Math.round(drag.dy + (e.clientY-drag.y));
    applyOne(sel, v); label(); placeHandle();
  });
  document.addEventListener('mouseup', function(){ if(drag){ drag=null; save(); } });

  /* — tirador de ancho — */
  var rez = null;
  handle.addEventListener('mousedown', function(e){
    if (!sel) return;
    e.preventDefault(); e.stopPropagation();
    rez = {x:e.clientX, w: sel.getBoundingClientRect().width};
  });
  document.addEventListener('mousemove', function(e){
    if (!rez || !sel) return;
    var v = get(sel);
    v.w = Math.max(80, Math.round(rez.w + (e.clientX-rez.x)));
    applyOne(sel, v); label(); placeHandle();
  });
  document.addEventListener('mouseup', function(){ if(rez){ rez=null; save(); } });

  /* — teclado — */
  document.addEventListener('keydown', function(e){
    if (!sel || e.target.tagName==='TEXTAREA' || e.target.tagName==='INPUT') return;
    var step = e.shiftKey ? 10 : 1, v = get(sel), used = true;
    switch(e.key){
      case 'ArrowLeft':  v.dx=(v.dx||0)-step; break;
      case 'ArrowRight': v.dx=(v.dx||0)+step; break;
      case 'ArrowUp':    v.dy=(v.dy||0)-step; break;
      case 'ArrowDown':  v.dy=(v.dy||0)+step; break;
      case 'Escape':     select(null); used=false; break;
      case 'r': case 'R': delete state[sel.getAttribute('data-fix')]; sel.style.transform=''; sel.style.width=''; break;
      default: used=false;
    }
    if (used){ e.preventDefault(); applyOne(sel, v); }
    label(); placeHandle(); save();
  });
  addEventListener('scroll', placeHandle, {passive:true});
  addEventListener('resize', placeHandle, {passive:true});

  /* — botones — */
  function json(){ return JSON.stringify(clean(), null, 2); }
  document.getElementById('fixShow').onclick = function(){
    var p = document.querySelector('.fixjson');
    p.style.display = p.style.display==='block' ? 'none' : 'block';
    document.getElementById('fixArea').value = json();
  };
  document.getElementById('fixCopy').onclick = function(){
    var a = document.getElementById('fixArea');
    document.querySelector('.fixjson').style.display='block';
    a.value = json(); a.select();
    var ok=false;
    try { ok = document.execCommand('copy'); } catch(e){}
    if (!ok && navigator.clipboard) navigator.clipboard.writeText(a.value).then(function(){ok=true;});
    this.textContent = ok ? 'Copiado ✓' : 'Selecciona y copia';
    var b=this; setTimeout(function(){ b.textContent='Copiar JSON'; }, 1800);
  };
  document.getElementById('fixResetOne').onclick = function(){
    if(!sel) return;
    delete state[sel.getAttribute('data-fix')];
    sel.style.transform=''; sel.style.width=''; label(); placeHandle(); save();
  };
  document.getElementById('fixResetAll').onclick = function(){
    for (var k in state){
      var el = document.querySelector('[data-fix="'+k.replace(/"/g,'\\"')+'"]');
      if (el){ el.style.transform=''; el.style.width=''; }
    }
    state = {}; save(); label(); placeHandle();
  };
  document.getElementById('fixExit').onclick = function(){
    location.hash = '';
    location.reload();
  };
  window.NainFix = { json: json, state: function(){ return clean(); } };
})();
