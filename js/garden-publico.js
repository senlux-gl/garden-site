/* Espaço Garden · página única de noivas e debutantes (18/11/2026).
   Pedido do Guilherme: todo lead do anúncio cai numa página só, e a jornada se adapta ao anúncio.
   O público sai do utm_campaign (lido no começo da página) do anúncio (casamento-*, 15anos-*, o resto é geral) ou de ?p= para teste.
   O texto de cada público já está no HTML (data-so); aqui só se escolhe qual aparece, se trocam as fotos
   do topo e se marca a origem dos botões, para o funil já saber o evento e pular a primeira pergunta. */
(function(){
  "use strict";
  var doc = document, body = doc.body;
  /* o público já foi escolhido no começo da página (script curto logo depois do <body>), para não piscar */
  var p = body.dataset.publico || "geral";

  var SLIDES = {
    casamento: "/img/espaco-salao-casamento.webp,/img/espaco-cerimonia-interna.webp,/img/espaco-mesa-imperial.webp",
    "15anos": "/img/espaco-salao-festa.webp,/img/espaco-pista-telao.webp,/img/espaco-doces.webp",
    geral: "/img/espaco-salao-casamento.webp,/img/espaco-salao-festa.webp,/img/espaco-mesa-imperial.webp"
  };
  var foto = doc.querySelector(".chegada__foto");
  if (foto) foto.dataset.slides = SLIDES[p];

  /* "noivas-hero" vira "noivas-casamento-hero" ou "noivas-debutante-hero": o funil pula "Qual é o seu evento?" */
  var marca = p === "casamento" ? "casamento" : p === "15anos" ? "debutante" : "";
  if (marca) doc.querySelectorAll(".js-whats[data-origem^='noivas-']").forEach(function(a){
    if (a.dataset.origem.indexOf(marca) === -1) a.dataset.origem = a.dataset.origem.replace(/^noivas-/, "noivas-" + marca + "-");
  });

  var SAUDA = {
    casamento: "Olá! Vim pelo site, página de casamento, e quero marcar uma visita ao Espaço Garden.",
    "15anos": "Olá! Vim pelo site, página de 15 anos, e quero marcar uma visita ao Espaço Garden.",
    geral: "Olá! Vim pelo site, página de noivas e debutantes, e quero saber se a minha data está livre no Espaço Garden."
  };
  window.GARDEN_SAUDACAO = SAUDA[p];
})();
