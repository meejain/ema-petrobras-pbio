# Content Parity Audit — Fixes Applied (2026-07-21)

Page-by-page audit of migrated content vs the live source (pbio.com.br), using a
headless browser to capture the *visibly rendered* main content of each source
page (the source hides some leaked layout fragments via runtime `display:none`,
which our static import could not see — those leaked in as extra content).

## Pages edited — EXTRA content removed (need DA upload + preview + publish)

| Page | Removed |
|------|---------|
| acesso-a-informacao/acoes-e-programas/governanca | "Conheça o Programa Petrobras Cultural" link, "Programa Petrobras Socioambiental" heading+paragraph+link (all hidden in source) |
| acesso-a-informacao/acoes-e-programas | 3 "Saiba Mais" placeholder cards: Programas Finalísticos, Seleções Públicas, Programa de P&D do Setor de Energia Elétrica (+ their icons) |
| acesso-a-informacao/acoes-e-programas/carta-de-servicos | Cultural link + Socioambiental section |
| acesso-a-informacao/acoes-e-programas/recursos-financeiros-renuncia-de-receitas | Cultural link + Socioambiental section |
| acesso-a-informacao/participacao-social | 3 placeholder cards: Ouvidoria, Audiências Públicas, Outras Ações (+ icons) |
| acesso-a-informacao/perguntas-frequentes | "Pergunta 1 / Resposta 1 / Pergunta 2 / Resposta 2" placeholder Q&A + "LINK PARA FAQ PETROBRAS" placeholder link |

## Known limitations — NOT content bugs (no change)

- Transparency-widget pages render a dynamic Portal Transparência iframe that is
  blocked by CSP off the pbio.com.br origin; we substitute an "open in new tab"
  embed link. Affected: convenios-e-transferencias, institucional/agenda-de-autoridades
  (incl. the 3 director photos, which are part of that widget), licitacoes-e-contratos/aditivos,
  licitacoes-e-contratos/contratos, licitacoes-e-contratos/licitacoes,
  receitas-e-despesas/aquisicao-de-bens.
- Document-listing pages (institucional/orgaos-estatutarios, institucional/auditoria,
  institucional/relatorios-anuais-e-informacoes-financeiras, cartas-de-governanca-e-politicas-publicas,
  demonstrativos-de-quadro-de-pessoal-e-acordos-coletivos, outras-informacoes,
  institucional/licitacoes-contratos-e-aquisicao-de-bens): source renders these inside
  collapsed accordions, so a static "visible text" scrape under-reports them — our
  migrated downloads-accordion blocks carry the full document lists. Verified as correct.
- "Arquivo de Hospitalidades" / "Arquivo de Presentes" links on institucional/hospitalidades
  and institucional/presentes have empty href in source (placeholders) — correctly dropped.

## Styling fix (global, code — needs git push)

- Hub page **main content title (H2)** must be teal `rgb(30,109,128)` (source
  `--color-primary-dark` maps to our `--link-color`), 32px/700. Section sub-headings
  stay grey `rgb(55,55,55)`. Applied in templates/acesso-informacao-hub CSS.
