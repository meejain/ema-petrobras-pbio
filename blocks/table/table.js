/**
 * Table block — financial / data tables.
 * Content model: each block row = one table row; each cell = one table cell.
 * The first row becomes the table caption/title band (spanning all columns).
 * Rows whose first cell text starts with "Subtotal" or "Total" are marked as
 * summary rows; rows acting as column headers (containing "Ação"/"Descrição")
 * get header styling.
 * @param {Element} block
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  const rows = [...block.children];
  const colCount = rows.reduce((max, r) => Math.max(max, r.children.length), 0);

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');
    const firstText = (cells[0]?.textContent || '').trim();

    if (index === 0) {
      tr.className = 'table-title';
    } else if (/^(subtotal|total)/i.test(firstText)) {
      tr.className = 'table-summary';
    } else if (/^(ação|acao|descrição|descricao)$/i.test(firstText)) {
      tr.className = 'table-colheader';
    }

    // Title row spans all columns as a single header cell
    if (index === 0) {
      const th = document.createElement('th');
      th.setAttribute('scope', 'colgroup');
      th.colSpan = colCount || cells.length;
      while (cells[0] && cells[0].firstChild) th.append(cells[0].firstChild);
      tr.append(th);
    } else {
      cells.forEach((cell) => {
        const td = document.createElement('td');
        while (cell.firstChild) td.append(cell.firstChild);
        tr.append(td);
      });
    }
    tbody.append(tr);
  });

  table.append(tbody);
  block.replaceChildren(table);
}
