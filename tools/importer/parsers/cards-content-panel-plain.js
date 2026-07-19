/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-content-panel (plain variant). Base: cards (no images).
 * Source: https://pbio.com.br/acesso-a-informacao (Acesso a Informacao hub).
 * Structure: a Liferay grid row (.lfr-layout-structure-item-grade) holding one
 * or two side-by-side panels (.grid-fragment-element). Each panel is a
 * self-contained content unit: an optional heading (h2/h3), rich-text
 * paragraph(s), an optional eyebrow label (span.small "LINKS RELEVANTES"), and
 * one or more CTA links (a.link-text). No icon badge (unlike the base variant).
 *
 * Following the "Cards (no images)" convention: 1 column, one row per card.
 * Each panel becomes its own single-cell row; the block CSS lays the cards out
 * two-up.
 * Generated: 2026-07-19
 */
export default function parse(element, { document }) {
  const panels = Array.from(element.querySelectorAll(':scope .grid-fragment-element'));
  // Fall back to the row itself if the expected grid markup is absent.
  const sources = panels.length ? panels : [element];

  const rows = [];
  sources.forEach((panel) => {
    const cell = [];

    // Heading (h1-h4), if present.
    const heading = panel.querySelector('h1, h2, h3, h4');
    if (heading) {
      const h = document.createElement(heading.tagName.toLowerCase());
      h.textContent = heading.textContent.trim();
      cell.push(h);
    }

    // Body text / eyebrow paragraphs in document order.
    panel.querySelectorAll('.body-text').forEach((bt) => {
      const eyebrow = bt.querySelector('.small');
      if (eyebrow) {
        const span = document.createElement('span');
        span.className = 'small';
        span.textContent = eyebrow.textContent.trim();
        const p = document.createElement('p');
        p.append(span);
        cell.push(p);
      } else if (bt.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = bt.textContent.trim();
        cell.push(p);
      }
    });

    // CTA links.
    panel.querySelectorAll('.petro-link a[href]').forEach((a) => {
      const link = document.createElement('a');
      link.setAttribute('href', a.getAttribute('href'));
      link.textContent = a.textContent.trim();
      const p = document.createElement('p');
      p.append(link);
      cell.push(p);
    });

    // One row per panel (single cell), per the "Cards (no images)" convention.
    if (cell.length) rows.push([cell]);
  });

  if (!rows.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-content-panel (plain)',
    cells: rows,
  });
  element.replaceWith(block);
}
