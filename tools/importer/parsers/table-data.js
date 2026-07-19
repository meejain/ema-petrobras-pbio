/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the `table` block (Table Data).
 * Source: pbio.com.br transparency pages (e.g. receitas-e-despesas/*), where
 * financial data lives in a semantic <table> inside
 * `.lfr-layout-structure-item-tabela--csv-e-xlsx- .petro-spreedsheet article`.
 *
 * Per the Table convention: first block row = block name (added by
 * createBlock), each subsequent row = one data row, cells across columns hold
 * the data points. The block's decorate() treats its own first content row as
 * the caption/title band, so we emit the source thead caption as the first
 * data row, followed by every tbody <tr>. Fully-empty spacer rows (used by the
 * source only for visual spacing) are dropped.
 * Generated: 2026-07-19
 */
export default function parse(element, { document }) {
  const table = element.querySelector('table');
  if (!table) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const rows = [];

  // Caption band — the thead's first non-empty header cell.
  const caption = table.querySelector('thead th, thead td');
  const titleText = caption ? caption.textContent.trim() : '';
  if (titleText) rows.push([titleText]);

  // Data rows from tbody (fall back to all <tr> if no tbody).
  const bodyRows = table.querySelectorAll('tbody tr');
  const trList = bodyRows.length ? bodyRows : table.querySelectorAll('tr');
  trList.forEach((tr) => {
    const cells = [...tr.children].map((td) => td.textContent.trim());
    if (cells.every((c) => c === '')) return; // skip empty spacer rows
    rows.push(cells);
  });

  if (!rows.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'table',
    cells: rows,
  });
  element.replaceWith(block);
}
