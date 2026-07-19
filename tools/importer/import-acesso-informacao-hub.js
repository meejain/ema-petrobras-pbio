/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsContentPanelPlainParser from './parsers/cards-content-panel-plain.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/pbio-cleanup.js';
import sectionsTransformer from './transformers/pbio-sections.js';
import navFragmentTransformer from './transformers/pbio-nav-fragment.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-content-panel-plain': cardsContentPanelPlainParser,
};

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'acesso-informacao-hub',
  description: 'Petrobras Biocombustivel "Acesso a Informacao" hub/landing pages: hero banner, a left-nav section navigation (shared fragment, relocated to a sidebar by the acesso-informacao-hub template), and content rows of two-up plain content panels (heading + text + CTA) plus "LINKS RELEVANTES" link panels.',
  urls: [
    'https://pbio.com.br/acesso-a-informacao',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        '#main-content > div.lfr-layout-structure-item-b35458b9-942a-2962-6c58-95820e82b3c7.lfr-layout-structure-item-container',
      ],
    },
    {
      name: 'cards-content-panel-plain',
      instances: [
        '#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-7d381538-3605-5f2a-77d3-ba971425eeb7',
        '#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-cea930a4-13b2-5f72-9d38-bff7234546dc',
        '#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-9bc02fce-91ce-d3da-57b6-f1cd6bad3b56',
      ],
    },
  ],
  sections: [
    {
      id: 'hero',
      name: 'Hero Banner',
      selector: '#main-content > div.lfr-layout-structure-item-b35458b9-942a-2962-6c58-95820e82b3c7.lfr-layout-structure-item-container',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'row-institucional',
      name: 'Institucional',
      selector: '#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-7d381538-3605-5f2a-77d3-ba971425eeb7',
      style: null,
      blocks: ['cards-content-panel-plain'],
      defaultContent: [],
    },
    {
      id: 'row-empregados-agenda',
      name: 'Empregados e Agenda',
      selector: '#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-cea930a4-13b2-5f72-9d38-bff7234546dc',
      style: null,
      blocks: ['cards-content-panel-plain'],
      defaultContent: [],
    },
    {
      id: 'row-servicos',
      name: 'Servicos',
      selector: '#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-9bc02fce-91ce-d3da-57b6-f1cd6bad3b56',
      style: null,
      blocks: ['cards-content-panel-plain'],
      defaultContent: [],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then nav-fragment injection, then
// section breaks/metadata (only if 2+ sections).
const transformers = [
  cleanupTransformer,
  navFragmentTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

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

function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + nav fragment + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    // Tag the page with its template so scripts.js loads the sidebar layout.
    // createMetadata appends a Metadata block table as the last table in main.
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

    // 6. Generate sanitized path
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
