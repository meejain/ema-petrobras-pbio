/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-content-panel. Base: cards.
 * Source: https://pbio.com.br/
 * Structure (from library-description.txt): 2 columns, multiple rows —
 *   row 1: block name; each subsequent row is one card:
 *   cell 1 = image/icon (mandatory), cell 2 = title + description + optional CTA.
 * Each instance on the page is a single content panel (one card row). The icon
 * badge maps to cell 1; heading + rich-text body + optional PDF download link
 * map to cell 2.
 * Generated: 2026-07-18
 */
export default function parse(element, { document }) {
  // Cell 1 — icon/image badge. Source: <div class="section-icon-area"><img>.
  // Inline base64 data-URI icons are decorative and cannot become managed
  // assets; they also break the markdown serialization pipeline, so drop them.
  const iconArea = element.querySelector('.section-icon-area');
  let icon = (iconArea || element).querySelector('img');
  if (icon && (icon.getAttribute('src') || '').startsWith('data:')) {
    icon = null;
  }

  // Cell 2 — heading. Source: <h2 class="content-section-title">.
  const heading = element.querySelector(
    '.content-section-title, .content-section-menu h2, h1, h2, h3',
  );

  // Cell 2 — rich text body. Source: .content-section-content .body-text blocks.
  const contentArea = element.querySelector('.content-section-content');
  const bodyBlocks = contentArea
    ? Array.from(contentArea.querySelectorAll('.body-text'))
    : [];

  // Cell 2 — optional PDF/download link. Source: .petro-link a.link-text.
  const ctaLinks = Array.from(
    element.querySelectorAll('.petro-link a.link-text, .petro-link a[href]'),
  );

  // Build the second cell's contents in reading order.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  bodyBlocks.forEach((el) => contentCell.push(el));
  ctaLinks.forEach((el) => contentCell.push(el));

  // Empty-block guard
  if (!icon && contentCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // One card row: [ icon cell, content cell ]. Pad first cell if icon absent.
  cells.push([icon || '', contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-content-panel',
    cells,
  });
  element.replaceWith(block);
}
