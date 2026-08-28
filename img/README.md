# Fotos do site

**Estado: 9 no ar** (hero + 8 na galeria). Entregues pela Carolina em 28/08/2026.
As originais deduplicadas (137 fotos) ficam em `../../_acervo-fotos/` — fora do git.

## O que está no ar

| Arquivo | O que é | Tamanho | Origem (nome no acervo) |
|---|---|---|---|
| `hero.webp` | Cerimônia no bambuzal, vista do corredor | 1280×720 | `102.jpg` |
| `espaco-jardim.webp` | Bancos e passadeira debaixo dos bambus | 1200×675 | `136.jpg` |
| `espaco-salao-casamento.webp` | Salão com as árvores brancas e o lounge | 1200×900 | `104.jpg` |
| `espaco-cerimonia-interna.webp` | Passadeira de LED e lustre de cristal | 1200×900 | `003.jpg` |
| `espaco-cascata.webp` | Cascata e o espelho d'água | 1200×900 | `006.jpg` |
| `espaco-cerimonia-externa.webp` | Portal de flores do altar ao ar livre | 1200×900 | `123.jpg` |
| `espaco-salao-festa.webp` | O mesmo salão em teto de flores (debutante) | 1200×675 | `109.jpg` |
| `espaco-buffet.webp` | Mesa posta com flores e taças | 1200×900 | `133.jpg` |
| `espaco-fachada.webp` | A entrada iluminada, à noite | 1200×900 | `089.jpg` |
| `logo-garden.png` | Logo — ainda PNG, trocar por SVG quando chegar | — | Carolina |
| `ornamento-arvore.png` | Ornamento da árvore, usado no hero | — | derivado do logo |

## O que ficou registrado

1. **Direito de uso: liberado.** Parte do acervo tem a assinatura de um fotógrafo
   (**"Marcelo Silva"**, em script branco no canto). As 9 escolhidas são as **sem assinatura
   visível**, e o Guilherme confirmou em 28/08/2026 que o uso está resolvido — seguir com elas.

2. **Resolução: 1280px no lado maior.** Tudo chegou comprimido (WhatsApp ou Google Fotos). Serve
   para o site como está; o hero fica esticado em telas grandes. Se aparecerem os arquivos
   originais do fotógrafo, vale refazer — o processo está logo abaixo.

Nenhuma das 9 tem noiva, noivo ou aniversariante identificável — o gate de autorização
de imagem não se aplica a elas.

## Como preparar uma nova

```bash
# galeria 4:3
magick origem.jpg -gravity center -crop 4:3 +repage -resize 1200x900^ -extent 1200x900 tmp.png
cwebp -q 80 -m 6 tmp.png -o espaco-jardim.webp

# hero / item largo 16:9
magick origem.jpg -gravity center -crop 16:9 +repage -resize 1280x720^ -extent 1280x720 tmp.png
cwebp -q 80 -m 6 tmp.png -o hero.webp
```

## Regras

- **Foto real, nunca IA.** Mesma regra do site da Koisa Linda.
- Foto com noivo, noiva ou aniversariante só entra **com autorização de imagem** assinada.
- Nada de foto de banco de imagem genérico — o espaço é o produto, tem que ser ele.
- Peso: abaixo de 250 KB por foto, 400 KB no hero.
