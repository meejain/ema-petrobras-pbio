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

  // Placeholder prompt shown in the closed selector (varies per picker:
  // "Selecione por produto...", "Selecione por período", "Selecione o arquivo",
  // "Selecione o normativo"). Source keeps it in the combobox trigger.
  const promptEl = element.querySelector('.downloader-dropbox [data-lfr-editable-id], .downloader-dropbox span, .downloader-dropbox');
  const prompt = promptEl ? promptEl.textContent.trim() : 'Selecione o arquivo';

  const rows = [];
  // First row = the placeholder prompt (single cell, no link) so the block can
  // render the empty-state selector label.
  const promptCell = document.createElement('p');
  promptCell.textContent = prompt || 'Selecione o arquivo';
  rows.push([promptCell]);

  links.forEach((a) => {
    const link = document.createElement('a');
    link.setAttribute('href', a.getAttribute('href'));
    link.textContent = a.textContent.trim();
    rows.push([link]);
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'downloads-accordion',
    cells: rows,
  });
  element.replaceWith(block);
}
