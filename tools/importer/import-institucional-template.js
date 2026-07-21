/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import anchornavStickyParser from './parsers/anchornav-sticky.js';
import tableParser from './parsers/table-data.js';
import embedParser from './parsers/embed.js';
import downloadsAccordionParser from './parsers/downloads-accordion.js';
import accordionNestedParser from './parsers/accordion-nested.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/pbio-cleanup.js';
import assetLinksTransformer from './transformers/pbio-asset-links.js';
import internalLinksTransformer from './transformers/pbio-internal-links.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'anchornav-sticky': anchornavStickyParser,
  table: tableParser,
  embed: embedParser,
  'downloads-accordion': downloadsAccordionParser,
  'accordion-nested': accordionNestedParser,
};

const PAGE_TEMPLATE = {
  name: 'default-template',
  description: 'Petrobras Biocombustivel "Portal Institucional" pages (/institucional/*, /cartas-*, /demonstrativos-*, /outras-informacoes): hero + sticky in-page anchor nav + single-column content sections (rich text, "Selecione o arquivo" document pickers -> downloads-accordion, nested "Atas" accordions, and CSV/XLSX tables). NO left sidebar.',
};

const transformers = [cleanupTransformer, assetLinksTransformer, internalLinksTransformer];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Structurally discover content on a default-template page. Walks direct
 * children of #main-content in document order and classifies each into a block
 * type. Everything not matched is left as default (rich-text) content.
 */
function discoverStructure(document) {
  const main = document.querySelector('#main-content') || document.body;
  const pageBlocks = [];
  const sections = [];

  // Hero. The banner-hero image lives in its own layout container, but the
  // in-page anchor menu (.banner-menu-anchor-session) may sit in a SIBLING
  // container that shares the top wrapper. We take just the container holding
  // the hero image so the anchor menu can be discovered separately below.
  const heroImg = main.querySelector('.banner-hero-color');
  const hero = heroImg
    ? (heroImg.closest('.lfr-layout-structure-item-container') || heroImg.closest('#main-content > div') || heroImg)
    : null;
  if (hero) {
    pageBlocks.push({ name: 'hero-banner', element: hero });
    sections.push({ id: 'hero', element: hero });
  }

  const counts = {
    anchor: 0, downloads: 0, accordion: 0, table: 0, embed: 0,
  };

  // In-page anchor navigation. It is nested (.banner-menu-anchor-session /
  // .petro-nav-anchor-menu), often INSIDE the same top wrapper as the hero, so
  // we target the anchor element itself. The parser converts it in place; then
  // (in transform) we move the resulting block out to sit right after the hero
  // as its own section.
  const anchorNav = main.querySelector('.banner-menu-anchor-session, .petro-anchor-menu-container, .petro-nav-anchor-menu');
  if (anchorNav) {
    counts.anchor += 1;
    pageBlocks.push({ name: 'anchornav-sticky', element: anchorNav, relocateAfterHero: true });
  }

  const items = [...main.children].filter(
    (el) => el !== hero && !el.contains(hero),
  );

  items.forEach((item, i) => {
    // Skip non-content layout items: invisible anchor markers
    // (.lfr-layout-structure-item-ancora-com-link) and any item that has no
    // meaningful text and no block-worthy content — these would otherwise
    // become empty sections with stray dividers.
    if (item.matches('.lfr-layout-structure-item-ancora-com-link')) return;
    const hasBlockContent = item.querySelector('iframe[src], details.accordion, table, .lfr-layout-structure-item-combobox-download-de-arquivos, a[href], img');
    if (!item.textContent.trim() && !hasBlockContent) return;

    // External iframe embed.
    if (item.querySelector('iframe[src]')) {
      counts.embed += 1;
      pageBlocks.push({ name: 'embed', element: item });
      sections.push({ id: `embed-${i}`, element: item });
      return;
    }
    // Nested "Atas" accordion (collapsible groups of document pickers).
    if (item.querySelector('details.accordion')) {
      counts.accordion += 1;
      pageBlocks.push({ name: 'accordion-nested', element: item });
      sections.push({ id: `accordion-${i}`, element: item });
      return;
    }
    // CSV/XLSX table section.
    if (item.matches('.lfr-layout-structure-item-tabela--csv-e-xlsx-') || item.querySelector('.petro-spreedsheet table')) {
      const tables = [...item.querySelectorAll('table')];
      tables.forEach((t) => {
        counts.table += 1;
        pageBlocks.push({ name: 'table', element: t.closest('article') || t });
      });
      if (tables.length) sections.push({ id: `table-${i}`, element: item });
      return;
    }
    // A content section may hold MULTIPLE document pickers (each a combobox
    // layout item), interleaved with headings/text. Convert every combobox in
    // place so all become downloads-accordion blocks; the section keeps its
    // headings/paragraphs as default content around them.
    const combos = [...item.querySelectorAll('.lfr-layout-structure-item-combobox-download-de-arquivos')];
    if (combos.length) {
      combos.forEach((combo) => {
        counts.downloads += 1;
        pageBlocks.push({ name: 'downloads-accordion', element: combo });
      });
      sections.push({ id: `content-${i}`, element: item });
      return;
    }
    // Otherwise: default content section (rich text) — mark as a section so it
    // gets its own break, but no block parser.
    sections.push({ id: `content-${i}`, element: item });
  });

  console.log(`Discovered ${pageBlocks.length} blocks: hero + ${counts.anchor} anchor + ${counts.downloads} downloads + ${counts.accordion} accordion + ${counts.table} tables + ${counts.embed} embeds`);
  return { pageBlocks, sections };
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover structure
    const { pageBlocks, sections } = discoverStructure(document);

    const heroSection = sections.find((s) => s.id === 'hero');
    const heroEl = heroSection && heroSection.element;

    // 3. Move the anchor-nav element OUT of the hero wrapper to sit as a sibling
    //    right after the hero container (before any parsing). This makes it a
    //    normal top-level section so it survives the hero parser and gets its
    //    own section break.
    const anchorBlockDef = pageBlocks.find((b) => b.relocateAfterHero);
    if (anchorBlockDef && anchorBlockDef.element && heroEl && heroEl.parentNode) {
      heroEl.after(anchorBlockDef.element);
    }

    // 4. Section breaks — break after hero and before each subsequent section,
    //    skipping any already adjacent to a break. Include the relocated anchor.
    const breakTargets = [];
    if (anchorBlockDef && anchorBlockDef.element) breakTargets.push(anchorBlockDef.element);
    sections.filter((s) => s.id !== 'hero').forEach((s) => breakTargets.push(s.element));
    if (heroEl && heroEl.parentNode) {
      const hr = document.createElement('hr');
      heroEl.after(hr);
    }
    breakTargets.forEach((el) => {
      if (!el || !el.parentNode) return;
      const prev = el.previousElementSibling;
      if (prev && prev.tagName === 'HR') return;
      const hr = document.createElement('hr');
      el.before(hr);
    });

    // 5. Parse all discovered blocks (including the relocated anchor).
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name}:`, e);
        }
      }
    });

    // 5. afterTransform (cleanup)
    executeTransformers('afterTransform', main, payload);

    // 6. WebImporter built-in rules + template metadata tag
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    const tables = main.querySelectorAll('table');
    const metaTable = tables[tables.length - 1];
    if (metaTable) {
      const body = metaTable.querySelector('tbody') || metaTable;
      const row = document.createElement('tr');
      const keyCell = document.createElement('td');
      keyCell.textContent = 'template';
      const valCell = document.createElement('td');
      valCell.textContent = PAGE_TEMPLATE.name;
      row.append(keyCell, valCell);
      body.append(row);
    }
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index';
    const path = WebImporter.FileUtils.sanitizePath(rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
