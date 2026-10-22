/* Espaço Garden FX, 22/10/2026. Camada visual: não envia dados nem muda texto. */
(function(){
  "use strict";
  var doc = document, root = doc.documentElement;
  var calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fino = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var pequeno = function(){ return matchMedia("(max-width: 760px)").matches; };
  if (!calmo) root.classList.add("fx-on");

  /* progresso de leitura */
  var barraP = doc.createElement("div"); barraP.className = "fx-progresso"; barraP.setAttribute("aria-hidden","true");
  doc.body.appendChild(barraP);
  var tickP = function(){
    var h = doc.documentElement.scrollHeight - innerHeight;
    barraP.style.setProperty("--p", h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
  };
  addEventListener("scroll", tickP, {passive:true}); tickP();

  var hero = doc.querySelector(".hero");
  if (hero){
    /* fotos que se trocam */
    var foto = hero.querySelector(".hero__foto");
    var lista = (foto && foto.dataset.fxSlides || "").split(",").map(function(s){ return s.trim(); }).filter(Boolean);
    if (foto && lista.length > 1 && !calmo){
      var slides = lista.map(function(src, i){
        var im = doc.createElement("img"); im.className = "fx-slide"; im.alt = ""; im.setAttribute("aria-hidden","true");
        im.decoding = "async"; if (i > 0) im.loading = "lazy"; im.src = src; foto.appendChild(im); return im;
      });
      var atual = 0;
      setTimeout(function(){
        foto.classList.add("fx-trocando"); slides[0].classList.add("is-ativa");
        setInterval(function(){
          if (doc.hidden) return;
          slides[atual].classList.remove("is-ativa");
          atual = (atual + 1) % slides.length;
          slides[atual].classList.add("is-ativa");
        }, 7500);
      }, 4200);
    }

    /* céu: auroras, vagalumes e luz que segue o ponteiro */
    var ceu = doc.createElement("div"); ceu.className = "fx-ceu"; ceu.setAttribute("aria-hidden","true");
    ceu.innerHTML = '<i class="fx-aurora"></i><i class="fx-aurora b"></i>' + (calmo ? "" : "<canvas></canvas>") + (fino && !calmo ? '<em class="fx-luz"></em>' : "");
    hero.insertBefore(ceu, hero.querySelector(".hero__texto"));
    var mx = -1e4, my = -1e4;
    if (fino && !calmo){
      hero.addEventListener("pointermove", function(e){
        var r = hero.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top;
        ceu.style.setProperty("--sx", mx + "px"); ceu.style.setProperty("--sy", my + "px");
      }, {passive:true});
      hero.addEventListener("pointerleave", function(){ mx = my = -1e4; ceu.style.setProperty("--sx","-999px"); }, {passive:true});
    }
    var cv = ceu.querySelector("canvas");
    if (cv){
      var ctx = cv.getContext("2d"), W = 1, H = 1, DPR = 1, ps = [], rodando = false, ult = 0, visivel = false, rt = 0;
      var semear = function(){
        var n = pequeno() ? 12 : 26; ps = [];
        for (var i = 0; i < n; i++) ps.push({ x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-.5)*.12, vy:-(.04+Math.random()*.14),
          r:.6+Math.random()*1.3, f:Math.random()*6.28, v:.02+Math.random()*.04, ouro:Math.random() < .7 });
      };
      var medir = function(){
        var r = hero.getBoundingClientRect(); DPR = Math.min(devicePixelRatio || 1, 1.5);
        W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
        cv.width = Math.round(W*DPR); cv.height = Math.round(H*DPR); cv.style.width = W+"px"; cv.style.height = H+"px";
        ctx.setTransform(DPR,0,0,DPR,0,0); semear();
      };
      var quadro = function(t){
        if (!rodando) return; requestAnimationFrame(quadro);
        if (t - ult < 33) return; ult = t; ctx.clearRect(0,0,W,H);
        for (var i = 0; i < ps.length; i++){
          var p = ps[i]; p.f += p.v; p.x += p.vx + Math.sin(p.f)*.25; p.y += p.vy;
          if (mx > -1e3){ var dx = mx-p.x, dy = my-p.y, d2 = dx*dx+dy*dy; if (d2 < 200*200 && d2 > 9){ p.x += dx/Math.sqrt(d2)*.25; p.y += dy/Math.sqrt(d2)*.25; } }
          if (p.y < -10){ p.y = H + 10; p.x = Math.random()*W; } if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
          var a = .18 + .3*(.5+.5*Math.sin(p.f*2));
          var g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*5);
          g.addColorStop(0, p.ouro ? "rgba(255,226,150,"+a.toFixed(2)+")" : "rgba(201,218,136,"+a.toFixed(2)+")");
          g.addColorStop(1, "rgba(255,226,150,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*5,0,6.2832); ctx.fill();
        }
      };
      var ligar = function(){ if (rodando || !visivel || doc.hidden) return; rodando = true; ult = 0; requestAnimationFrame(quadro); };
      var parar = function(){ rodando = false; };
      medir();
      addEventListener("resize", function(){ clearTimeout(rt); rt = setTimeout(medir, 160); }, {passive:true});
      if ("IntersectionObserver" in window) new IntersectionObserver(function(es){ es.forEach(function(en){ visivel = en.isIntersecting; visivel ? ligar() : parar(); }); }, {threshold:.04}).observe(hero);
      else { visivel = true; ligar(); }
      doc.addEventListener("visibilitychange", function(){ doc.hidden ? parar() : ligar(); });
    }
  }

  /* seta nos botões principais */
  doc.querySelectorAll(".hero__acoes .btn:not(.btn--vazado), .btn--grande, .pacote .btn, .fx-barra .btn:not(.btn--vazado)").forEach(function(b){
    if (!b.querySelector(".fx-seta")){ var s = doc.createElement("span"); s.className = "fx-seta"; s.setAttribute("aria-hidden","true"); s.textContent = "→"; b.appendChild(s); }
  });

  if (fino && !calmo){
    /* ímã nos botões */
    doc.querySelectorAll(".hero__acoes .btn, .btn--grande, .pacote .btn").forEach(function(b){
      b.classList.add("fx-ima");
      b.addEventListener("pointermove", function(e){ var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width/2)*.06).toFixed(1) + "px," + ((e.clientY - r.top - r.height/2)*.1).toFixed(1) + "px)"; });
      b.addEventListener("pointerleave", function(){ b.style.transform = ""; });
    });
    /* cartões inclinam */
    doc.querySelectorAll(".caminho, .pacote, .formatos article").forEach(function(c){
      c.classList.add("fx-tilt");
      c.addEventListener("pointermove", function(e){ var r = c.getBoundingClientRect();
        var x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5;
        c.style.transform = "perspective(900px) rotateY(" + (x*2.5).toFixed(2) + "deg) rotateX(" + (-y*2.5).toFixed(2) + "deg) translateY(-2px)"; });
      c.addEventListener("pointerleave", function(){ c.style.transform = ""; });
    });
  }

  /* rede de segurança do reveal: rolagem rápida no celular não deixa seção apagada */
  var pend = [].slice.call(doc.querySelectorAll("[data-reveal], .passos li")), agendado = false;
  var varre = function(){
    agendado = false; var lim = innerHeight * 1.02;
    pend = pend.filter(function(el){
      if (el.classList.contains("is-visivel")) return false;
      if (el.getBoundingClientRect().top < lim){ el.classList.add("is-visivel"); return false; }
      return true;
    });
  };
  addEventListener("scroll", function(){ if (!agendado && pend.length){ agendado = true; setTimeout(varre, 120); } }, {passive:true});

  /* barra fixa no celular: aparece depois do hero, some no fechamento */
  var barra = doc.querySelector(".fx-barra");
  if (barra){
    var alvoHero = doc.querySelector(".hero, .pagina-topo"), fim = doc.querySelector(".fechamento");
    var heroFora = false, fimDentro = false;
    var atual2 = function(){ barra.classList.toggle("is-visivel", heroFora && !fimDentro); };
    if ("IntersectionObserver" in window){
      if (alvoHero) new IntersectionObserver(function(es){ heroFora = !es[0].isIntersecting; atual2(); }, {threshold:0}).observe(alvoHero);
      else heroFora = true;
      if (fim) new IntersectionObserver(function(es){ fimDentro = es[0].isIntersecting; atual2(); }, {threshold:.2}).observe(fim);
    } else { barra.classList.add("is-visivel"); }
  }
})();
