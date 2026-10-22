/* Espaço Garden: funil de qualificação (22/10/2026).
   Mesmo formato da Koisa Linda (/agendar-perfil): ocasião → data → convidados → investimento/formato → nome,
   uma pergunta por tela. Termina no WhatsApp do Garden com as respostas já escritas, para a Gabi atender
   sabendo quem é. Não grava nada em servidor. */
(function(){
  "use strict";
  var NUM = "5521990782367";
  var doc = document;
  var pagina = (doc.body.dataset.pagina || "inicio");

  var T = {
    tipo: { q:"Qual é o seu evento?", ops:[
      ["casamento","Casamento","Cerimônia e festa"],["15anos","15 anos","Festa da debutante"],
      ["empresa","Evento da empresa","Confraternização, imersão, treinamento"],["outro","Outra celebração","Aniversário, bodas e outras"]]},
    quando: { q:"Para quando é o evento?", ops:[
      ["2026","Ainda em 2026",""],["2027","Em 2027",""],["2028","Em 2028",""],["definindo","Ainda estou definindo",""]]},
    convidados: { q:"Quantas pessoas, mais ou menos?", ops:[
      ["menos50","Menos de 50",""],["50a99","De 50 a 99",""],["100a150","De 100 a 150",""],["151a200","De 151 a 200",""],["mais200","Mais de 200",""]]},
    proposta: { q:"Qual proposta chama mais sua atenção?", ops:[
      ["diamante","Diamante","A mais completa, todos os dias da semana"],["soft","Soft","Domingo a quinta"],["ajuda","Quero ajuda para escolher","A gerência explica na visita"]]},
    formato: { q:"Qual é o formato?", ops:[
      ["confra","Confraternização","Fim de ano, celebração da equipe"],["imersao","Imersão ou treinamento","Um ou mais dias de conteúdo"],
      ["aniversario","Aniversário da empresa",""],["clientes","Evento com clientes e parceiros",""]]}
  };
  var ROTULO = {};
  Object.keys(T).forEach(function(k){ T[k].ops.forEach(function(o){ ROTULO[k+":"+o[0]] = o[1]; }); });

  function passos(r){
    var p = ["tipo","quando","convidados"];
    p.push(r.tipo === "empresa" ? "formato" : "proposta");
    p.push("nome");
    return p;
  }

  /* monta o diálogo */
  var d = doc.createElement("dialog");
  d.className = "funil"; d.setAttribute("aria-labelledby","funil-titulo");
  /* innerHTML só com texto fixo; resposta do visitante entra por textContent/value */
  d.innerHTML =
    '<form method="dialog" class="funil__caixa" novalidate>' +
      '<div class="funil__topo"><p class="funil__marca">Espaço Garden</p>' +
      '<button type="button" class="funil__fechar" aria-label="Fechar">&times;</button></div>' +
      '<div class="funil__barra" aria-hidden="true"><span></span></div>' +
      '<p class="funil__passo" aria-live="polite"></p>' +
      '<h2 id="funil-titulo" class="funil__titulo"></h2>' +
      '<div class="funil__corpo"></div>' +
      '<p class="funil__aviso" hidden></p>' +
      '<div class="funil__acoes"><button type="button" class="funil__voltar">Voltar</button>' +
      '<button type="button" class="btn funil__seguir" hidden>Continuar</button></div>' +
      '<p class="funil__direto"><a href="#" class="funil__pular">Prefiro falar direto no WhatsApp</a></p>' +
    '</form>';
  doc.body.appendChild(d);
  var $ = function(s){ return d.querySelector(s); };
  var r = {}, i = 0, origem = "site", seq = [];

  function wa(texto){ return "https://wa.me/" + NUM + "?text=" + encodeURIComponent(texto); }

  function mensagem(){
    var l = ["Olá! Vim pelo site do Espaço Garden."];
    if (r.nome) l[0] = "Olá! Sou " + r.nome + " e vim pelo site do Espaço Garden.";
    l.push("Evento: " + (ROTULO["tipo:"+r.tipo] || "-"));
    l.push("Quando: " + (ROTULO["quando:"+r.quando] || "-"));
    l.push("Pessoas: " + (ROTULO["convidados:"+r.convidados] || "-"));
    if (r.formato) l.push("Formato: " + ROTULO["formato:"+r.formato]);
    if (r.proposta) l.push("Proposta: " + ROTULO["proposta:"+r.proposta]);
    l.push(r.tipo === "empresa" ? "Quero receber a proposta e agendar a visita técnica." : "Quero saber se a data está livre e agendar uma visita.");
    l.push("[funil-" + origem + "]");
    return l.join("\n");
  }

  function aviso(){
    var a = "";
    var social = r.tipo === "casamento" || r.tipo === "15anos" || r.tipo === "outro";
    if (social && (r.convidados === "menos50" || r.convidados === "50a99"))
      a = "Nossas propostas de festa partem de 100 convidados. Mande mesmo assim: a gerência avalia o seu caso na visita.";
    if (r.tipo === "empresa" && r.convidados === "menos50")
      a = "O corporativo parte de 50 pessoas (a partir de R$ 19 mil). Mande mesmo assim que a gerência avalia.";
    return a;
  }

  function render(){
    seq = passos(r);
    var k = seq[i], total = seq.length;
    $(".funil__barra span").style.width = Math.round((i) / total * 100) + "%";
    $(".funil__passo").textContent = "Pergunta " + (i+1) + " de " + total;
    $(".funil__voltar").style.visibility = i ? "visible" : "hidden";
    var corpo = $(".funil__corpo"), seguir = $(".funil__seguir"), av = $(".funil__aviso");
    corpo.textContent = ""; av.hidden = true;
    if (k === "nome"){
      $(".funil__titulo").textContent = "Pronto. Como podemos te chamar?";
      var txt = aviso();
      if (txt){ av.textContent = txt; av.hidden = false; }
      var lab = doc.createElement("label"); lab.className = "funil__campo";
      lab.innerHTML = '<span>Seu nome (opcional)</span><input type="text" name="nome" autocomplete="given-name" maxlength="60">';
      var inp = lab.querySelector("input"); inp.value = r.nome || "";
      corpo.appendChild(lab);
      var res = doc.createElement("ul"); res.className = "funil__resumo";
      [["Evento",ROTULO["tipo:"+r.tipo]],["Quando",ROTULO["quando:"+r.quando]],["Pessoas",ROTULO["convidados:"+r.convidados]],
       r.formato ? ["Formato",ROTULO["formato:"+r.formato]] : null, r.proposta ? ["Proposta",ROTULO["proposta:"+r.proposta]] : null]
        .filter(Boolean).forEach(function(x){ var li = doc.createElement("li"); var b = doc.createElement("b"); b.textContent = x[0]; li.appendChild(b); li.appendChild(doc.createTextNode(x[1] || "-")); res.appendChild(li); });
      corpo.appendChild(res);
      seguir.hidden = false; seguir.textContent = r.tipo === "empresa" ? "Receber proposta no WhatsApp" : "Consultar data no WhatsApp";
      seguir.onclick = function(){
        r.nome = inp.value.replace(/\s+/g," ").trim().slice(0,60);
        window.open(wa(mensagem()), "_blank", "noopener");
        $(".funil__barra span").style.width = "100%";
        d.close();
      };
      inp.addEventListener("keydown", function(e){ if (e.key === "Enter"){ e.preventDefault(); seguir.click(); } });
      setTimeout(function(){ inp.focus(); }, 50);
      return;
    }
    seguir.hidden = true;
    $(".funil__titulo").textContent = T[k].q;
    var grade = doc.createElement("div"); grade.className = "funil__opcoes"; grade.setAttribute("role","list");
    T[k].ops.forEach(function(o){
      var b = doc.createElement("button"); b.type = "button"; b.className = "funil__op"; b.setAttribute("role","listitem");
      if (r[k] === o[0]) b.classList.add("is-marcada");
      var s = doc.createElement("strong"); s.textContent = o[1]; b.appendChild(s);
      if (o[2]){ var sm = doc.createElement("small"); sm.textContent = o[2]; b.appendChild(sm); }
      b.addEventListener("click", function(){
        r[k] = o[0];
        if (k === "tipo"){ if (o[0] === "empresa") delete r.proposta; else delete r.formato; }
        b.classList.add("is-marcada");
        setTimeout(function(){ i++; render(); }, 180);
      });
      grade.appendChild(b);
    });
    corpo.appendChild(grade);
    var primeiro = grade.querySelector("button"); if (primeiro) setTimeout(function(){ primeiro.focus(); }, 50);
  }

  function abrir(org, preset, prop){
    origem = org || pagina; r = {}; i = 0;
    if (preset){ r.tipo = preset; i = 1; }
    if (prop) r.proposta = prop;
    render();
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open","");
  }

  $(".funil__fechar").addEventListener("click", function(){ d.close(); });
  $(".funil__voltar").addEventListener("click", function(){ if (i > 0){ i--; render(); } });
  d.addEventListener("click", function(e){ if (e.target === d) d.close(); });
  $(".funil__pular").addEventListener("click", function(e){
    e.preventDefault();
    var t = (window.GARDEN_SAUDACAO || "Olá! Vim pelo site e gostaria de agendar uma visita ao Espaço Garden.") + " [direto-" + origem + "]";
    window.open(wa(t), "_blank", "noopener"); d.close();
  });

  /* todo botão de WhatsApp do site passa pelo funil */
  var presetPagina = pagina === "corporativo" ? "empresa" : null;
  doc.addEventListener("click", function(e){
    var a = e.target.closest && e.target.closest(".js-whats");
    if (!a || e.ctrlKey || e.metaKey || e.shiftKey) return;
    e.preventDefault();
    var org = a.dataset.origem || pagina;
    var preset = presetPagina;
    if (/debutante/.test(org)) preset = "15anos";
    else if (/casamento/.test(org)) preset = "casamento";
    var prop = /-(diamante|soft)$/.test(org) ? org.split("-").pop() : null;
    abrir(org, preset, prop);
  }, true);

  window.GardenFunil = { abrir: abrir };
})();
