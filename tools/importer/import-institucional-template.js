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
  name: 'institucional-anchor',
  description: 'Petrobras Biocombustivel "Portal Institucional" pages (/institucional/*, /cartas-*, /demonstrativos-*, /outras-informacoes): hero + sticky in-page anchor nav + single-column content sections (rich text, "Selecione o arquivo" document pickers -> downloads-accordion, nested "Atas" accordions, and CSV/XLSX tables). NO left sidebar.',
};

const transformers = [cleanupTransformer];

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
 * Structurally discover content on an institucional-anchor page. Walks direct
 * children of #main-content in document order and classifies each into a block
 * type. Everything not matched is left as default (rich-text) content.
 */
function discoverStructure(document) {
  const main = document.querySelector('#main-content') || document.body;
  const pageBlocks = [];
  const sections = [];

  // Hero.
  const heroImg = main.querySelector('.banner-hero-color');
  const hero = heroImg
    ? (heroImg.closest('.lfr-layout-structure-item-container') || heroImg.closest('#main-content > div') || heroImg)
    : null;
  if (hero) {
    pageBlocks.push({ name: 'hero-banner', element: hero });
    sections.push({ id: 'hero', element: hero });
  }

  const items = [...main.children].filter((el) => el !== hero && !el.contains(hero));
  const counts = {
    anchor: 0, downloads: 0, accordion: 0, table: 0, embed: 0,
  };

  items.forEach((item, i) => {
    // In-page anchor navigation.
    if (item.querySelector('nav.petro-nav-anchor-menu, nav a[href^="#"]') && !item.querySelector('.banner-hero-color')) {
      counts.anchor += 1;
      pageBlocks.push({ name: 'anchornav-sticky', element: item });
      sections.push({ id: `anchor-${i}`, element: item });
      return;
    }
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
    // Content section containing a document picker -> downloads-accordion.
    // The picker may sit inside a titled content section; keep the section
    // heading as default content and convert just the picker.
    const combo = item.querySelector('.lfr-layout-structure-item-combobox-download-de-arquivos, .downloader-container');
    if (combo) {
      counts.downloads += 1;
      pageBlocks.push({ name: 'downloads-accordion', element: combo });
      sections.push({ id: `downloads-${i}`, element: item });
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

    // 3. Section breaks — break after hero and before each subsequent section,
    //    skipping any already adjacent to a break.
    const heroSection = sections.find((s) => s.id === 'hero');
    if (heroSection && heroSection.element && heroSection.element.parentNode) {
      const hr = document.createElement('hr');
      heroSection.element.after(hr);
    }
    sections.filter((s) => s.id !== 'hero').forEach((section) => {
      const el = section.element;
      if (!el || !el.parentNode) return;
      const prev = el.previousElementSibling;
      if (prev && prev.tagName === 'HR') return;
      const hr = document.createElement('hr');
      el.before(hr);
    });

    // 4. Parse blocks
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
