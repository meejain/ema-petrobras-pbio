/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the `downloads-accordion` block.
 * Source: pbio.com.br institucional pages — a "Selecione o arquivo" document
 * picker (`.lfr-layout-structure-item-combobox-download-de-arquivos` /
 * `.downloader-container`) whose options are real
 * `<a href="/documents/*.pdf?download=true">` links.
 *
 * Content model (per the block's decorate()): each block row = one document,
 * a single cell containing the download link. The first empty placeholder
 * link ("Selecione o arquivo") is skipped.
 * Generated: 2026-07-19
 */
export default function parse(element, { document }) {
  const links = [...element.querySelectorAll('a[href]')]
    .filter((a) => (a.getAttribute('href') || '').trim() && a.textContent.trim());

  if (!links.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const rows = links.map((a) => {
    const link = document.createElement('a');
    link.setAttribute('href', a.getAttribute('href'));
    link.textContent = a.textContent.trim();
    return [link];
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'downloads-accordion',
    cells: rows,
  });
  element.replaceWith(block);
}
