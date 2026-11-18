/* Espaço Garden · primeira tela da página Noivas (17/11/2026).
   Acende os checks do "o que vem junto" e troca as fotos do topo devagar.
   Nada de esperar animação para mostrar texto, preço ou botão. */
(function(){
  "use strict";
  var doc = document, sec = doc.querySelector(".chegada");
  if (!sec) return;
  var calmo = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var economia = navigator.connection && navigator.connection.saveData;

  requestAnimationFrame(function(){ setTimeout(function(){ sec.classList.add("is-pronta"); }, 350); });

  var foto = sec.querySelector(".chegada__foto");
  var lista = (foto && foto.dataset.slides || "").split(",").map(function(s){ return s.trim(); }).filter(Boolean);
  if (!foto || !lista.length || calmo || economia) return;

  var slides = [foto.querySelector("img")];
  setTimeout(function(){
    lista.forEach(function(src){
      var im = doc.createElement("img"); im.className = "is-slide"; im.alt = ""; im.setAttribute("aria-hidden","true");
      im.decoding = "async"; im.src = src; foto.appendChild(im); slides.push(im);
    });
    var atual = 0;
    setInterval(function(){
      if (doc.hidden) return;
      var prox = (atual + 1) % slides.length;
      if (prox === 0) slides[atual].classList.remove("is-ativa");
      else { slides[prox].classList.add("is-ativa"); if (atual > 0) slides[atual].classList.remove("is-ativa"); }
      atual = prox;
    }, 4500);
  }, 3000);
})();
