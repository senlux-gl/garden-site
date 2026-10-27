/* Espaço Garden: medição do funil (candidata 27/10/2026).
   Só do Garden: GA4 e Google Ads próprios, nada de KL ou Senlux. Com os IDs vazios não carrega nada,
   então pode ir ao ar antes das contas existirem. Guarda a origem do anúncio (utm e gclid) na sessão
   para o funil escrever na mensagem do WhatsApp e a Gabi saber de onde veio. */
(function(){
  "use strict";
  var GA4 = "";                 /* G-XXXXXXX da propriedade do Garden */
  var ADS = "";                 /* AW-XXXXXXX da conta Google Ads do Garden */
  var ROTULO = { lead: "", direto: "" };   /* rótulos das conversões no Google Ads */

  var w = window, doc = document;
  var CHAVE = "garden_origem";

  /* origem: o primeiro clique de anúncio da sessão vale */
  var origem = {};
  try { origem = JSON.parse(sessionStorage.getItem(CHAVE) || "{}"); } catch(e){}
  var q = new URLSearchParams(location.search);
  if (q.get("gclid") || q.get("utm_source")){
    origem = { fonte: q.get("utm_source") || "google", campanha: q.get("utm_campaign") || "", gclid: q.get("gclid") || "" };
    try { sessionStorage.setItem(CHAVE, JSON.stringify(origem)); } catch(e){}
  }

  var ligado = !!(GA4 || ADS);
  if (ligado){
    w.dataLayer = w.dataLayer || [];
    w.gtag = function(){ w.dataLayer.push(arguments); };
    var s = doc.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + (GA4 || ADS);
    doc.head.appendChild(s);
    w.gtag("js", new Date());
    if (GA4) w.gtag("config", GA4);
    if (ADS) w.gtag("config", ADS);
  }

  function medir(evento, dados){
    if (!ligado) return;
    dados = dados || {};
    w.gtag("event", evento, dados);
    var rotulo = evento === "generate_lead" ? ROTULO.lead : evento === "contato_direto" ? ROTULO.direto : "";
    if (ADS && rotulo) w.gtag("event", "conversion", { send_to: ADS + "/" + rotulo });
  }

  /* etiqueta curta para a mensagem do WhatsApp: "google-festas" ou vazio */
  function etiqueta(){
    if (!origem.fonte) return "";
    return (origem.fonte + (origem.campanha ? "-" + origem.campanha : "")).toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  }

  w.GardenMedicao = { medir: medir, etiqueta: etiqueta };
})();
