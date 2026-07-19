/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the `embed` block. Per the Embed convention: 1 column, first row =
 * block name, following row = a single cell containing the URL to embed.
 * Converts an external <iframe> (e.g. the Agenda de Autoridades third-party
 * transparency calendar on sistematransparencia.petrobras.com.br) into an
 * `embed` block holding the iframe URL as a link; the block's decorate()
 * rebuilds a responsive iframe.
 * Generated: 2026-07-19
 */
export default function parse(element, { document }) {
  const iframe = element.querySelector('iframe') || (element.tagName === 'IFRAME' ? element : null);
  const src = iframe ? iframe.getAttribute('src') : null;
  if (!src) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const link = document.createElement('a');
  link.setAttribute('href', src);
  link.textContent = src;

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'embed',
    cells: [[link]],
  });
  element.replaceWith(block);
}
