/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://pbio.com.br/
 * Structure (from library-description.txt): 1 column, 3 rows —
 *   row 1: block name; row 2: background image; row 3: title / subheading / CTA.
 * Generated: 2026-07-18
 */
export default function parse(element, { document }) {
  // Row 2 — Background image. Source: <img class="banner-hero-color-image">
  const bgImage = element.querySelector(
    'img.banner-hero-color-image, picture img, img[class*="hero"]',
  );

  // Row 3 — Title. Source: <h2 class="h2" id="title"> inside .banner-title .petro-title.
  // Scope to the title area so the breadcrumb text/links are not pulled in.
  const titleScope = element.querySelector('.banner-title, .petro-title');
  const heading = (titleScope || element).querySelector(
    'h1, h2, h3, [class*="title"] h1, [class*="title"] h2',
  );

  // Breadcrumb. Source: <ol class="breadcrumb"> with a link + active page span.
  // Rebuild as a single paragraph ("Root > Current") so it survives import as
  // authorable default content above the title.
  const breadcrumbEl = element.querySelector('.banner-breadcrumb-session .breadcrumb, ol.breadcrumb');
  let breadcrumbPara = null;
  if (breadcrumbEl) {
    const parts = [];
    breadcrumbEl.querySelectorAll(':scope > li').forEach((li) => {
      const link = li.querySelector('a[href]');
      const label = li.textContent.replace(/\s+/g, ' ').trim();
      if (!label) return;
      if (link) {
        const a = document.createElement('a');
        a.setAttribute('href', link.getAttribute('href'));
        a.textContent = label;
        parts.push(a);
      } else {
        parts.push(document.createTextNode(label));
      }
    });
    if (parts.length) {
      breadcrumbPara = document.createElement('p');
      breadcrumbPara.className = 'hero-banner-breadcrumb';
      parts.forEach((node, i) => {
        if (i > 0) breadcrumbPara.append(document.createTextNode(' › '));
        breadcrumbPara.append(node);
      });
    }
  }

  const cells = [];

  // Background image row (optional)
  if (bgImage) cells.push([bgImage]);

  // Content row (breadcrumb + title + any subheading/CTA within the title scope)
  const contentCell = [];
  if (breadcrumbPara) contentCell.push(breadcrumbPara);
  if (heading) contentCell.push(heading);
  if (titleScope) {
    // Subheading paragraphs and CTA links, if present alongside the title.
    titleScope.querySelectorAll('p, a').forEach((el) => {
      if (!contentCell.includes(el)) contentCell.push(el);
    });
  }
  cells.push([contentCell]);

  // Empty-block guard
  if (!bgImage && !heading) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
