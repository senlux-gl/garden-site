/* ═══════════════════════════════════════════════════════════
   Espaço Garden Eventos
   Tudo que é dado de contato vive AQUI. Trocar num lugar só.
   ═══════════════════════════════════════════════════════════ */

const GARDEN = {
  /* Número oficial do Espaço Garden — é a instância que a Gabi atende em produção.
     Formato: 55 + DDD + número, só dígitos. */
  whatsapp: "5521990782367",

  /* Mensagem que já vai escrita quando a pessoa abre a conversa.
     A origem entra no fim, pra sabermos de qual botão do site veio o lead. */
  saudacao: "Olá! Vim pelo site e gostaria de agendar uma visita ao Espaço Garden.",

  endereco: "Estr. Caetano Monteiro, 4036 — Pendotiba, Niterói/RJ, CEP 24320-570",
  visitas:  "Terça a sábado, das 10h às 18h"
};

/* ── monta os links de WhatsApp ─────────────────────────── */
(function ligarWhatsApp(){
  const configurado = /^\d{12,13}$/.test(GARDEN.whatsapp);
  const botoes = document.querySelectorAll(".js-whats");

  botoes.forEach(function(botao){
    const origem = botao.dataset.origem || "site";

    if (!configurado){
      botao.setAttribute("aria-disabled", "true");
      botao.addEventListener("click", function(e){
        e.preventDefault();
        console.warn("[Garden] WhatsApp ainda não configurado. Veja GARDEN.whatsapp em js/garden.js");
      });
      return;
    }

    const texto = GARDEN.saudacao + " [" + origem + "]";
    botao.href = "https://wa.me/" + GARDEN.whatsapp + "?text=" + encodeURIComponent(texto);
    botao.target = "_blank";
    botao.rel = "noopener";
  });

  if (!configurado) avisarPendencia();
})();

/* ── trava de segurança: não deixa subir com placeholder ── */
function avisarPendencia(){
  const local = location.hostname;
  const emDev = local === "localhost" || local === "127.0.0.1" || local === "" || local.endsWith(".local");

  console.warn(
    "%c[Espaço Garden] Esta página ainda está com placeholders.",
    "background:#8A2B2B;color:#fff;padding:2px 6px;border-radius:2px",
    "\n• WhatsApp: falta o número real em js/garden.js",
    "\n• Fotos: ok — 8 do espaço + hero, em site/img/ (ver README.md de lá)",
    "\nNão publicar assim. Lista completa: PENDENCIAS-CAROLINA.md"
  );

  if (!emDev) return; // em produção o aviso fica só no console, não na cara do visitante

  const faixa = document.createElement("div");
  faixa.className = "dev-aviso";
  faixa.textContent = "PRÉVIA — falta o número real do WhatsApp. Não publicar.";
  document.body.prepend(faixa);
  document.body.classList.add("tem-dev-aviso");
}

/* ── ano do rodapé ──────────────────────────────────────── */
document.querySelectorAll(".js-ano").forEach(function(el){
  el.textContent = new Date().getFullYear();
});

/* ── FAQ: abrir uma fecha as outras ─────────────────────── */
document.querySelectorAll(".faq details").forEach(function(item){
  item.addEventListener("toggle", function(){
    if (!item.open) return;
    document.querySelectorAll(".faq details[open]").forEach(function(outro){
      if (outro !== item) outro.open = false;
    });
  });
});

/* ═══════════════════════════════════════════════════════════
   MOVIMENTO
   Tudo aqui é enfeite. Se falhar, ou se a pessoa pediu menos
   movimento, a página fica parada — e continua inteira.
   ═══════════════════════════════════════════════════════════ */

const calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ── abertura do hero ───────────────────────────────────── */
(function abrirHero(){
  const hero = document.querySelector(".hero");
  if (!hero) return;

  if (calmo){ hero.classList.add("is-aberto"); return; }

  // espera a fonte assentar antes de revelar o título, senão a linha
  // mascarada pula de largura no meio da animação
  const pronto = document.fonts ? document.fonts.ready : Promise.resolve();
  pronto.then(function(){
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ hero.classList.add("is-aberto"); });
    });
  });
})();

/* ── reveal ao entrar na tela ───────────────────────────── */
(function revelar(){
  const alvos = document.querySelectorAll("[data-reveal], .passos li");
  if (!alvos.length) return;

  if (calmo || !("IntersectionObserver" in window)){
    alvos.forEach(function(el){ el.classList.add("is-visivel"); });
    return;
  }

  // O que já está dentro do hero entra na coreografia de abertura, não no
  // observer: senão os CTAs do rodapé da dobra ficam invisíveis até rolar.
  const hero = document.querySelector(".hero");
  const doHero = [];
  const resto = [];
  alvos.forEach(function(el){
    (hero && hero.contains(el) ? doHero : resto).push(el);
  });
  doHero.forEach(function(el){ el.classList.add("is-visivel"); });

  const olho = new IntersectionObserver(function(entradas){
    entradas.forEach(function(entrada){
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("is-visivel");
      olho.unobserve(entrada.target);   // revela uma vez só; não pisca no scroll de volta
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });

  resto.forEach(function(el){ olho.observe(el); });

  // rede de segurança: o que já estiver visível no carregamento não espera nada
  requestAnimationFrame(function(){
    const altura = window.innerHeight;
    resto.forEach(function(el){
      if (el.getBoundingClientRect().top < altura) el.classList.add("is-visivel");
    });
  });
})();

/* ── números que contam ─────────────────────────────────── */
(function contar(){
  const numeros = document.querySelectorAll("[data-conta]");
  if (!numeros.length) return;

  if (calmo || !("IntersectionObserver" in window)) return;  // já estão escritos no HTML

  const olho = new IntersectionObserver(function(entradas){
    entradas.forEach(function(entrada){
      if (!entrada.isIntersecting) return;
      const el = entrada.target;
      olho.unobserve(el);

      const fim = parseInt(el.dataset.conta, 10);
      const sufixo = el.dataset.sufixo || "";
      const duracao = 1100;
      const inicio = performance.now();

      (function passo(agora){
        const t = Math.min((agora - inicio) / duracao, 1);
        const suave = 1 - Math.pow(1 - t, 3);           // desacelera no fim
        el.textContent = Math.round(fim * suave) + sufixo;
        if (t < 1) requestAnimationFrame(passo);
      })(inicio);
    });
  }, { threshold: 0.6 });

  numeros.forEach(function(el){ olho.observe(el); });
})();

/* ── parallax do hero ───────────────────────────────────── */
(function parallax(){
  const foto = document.querySelector(".hero__foto");
  if (!foto || calmo) return;

  let pendente = false;

  function mover(){
    pendente = false;
    const y = window.scrollY;
    if (y > window.innerHeight) return;      // fora da tela, não gasta trabalho
    foto.style.setProperty("--deslize", (y * 0.18).toFixed(1) + "px");
  }

  window.addEventListener("scroll", function(){
    if (pendente) return;
    pendente = true;
    requestAnimationFrame(mover);
  }, { passive: true });

  mover();
})();

/* ── botão flutuante ────────────────────────────────────
   Só entra depois que o hero sai da tela: enquanto o hero está
   visível ele já tem os próprios CTAs, e o flutuante cobriria um
   deles nas telas estreitas.                                    */
(function soltarFlutuante(){
  const botao = document.querySelector(".flutuante");
  const hero  = document.querySelector(".hero");
  if (!botao) return;

  if (!hero || !("IntersectionObserver" in window)){
    botao.classList.add("is-visivel");
    return;
  }

  const olho = new IntersectionObserver(function(entradas){
    entradas.forEach(function(entrada){
      botao.classList.toggle("is-visivel", !entrada.isIntersecting);
    });
  }, { rootMargin: "-72px 0px 0px 0px", threshold: 0 });

  olho.observe(hero);
})();
