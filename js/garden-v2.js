/* Espaço Garden v2: menu, troca de ano, filtro e lupa do portfólio. */
(function(){
  /* menu no celular */
  var botao = document.querySelector(".menu-botao");
  var nav = document.getElementById("menu");
  if (botao && nav){
    botao.addEventListener("click", function(){
      var aberto = botao.getAttribute("aria-expanded") === "true";
      botao.setAttribute("aria-expanded", String(!aberto));
      botao.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
      nav.classList.toggle("is-aberto", !aberto);
    });
  }

  /* troca de ano nas propostas (preços vêm do material vigente do Garden) */
  var abas = document.querySelectorAll(".ano-troca [data-ano]");
  abas.forEach(function(aba){
    aba.addEventListener("click", function(){
      var ano = aba.dataset.ano;
      abas.forEach(function(a){ a.setAttribute("aria-selected", String(a === aba)); });
      document.querySelectorAll("[data-preco-" + ano + "]").forEach(function(el){
        el.classList.add("is-trocando");
        setTimeout(function(){
          el.textContent = el.getAttribute("data-preco-" + ano); /* texto puro: o atributo já vem decodificado */
          el.classList.remove("is-trocando");
        }, 220);
      });
      document.querySelectorAll(".js-ano-txt").forEach(function(el){ el.textContent = ano; });
      /* o ano escolhido vai junto na mensagem do WhatsApp */
      document.querySelectorAll(".pacote .js-whats").forEach(function(b){
        try{
          /* monta de novo com encodeURIComponent (URL.toString trocaria espaço por "+") */
          var base = b.href.split("?text=")[0];
          var t = decodeURIComponent((b.href.split("?text=")[1] || "").replace(/\+/g, " ")).replace(/ \(evento em \d{4}\)/, "");
          b.href = base + "?text=" + encodeURIComponent(t.replace(/ \[/, " (evento em " + ano + ") ["));
        }catch(e){}
      });
    });
  });

  /* filtro do portfólio */
  var filtros = document.querySelectorAll(".filtros [data-filtro]");
  filtros.forEach(function(f){
    f.addEventListener("click", function(){
      var alvo = f.dataset.filtro;
      filtros.forEach(function(o){ o.setAttribute("aria-pressed", String(o === f)); });
      document.querySelectorAll(".galeria--portfolio .galeria__item").forEach(function(item){
        var mostra = alvo === "todas" || item.dataset.cat === alvo;
        item.classList.toggle("is-oculto", !mostra);
        if (mostra) item.classList.add("is-visivel");
      });
    });
  });

  /* lupa */
  var lupa = document.querySelector(".lupa");
  if (lupa && typeof lupa.showModal === "function"){
    var img = lupa.querySelector("img"), leg = lupa.querySelector("p");
    document.querySelectorAll(".galeria--portfolio .galeria__item img").forEach(function(foto){
      foto.setAttribute("tabindex", "0");
      function abrir(){
        img.src = foto.src; img.alt = foto.alt;
        var fc = foto.closest("figure").querySelector("figcaption");
        leg.textContent = fc ? fc.textContent : "";
        lupa.showModal();
      }
      foto.addEventListener("click", abrir);
      foto.addEventListener("keydown", function(e){ if (e.key === "Enter" || e.key === " "){ e.preventDefault(); abrir(); } });
    });
    lupa.querySelector(".lupa__fechar").addEventListener("click", function(){ lupa.close(); });
    lupa.addEventListener("click", function(e){ if (e.target === lupa) lupa.close(); });
  }
})();
