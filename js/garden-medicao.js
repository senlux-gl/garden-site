/* Espaço Garden: medição do funil (27/10/2026; pixel da Meta em 29/10/2026).
   Só do Garden: GA4, Google Ads e pixel da Meta próprios, nada de KL ou Senlux. Com os IDs vazios não
   carrega nada, então pode ir ao ar antes das contas existirem. Guarda a origem do anúncio (utm, gclid,
   fbclid) na sessão para o funil escrever na mensagem do WhatsApp e a Gabi saber de onde veio.
   Nenhum nome, telefone ou texto da conversa vai para o Google ou para a Meta. */
(function(){
  "use strict";
  var GA4 = "";                 /* G-XXXXXXX da propriedade do Garden */
  var ADS = "";                 /* AW-XXXXXXX da conta Google Ads do Garden */
  var ROTULO = { lead: "", direto: "" };   /* rótulos das conversões no Google Ads */
  var PIXEL = "1099609106029176"; /* pixel "Garden · Site e funil", conta 936427345967738 */

  var w = window, doc = document;
  var CHAVE = "garden_origem";

  /* origem: o primeiro clique de anúncio da sessão vale */
  var origem = {};
  try { origem = JSON.parse(sessionStorage.getItem(CHAVE) || "{}"); } catch(e){}
  var q = new URLSearchParams(location.search);
  if (q.get("gclid") || q.get("fbclid") || q.get("utm_source")){
    origem = { fonte: q.get("utm_source") || (q.get("gclid") ? "google" : "meta"), campanha: q.get("utm_campaign") || "", gclid: q.get("gclid") || "" };
    try { sessionStorage.setItem(CHAVE, JSON.stringify(origem)); } catch(e){}
  }

  var google = !!(GA4 || ADS);
  if (google){
    w.dataLayer = w.dataLayer || [];
    w.gtag = function(){ w.dataLayer.push(arguments); };
    var s = doc.createElement("script"); s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + (GA4 || ADS);
    doc.head.appendChild(s);
    w.gtag("js", new Date());
    if (GA4) w.gtag("config", GA4);
    if (ADS) w.gtag("config", ADS);
  }

  /* pixel da Meta: PageView em toda página, ViewContent na página da oferta */
  var oferta = location.pathname.indexOf("/corporativo") === 0 ? "corporativo"
             : location.pathname.indexOf("/noivas-e-debutantes") === 0 ? "festas" : "";
  if (PIXEL){
    var f = w.fbq = function(){ f.callMethod ? f.callMethod.apply(f, arguments) : f.queue.push(arguments); };
    if (!w._fbq) w._fbq = f;
    f.push = f; f.loaded = true; f.version = "2.0"; f.queue = [];
    var p = doc.createElement("script"); p.async = true;
    p.src = "https://connect.facebook.net/en_US/fbevents.js";
    doc.head.appendChild(p);
    w.fbq("init", PIXEL);
    w.fbq("track", "PageView");
    if (oferta) w.fbq("track", "ViewContent", { content_name: oferta });
  }

  /* id do evento, para a API de conversões não contar duas vezes quando entrar */
  function idEvento(){ return "g" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

  function medir(evento, dados){
    dados = dados || {};
    if (google){
      w.gtag("event", evento, dados);
      var rotulo = evento === "generate_lead" ? ROTULO.lead : evento === "contato_direto" ? ROTULO.direto : "";
      if (ADS && rotulo) w.gtag("event", "conversion", { send_to: ADS + "/" + rotulo });
    }
    if (PIXEL){
      var meta = { content_name: dados.oferta || oferta || "", content_category: dados.evento || "" };
      var id = { eventID: idEvento() };
      if (evento === "funil_iniciado") w.fbq("trackCustom", "FunilIniciado", meta, id);
      else if (evento === "generate_lead") w.fbq("track", "Lead", meta, id);
      else if (evento === "contato_direto") w.fbq("track", "Contact", meta, id);
    }
  }

  /* etiqueta curta para a mensagem do WhatsApp: "google-festas", "meta-festas" ou vazio */
  function etiqueta(){
    if (!origem.fonte) return "";
    return (origem.fonte + (origem.campanha ? "-" + origem.campanha : "")).toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  }

  w.GardenMedicao = { medir: medir, etiqueta: etiqueta };
})();
