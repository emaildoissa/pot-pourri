# Roteiro & Playbook de Implementação: Google Analytics 4 (GA4) e Rastreamento de Conversões no Astro

Este guia define o padrão oficial para implementação, configuração e validação de Google Analytics 4 (GA4) e rastreamento de eventos/conversões (ex: cliques de WhatsApp, reservas, chamadas) em projetos desenvolvidos com **Astro**.

---

## 1. Regra de Ouro no Astro: Escopo Global do `gtag`

> [!CAUTION]
> **Armadilha comum no Astro:**
> Ao usar `<script is:inline define:vars={{ gaId }}>`, o compilador do Astro envolve todo o conteúdo do script dentro de uma closure / IIFE: `(function(){ ... })();`.
> Se você declarar `function gtag() { ... }`, a função ficará presa no escopo local dessa IIFE e `window.gtag` será `undefined` em todo o restante da página. Isso quebra silenciosamente qualquer rastreamento de clique ou evento posterior.

### Implementação Canônica no Componente `<SeoHead.astro>` (ou `<Head.astro>`)

```astro
---
import { siteConfig } from "../config/site";

const gaId = siteConfig.gaMeasurementId;
---

{gaId && (
  <>
    <!-- Google tag (gtag.js) -->
    <script is:inline async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}></script>
    <script is:inline define:vars={{ gaId }}>
      window.dataLayer = window.dataLayer || [];
      // Sempre vincular explicitamente a window.gtag para garantir escopo global
      window.gtag = function () {
        window.dataLayer.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", gaId);
    </script>
  </>
)}
```

---

## 2. Centralização de Configurações e Variáveis de Ambiente

### `src/config/site.ts`
Centralize a leitura do ID com fallback para garantir robustez:

```typescript
export const siteConfig = {
  // ...
  gaMeasurementId: import.meta.env.PUBLIC_GA_ID || "G-XXXXXXXXXX",
} as const;
```

### `.env` e `.env.example`
* No Astro, variáveis acessíveis no frontend/HTML precisam ter o prefixo **`PUBLIC_`**:
  ```env
  PUBLIC_GA_ID=G-XXXXXXXXXX
  ```
* Inclua `.env` no [`.gitignore`](file:///c:/Users/Marcos%20Issa/Documents/potpourripizzaria/.gitignore) e mantenha um `.env.example` com o formato esperado.

---

## 3. Rastreamento Automático de Cliques e Conversões (WhatsApp / CTA)

No componente base de layout ([`BaseLayout.astro`](file:///c:/Users/Marcos%20Issa/Documents/potpourripizzaria/src/layouts/BaseLayout.astro)), adicione o listener global utilizando delegação de eventos para capturar qualquer clique em links de conversão:

```astro
<!-- Event Tracking: WhatsApp / Leads -->
<script is:inline>
  document.addEventListener("click", function (e) {
    // Detecta cliques em links do WhatsApp
    var link = e.target.closest('a[href^="https://wa.me/"], a[href^="https://api.whatsapp.com/"]');
    if (!link) return;

    var href = link.getAttribute("href") || "";
    var match = href.match(/[?&]text=([^&]*)/);
    var text = match ? decodeURIComponent(match[1]) : "";
    var from = location.pathname === "/" ? "home" : location.pathname;

    if (typeof window.gtag === "function") {
      window.gtag("event", "clicou_whatsapp", {
        origem: from,
        mensagem: text,
        cta: (link.getAttribute("aria-label") || link.textContent || "").trim().slice(0, 80),
      });
    }
  });
</script>
```

---

## 4. Roteiro Passo a Passo para a IA ao Adaptar em Outro Site

Quando a IA for clonar ou criar um novo projeto para outro cliente/site, ela deve seguir esta ordem:

1. **Obter o ID de Métrica do Cliente**:
   * Formato: `G-XXXXXXXXXX` (obtido em *GA4 > Administrador > Fluxos de Dados > Web*).
2. **Atualizar Arquivos de Configuração**:
   * Atualizar `PUBLIC_GA_ID` no `.env`.
   * Atualizar fallback em `src/config/site.ts`.
3. **Verificar os Componentes de Cabeçalho e Layout**:
   * Garantir que `window.gtag = function() { ... }` está em `SeoHead.astro`.
   * Garantir que `if (typeof window.gtag === "function")` é chamado nos eventos do `BaseLayout.astro`.
4. **Configurar a Plataforma de Deploy (Vercel / Netlify / Cloudflare)**:
   * Adicionar a variável de ambiente `PUBLIC_GA_ID` nas configurações do projeto na hospedagem.
   * Disparar novo deploy (`git push` ou *Redeploy*).

---

## 5. Guia de Diagnóstico e Validação (Troubleshooting)

| Sintoma | Causa Mais Provável | Solução |
| :--- | :--- | :--- |
| **0 dados recebidos no GA4** | Bloqueador de Anúncios ativo no navegador (AdBlock, uBlock, Brave Shields) | Pausar extensões ou testar em aba anônima limpa. |
| **0 dados nos relatórios gerais** | Delay de processamento do GA4 (leva 24h a 48h) | Testar na aba **Relatórios > Tempo Real (Realtime)**. |
| **`page_view` funciona, mas `clicou_whatsapp` não aparece** | `gtag` isolado no escopo local da IIFE do Astro | Trocar `function gtag()` por `window.gtag = function()`. |
| **Requisição `collect` não aparece no F12** | Script bloqueado ou `gaId` nulo / vazio | Conferir `PUBLIC_GA_ID` no `.env` e inspecionar `<head>` no HTML gerado. |

### Como Validar pelo Inspecionar do Navegador (F12)
1. **Console**:
   * Executar `window.dataLayer`: deve retornar array com os dados iniciais.
   * Executar `typeof window.gtag`: deve retornar `"function"`.
2. **Aba Network (Rede)**:
   * Filtrar por `collect`.
   * Ao carregar a página: deve haver um `POST 204` com `en=page_view` e `tid=G-XXXXX`.
   * Ao clicar no botão do WhatsApp: deve disparar um `POST 204` com `en=clicou_whatsapp`.
