/* eslint-disable */
/* global WebImporter */
/**
 * Parser for the `accordion` block (nested + downloads variant).
 * Per the Accordion convention: 2 columns, first row = block name + variants,
 * each subsequent row = [title cell, content cell].
 *
 * Source: pbio.com.br institucional pages — an "Atas" section
 * (`.lfr-layout-structure-item-accordion`) of collapsible groups. Each group is
 * a <details class="accordion"> with <summary><h3 class="accordion-label"> and a
 * body containing intro text plus one or more period-based document pickers
 * (each `.downloader-container` holds real <a href="/documents/*.pdf"> links).
 *
 * Each group → one row: title cell = the group label; content cell = the intro
 * paragraph followed by a single <ul> of all document links gathered from every
 * period picker in the group (period grouping flattened, order preserved).
 * Generated: 2026-07-19
 */
export default function parse(element, { document }) {
  const groups = [...element.querySelectorAll('details.accordion')];
  if (!groups.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const rows = [];
  groups.forEach((group) => {
    const label = (group.querySelector('.accordion-label, summary h3, summary')?.textContent || '').trim();
    if (!label) return;

    const bodyCell = [];

    const summary = group.querySelector('summary');
    const intro = [...group.querySelectorAll('p, .paragraph-md-regular, .content-section-content > div')]
      .map((el) => el.textContent.trim())
      .find((t) => t && !(summary && summary.textContent.includes(t)));
    if (intro) {
      const p = document.createElement('p');
      p.textContent = intro;
      bodyCell.push(p);
    }

    const links = [...group.querySelectorAll('a[href]')]
      .filter((a) => (a.getAttribute('href') || '').trim() && a.textContent.trim());
    if (links.length) {
      const ul = document.createElement('ul');
      links.forEach((a) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.setAttribute('href', a.getAttribute('href'));
        link.textContent = a.textContent.trim();
        li.append(link);
        ul.append(li);
      });
      bodyCell.push(ul);
    }

    const labelEl = document.createElement('div');
    labelEl.textContent = label;
    rows.push([labelEl, bodyCell]);
  });

  if (!rows.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'accordion (nested, downloads)',
    cells: rows,
  });
  element.replaceWith(block);
}
