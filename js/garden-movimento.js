/* Espaço Garden · movimento na rolagem (GSAP + ScrollTrigger + SplitText), 17/11/2026.
   Camada só visual: não envia dados e não muda texto. Sem a biblioteca ou com
   "reduzir movimento", não faz nada e o site continua como era. */
(function(){
  "use strict";
  if (!window.gsap || !window.ScrollTrigger) return;
  var doc = document, root = doc.documentElement;
  var temSplit = !!window.SplitText;
  gsap.registerPlugin(ScrollTrigger);
  if (temSplit) gsap.registerPlugin(SplitText);

  var CURVA = "expo.out";
  var mm = gsap.matchMedia();

  mm.add({
    mexe: "(prefers-reduced-motion: no-preference)",
    grande: "(min-width: 900px)"
  }, function(ctx){
    var c = ctx.conditions;
    if (!c.mexe) return;
    root.classList.add("mv-on");

    /* 1. topo que se afasta devagar */
    var hero = doc.querySelector(".hero");
    if (hero){
      var foto = hero.querySelector(".hero__foto"), texto = hero.querySelector(".hero__texto");
      var tl = gsap.timeline({ scrollTrigger:{ trigger:hero, start:"top top", end:"bottom top", scrub:true } });
      if (foto) tl.to(foto, { yPercent:14, ease:"none" }, 0);
      if (texto) tl.to(texto, { y:-60, autoAlpha:.25, ease:"none" }, 0);
    }

    /* percorre as seções de cima para baixo: os gatilhos nascem na ordem da página */
    gsap.utils.toArray("main > section").forEach(function(sec){

      /* 2. títulos que sobem linha por linha */
      if (temSplit){
        sec.querySelectorAll("h2").forEach(function(h){
          h.removeAttribute("data-reveal"); h.classList.add("is-visivel", "mv-titulo");
          SplitText.create(h, {
            type:"lines", mask:"lines", linesClass:"mv-linha", autoSplit:true,
            onSplit:function(self){
              return gsap.from(self.lines, {
                yPercent:110, duration:1.25, ease:CURVA, stagger:.12,
                scrollTrigger:{ trigger:h, start:"top 88%", once:true }
              });
            }
          });
        });
      }

      /* 3. fotos dos caminhos que se revelam de baixo para cima */
      var fotosCaminho = sec.querySelectorAll(".caminho img");
      if (fotosCaminho.length){
        gsap.set(fotosCaminho, { clipPath:"inset(100% 0% 0% 0%)", scale:1.14, transition:"none" });
        ScrollTrigger.batch(fotosCaminho, {
          start:"top 90%", once:true,
          onEnter:function(lote){
            gsap.to(lote, { clipPath:"inset(0% 0% 0% 0%)", scale:1, duration:1.5, ease:CURVA, stagger:.14,
              onComplete:function(){ gsap.set(lote, { clearProps:"transform,transition,clipPath" }); } });
          }
        });
      }

      /* 4. passeio: rola para baixo, as fotos andam para o lado (computador) */
      if (sec.classList.contains("passeio")){
        var janela = sec.querySelector(".passeio__janela"), trilho = sec.querySelector(".passeio__trilho");
        var barra = sec.querySelector(".passeio__progresso i");
        var imgs = gsap.utils.toArray(".passeio__moldura img", sec);
        ScrollTrigger.create({ trigger:sec, start:"top 250%", once:true,
          onEnter:function(){ imgs.forEach(function(i){ i.loading = "eager"; }); } });
        if (c.grande && janela && trilho){
          var distancia = function(){ return Math.max(0, trilho.scrollWidth - janela.clientWidth); };
          var anda = gsap.to(trilho, {
            x:function(){ return -distancia(); }, ease:"none",
            scrollTrigger:{ trigger:sec, pin:sec, start:"top top",
              end:function(){ return "+=" + distancia(); }, scrub:1, invalidateOnRefresh:true,
              onUpdate:function(self){ if (barra) gsap.set(barra, { scaleX:self.progress }); } }
          });
          imgs.forEach(function(img){
            gsap.fromTo(img, { xPercent:-6 }, { xPercent:6, ease:"none",
              scrollTrigger:{ trigger:img.closest(".passeio__foto"), containerAnimation:anda, start:"left right", end:"right left", scrub:true } });
          });
          gsap.utils.toArray(".passeio__foto", sec).forEach(function(f){
            gsap.from(f, { autoAlpha:0, y:40, duration:1.1, ease:CURVA,
              scrollTrigger:{ trigger:f, containerAnimation:anda, start:"left 92%", toggleActions:"play none none none" } });
          });
        } else {
          gsap.from(gsap.utils.toArray(".passeio__foto", sec), { autoAlpha:0, x:40, duration:1.1, ease:CURVA, stagger:.1,
            scrollTrigger:{ trigger:janela || sec, start:"top 85%", once:true } });
        }
      }

      /* 5. janela em arco que se abre para o jardim */
      if (sec.classList.contains("janela")){
        var moldura = sec.querySelector(".janela__moldura"), imgJ = sec.querySelector(".janela__moldura img");
        var arco = c.grande ? "inset(14% 34% 6% 34% round 999px 999px 0px 0px)" : "inset(12% 16% 6% 16% round 999px 999px 0px 0px)";
        var abre = gsap.timeline({ scrollTrigger:{ trigger:sec, start:"top 80%", end:"top top", scrub:1 } });
        abre.fromTo(moldura, { clipPath:arco }, { clipPath:"inset(0% 0% 0% 0% round 0px 0px 0px 0px)", ease:"none" }, 0);
        if (imgJ) abre.fromTo(imgJ, { scale:1.22 }, { scale:1, ease:"none" }, 0);
      }
    });

    /* 6. galeria do portfólio: cada foto sobe numa cortina */
    var galeria = gsap.utils.toArray(".galeria__item img");
    if (galeria.length){
      gsap.set(galeria, { clipPath:"inset(100% 0% 0% 0%)", scale:1.12, transition:"none" });
      ScrollTrigger.batch(galeria, {
        start:"top 92%", once:true, interval:.12,
        onEnter:function(lote){
          gsap.to(lote, { clipPath:"inset(0% 0% 0% 0%)", scale:1, duration:1.35, ease:CURVA, stagger:.12,
            onComplete:function(){ gsap.set(lote, { clearProps:"transform,transition,clipPath" }); } });
        }
      });
      /* o filtro muda a grade: mostra tudo e recalcula */
      doc.querySelectorAll(".filtros [data-filtro]").forEach(function(f){
        f.addEventListener("click", function(){
          gsap.set(galeria, { clearProps:"transform,transition,clipPath" });
          requestAnimationFrame(function(){ ScrollTrigger.refresh(); });
        });
      });
    }

    return function(){ root.classList.remove("mv-on"); };
  });

  /* fontes e fotos mudam alturas: recalcula quando terminam */
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function(){ ScrollTrigger.refresh(); });
  addEventListener("load", function(){ ScrollTrigger.refresh(); });
})();
