# Pending assets — document links NOT yet self-hosted

_Generated 2026-07-19T19:26Z. These `/documents/` links were not rewritten to `/assets/` because they use forms the asset-links transformer does not yet handle (extension-less `/documents/d/pbio/` short-form, or non-PDF types like .docx/.zip). They still point at pbio.com.br and work. Handle in a later pass._

## UPDATE 2026-07-22 — link audit run

- **262 previously-previewed PDFs were PUBLISHED to live** and verified `200 application/pdf`.
  This resolved the bulk of the broken downloads. See `reference/BROKEN-LINKS-REPORT.md`.
- The 11 "409" PDFs in section A below turned out to be **oversized (>20 MB)** — their DA
  source entry is 0 bytes because the original upload silently failed at the size limit.
  They cannot be self-hosted. Left as-is (broken on live). This supersedes the "retry
  preview+publish" guidance below.
- **8 new small PDFs** from the `/documents/d/pbio/` short form (section B) were downloaded,
  staged into `content/assets/documents/d/pbio/`, and their page links rewritten to
  `/assets/...pdf`. They still need DA upload+preview+publish (DA upload was 401 this run).
  Files: codigo-de-conduta-etica-v-digital, estrutura-organizacional-pdf,
  plano-basico-de-organizacao-rev, mapa-estrategico-2025, relatorio-de-sustentabilidade-2023,
  remuneracao-administradores-e-conselheiros-fiscais-1, estagiarios, concurso-edital-cesgranrio.

## A. 11 PDFs uploaded to DA but preview stuck on 409 (retry preview + publish)

DA org/repo: meejain/ema-petrobras-pbio (main). Preview: https://admin.hlx.page/preview/meejain/ema-petrobras-pbio/main{path}

- /assets/documents/29533774/0/20250408-pbio-dfs-execicio-2024.pdf
- /assets/documents/29533774/29533877/estatuto-social-pbio-19-11-2025.pdf
- /assets/documents/29533774/29534534/20230427-ageo-posse-do-conselho-fiscal.pdf
- /assets/documents/29533774/29534534/20231129-pbio-age-alteracao-do-estatuto-social.pdf
- /assets/documents/29533774/29534837/20201001-age-relatorio-de-sustentabilidade-e-carta-anual-de-politicas-publicas.pdf
- /assets/documents/29533774/29535777/relatorio-de-sustentabilidade-2019.pdf
- /assets/documents/29533774/29535777/relatorio-de-sustentabilidade-2021.pdf
- /assets/documents/29533774/29535836/20250408-pbio-dfs-exercicio-2024.pdf
- /assets/documents/29533774/29535836/20260408-pbio-dfs-exercicio-2025.pdf
- /assets/documents/29533774/29800070/carta-anual-de-politicas-publicas-e-governanca-coorporativa-2026.pdf
- /assets/documents/29533774/44210925/20250110-age-i-alteracao-estatuto-social.pdf

## B. Extension-less /documents/d/pbio/ links (likely PDFs, not mirrored)

- /documents/d/pbio/2010_pbio_concurso-edital_cesgranrio?download=true
- /documents/d/pbio/20180905-carta-anual-exercicio-2017?download=true
- /documents/d/pbio/20190624-carta-anual-exercicio-2018?download=true
- /documents/d/pbio/20201009-carta-anual-exercicio-2019?download=true
- /documents/d/pbio/20211213-carta-anual-exercicio-2020?download=true
- /documents/d/pbio/20220926-carta-anual-exercicio-2021?download=true
- /documents/d/pbio/20230831-carta-anual-exercicio-2022?download=true
- /documents/d/pbio/20240829-carta-anual-exercicio-2023?download=true
- /documents/d/pbio/20240829_pbio_remuneracao-administradores-e-conselheiros-fiscais-1?download=true
- /documents/d/pbio/20240924_pbio_relatorio-de-sustentabilidade-2023?download=true
- /documents/d/pbio/20241029_pbio_estagiarios?download=true
- /documents/d/pbio/20241226_pbio_codigo-de-conduta-etica_v-digital?download=true
- /documents/d/pbio/20241226_pbio_mapa-estrategico-2025?download=true
- /documents/d/pbio/20241226_pbio_plano-basico-de-organizacao_rev?download=true
- /documents/d/pbio/20250401_pbio_estrutura-organizacional-pdf?download=true
- /documents/d/pbio/20250529-carta-anual-exercicio-2024?download=true
- /documents/d/pbio/20260318-ata-rca-04?download=true
- /documents/d/pbio/20260410-ata-rca-05?download=true
- /documents/d/pbio/20260507-ata-age-06-metas-empresariais?download=true
- /documents/d/pbio/20260513-ata-age-07-carta-anual-2026?download=true
- /documents/d/pbio/20260513-ata-age-08-metas-resultados-2026?download=true
- /documents/d/pbio/20260519-carta-anual-exercicio-2025?download=true
- /documents/d/pbio/20260528-ata-age-09-premio-performance-2026?download=true
- /documents/d/pbio/20260528-ata-age-10-reconducao-diretoria?download=true
- /documents/d/pbio/20260601-ata-age-11-aprovacao-pdg-2026?download=true
- /documents/d/pbio/lista-leiloes-1?download=true

## C. Non-PDF documents (.docx / .doc / .xlsx / .zip) — not mirrored

- /documents/29533774/29535649/Exerc%C3%ADcio+2022.docx/d588e341-ca19-0b98-cad6-c095237de54d?version=1.0&amp;t=1728958589000&amp;download=true
- /documents/29533774/29535836/20210401+-+DFs+-+Exerc%C3%ADcio+2020.docx/d82afce2-e783-e135-8196-7d79b5f72fa9?version=1.0&amp;t=1728958667000&amp;download=true
- /documents/29533774/29535836/20220405+-+DFs+-+Exerc%C3%ADcio+2021.docx/6d4e407b-f323-ba26-92d1-eab45791e304?version=1.0&amp;t=1728958666000&amp;download=true
- /documents/29533774/29535836/20230410+-+DFs+-+Exerc%C3%ADcio+2022.docx/f0c60943-b4c1-0c83-d3ff-da65a34f2dce?version=1.0&amp;t=1728958665000&amp;download=true
- /documents/29533774/29535836/20240415_PBio_DFs-Exercicio+2023_Valor-Economico.docx/20b4da51-c5d8-6d46-22de-e1bd29cba598?version=1.0&amp;t=1728958664000&amp;download=true
- /documents/29533774/29535880/Exerc%C3%ADcio+2022.docx/741c5683-5828-cfe5-3f27-373d1d627aa9?version=1.0&amp;t=1728958696000&amp;download=true
- https://transparencia.petrobras.com.br/documents/1357439/1360711/formularios_de_solicitacao_de_informacao.zip/e43cf4dd-1690-81e4-532c-98d9d1e37b45?t=1669927276241&amp;download=true

## Pages containing these raw links

- `acesso-a-informacao/empregados-publicos.plain.html` — 4 raw link(s)
- `acesso-a-informacao/institucional.plain.html` — 3 raw link(s)
- `acesso-a-informacao/institucional/sobre.plain.html` — 1 raw link(s)
- `acesso-a-informacao/receitas-e-despesas/alienacao-de-bens-imoveis.plain.html` — 1 raw link(s)
- `institucional/relatorios-anuais-e-informacoes-financeiras.plain.html` — 6 raw link(s)
