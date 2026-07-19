# PBIO Import Script Manifest

Traceability index of which import script migrated which page(s). Every import
script here is preserved after it successfully migrates its page(s) so the
mapping stays auditable. Do **not** delete a script once its pages are live.

Each import script is designed to be **reused for its whole page group** — add
new URLs to the script's `urls[]` array (and to `urls-<name>.txt`), then
re-bundle and re-run.

## How to run an import

```bash
D="/home/node/.excat-marketplaces/excat-marketplace/excat/skills/excat-content-import/scripts"
# 1. bundle
"$D/aem-import-bundle.sh" --importjs tools/importer/<script>.js
# 2. run (urls file, one URL per line)
node "$D/run-bulk-import.js" \
  --import-script tools/importer/<script>.bundle.js \
  --urls tools/importer/<urls-file>.txt
```

## Scripts → pages

| Import script | Template | URLs file | Pages migrated | Status |
|---|---|---|---|---|
| `import-institucional-page.js` | institucional-page | `urls-institucional-page.txt` | `/` (homepage) | ✅ done |
| `import-acesso-informacao-hub.js` | acesso-informacao-hub | `urls-acesso-informacao-hub.txt` | `/acesso-a-informacao` | ✅ done (1st of 59-page group) |

## Group: Acesso Informação Hub (59 pages)

`import-acesso-informacao-hub.js` is the reusable script for the entire
"Acesso Informação Hub" template group. Pages still to migrate through it (add
each to `urls-acesso-informacao-hub.txt` as it is validated):

- [x] https://pbio.com.br/acesso-a-informacao
- [ ] https://pbio.com.br/acesso-a-informacao/institucional
- [ ] https://pbio.com.br/acesso-a-informacao/institucional/sobre
- [ ] https://pbio.com.br/acesso-a-informacao/institucional/agenda-de-autoridades
- [ ] https://pbio.com.br/acesso-a-informacao/institucional/atas
- [ ] https://pbio.com.br/acesso-a-informacao/institucional/atos-normativos
- [ ] https://pbio.com.br/acesso-a-informacao/institucional/horario-de-atendimento
- [ ] https://pbio.com.br/acesso-a-informacao/institucional/hospitalidades
- [ ] https://pbio.com.br/acesso-a-informacao/institucional/presentes
- [ ] https://pbio.com.br/acesso-a-informacao/acoes-e-programas
- [ ] https://pbio.com.br/acesso-a-informacao/acoes-e-programas/carta-de-servicos
- [ ] https://pbio.com.br/acesso-a-informacao/acoes-e-programas/governanca
- [ ] https://pbio.com.br/acesso-a-informacao/acoes-e-programas/programas-finalisticos
- [ ] https://pbio.com.br/acesso-a-informacao/acoes-e-programas/recursos-financeiros-renuncia-de-receitas
- [ ] https://pbio.com.br/acesso-a-informacao/auditorias
- [ ] https://pbio.com.br/acesso-a-informacao/auditorias/acoes-de-supervisao-controle-e-correicao
- [ ] https://pbio.com.br/acesso-a-informacao/auditorias/demonstracoes-financeiras
- [ ] https://pbio.com.br/acesso-a-informacao/auditorias/prestacao-de-contas
- [ ] https://pbio.com.br/acesso-a-informacao/auditorias/relatorios-da-cgu
- [ ] https://pbio.com.br/acesso-a-informacao/convenios-e-transferencias
- [ ] https://pbio.com.br/acesso-a-informacao/dados-abertos
- [ ] https://pbio.com.br/acesso-a-informacao/empregados-publicos
- [ ] https://pbio.com.br/acesso-a-informacao/informacoes-classificadas
- [ ] https://pbio.com.br/acesso-a-informacao/licitacoes-e-contratos
- [ ] https://pbio.com.br/acesso-a-informacao/licitacoes-e-contratos/aditivos
- [ ] https://pbio.com.br/acesso-a-informacao/licitacoes-e-contratos/contratos
- [ ] https://pbio.com.br/acesso-a-informacao/licitacoes-e-contratos/contratos-de-transferencia-de-tecnologia
- [ ] https://pbio.com.br/acesso-a-informacao/licitacoes-e-contratos/licitacoes
- [ ] https://pbio.com.br/acesso-a-informacao/licitacoes-e-contratos/patrocinios
- [ ] https://pbio.com.br/acesso-a-informacao/participacao-social
- [ ] https://pbio.com.br/acesso-a-informacao/participacao-social/audiencias-publicas
- [ ] https://pbio.com.br/acesso-a-informacao/participacao-social/conferencias
- [ ] https://pbio.com.br/acesso-a-informacao/participacao-social/conselhos-e-orgaos-colegiados
- [ ] https://pbio.com.br/acesso-a-informacao/participacao-social/editais-de-chamamento-publico
- [ ] https://pbio.com.br/acesso-a-informacao/participacao-social/outras-acoes
- [ ] https://pbio.com.br/acesso-a-informacao/participacao-social/ouvidoria
- [ ] https://pbio.com.br/acesso-a-informacao/perguntas-frequentes
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/alienacao-de-bens-imoveis
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/aquisicao-de-bens
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/diarias-e-passagens
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/orcamento-de-investimento
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/politica-de-dividendos
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/politica-de-transacoes-com-partes-relacionadas
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/publicidade
- [ ] https://pbio.com.br/acesso-a-informacao/receitas-e-despesas/receitas
- [ ] https://pbio.com.br/acesso-a-informacao/sancoes-administrativas
- [ ] https://pbio.com.br/acesso-a-informacao/servico-de-informacao-ao-cidadao-sic
- [ ] https://pbio.com.br/acesso-a-informacao/servico-de-informacao-ao-cidadao-sic/balcoes-de-atendimento
- [ ] https://pbio.com.br/acesso-a-informacao/servico-de-informacao-ao-cidadao-sic/estatisticas-do-sic
- [ ] https://pbio.com.br/acesso-a-informacao/transparencia-e-prestacao-de-contas
- [ ] https://pbio.com.br/cartas-de-governanca-e-politicas-publicas
- [ ] https://pbio.com.br/demonstrativos-de-quadro-de-pessoal-e-acordos-coletivos
- [ ] https://pbio.com.br/institucional
- [ ] https://pbio.com.br/institucional/auditoria
- [ ] https://pbio.com.br/institucional/licitacoes-contratos-e-aquisicao-de-bens
- [ ] https://pbio.com.br/institucional/orgaos-estatutarios
- [ ] https://pbio.com.br/institucional/relatorios-anuais-e-informacoes-financeiras
- [ ] https://pbio.com.br/outras-informacoes

> Note: pages in this list may turn out to use different block mixes (tables,
> downloads, accordion-nested, or the Agenda de Autoridades iframe). Verify each
> against its source during migration; if a page's structure diverges enough it
> may warrant its own import script (add a new row to the table above).
