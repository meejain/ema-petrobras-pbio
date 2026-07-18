/* eslint-disable */
/* global WebImporter */
/**
 * Parser for anchornav-sticky. Base: custom (in-page jump navigation).
 * Source: https://pbio.com.br/
 * Structure (inferred from source HTML): a list of anchor links authored as a
 *   single-column block, one row per anchor link. Scroll-arrow buttons are UI
 *   chrome and are intentionally excluded.
 * Generated: 2026-07-18
 */
export default function parse(element, { document }) {
  // Anchor links live inside <nav class="petro-nav-anchor-menu">.
  // Restrict to hash/anchor links so the scroll buttons are not captured.
  const navScope = element.querySelector('nav.petro-nav-anchor-menu, nav, .petro-anchor-menu-container');
  const links = Array.from(
    (navScope || element).querySelectorAll('a[href^="#"], a[href*="#"]'),
  );

  const cells = [];

  // One single-column row per anchor link.
  links.forEach((link) => {
    // Normalize whitespace introduced by source formatting.
    link.textContent = link.textContent.trim();
    cells.push([link]);
  });

  // Empty-block guard
  if (links.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'anchornav-sticky', cells });
  element.replaceWith(block);
}
