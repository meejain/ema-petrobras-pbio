/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import anchornavStickyParser from './parsers/anchornav-sticky.js';
import cardsContentPanelParser from './parsers/cards-content-panel.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/pbio-cleanup.js';
import sectionsTransformer from './transformers/pbio-sections.js';
import assetLinksTransformer from './transformers/pbio-asset-links.js';
import internalLinksTransformer from './transformers/pbio-internal-links.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'anchornav-sticky': anchornavStickyParser,
  'cards-content-panel': cardsContentPanelParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'institucional-page',
  description: 'Petrobras Biocombustivel institutional homepage: hero banner, anchor navigation menu, and multiple content sections with headings, rich text, lists, and document download links.',
  urls: [
    'https://pbio.com.br/',
  ],
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        '#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-hero-color',
      ],
    },
    {
      name: 'anchornav-sticky',
      instances: [
        '#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-menu-anchor-session',
      ],
    },
    {
      name: 'cards-content-panel',
      instances: [
        '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-17bd8ca5-1046-c603-ad57-fbc74978eae8',
        '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-846d505a-a4ae-469f-3ab6-727b73f91765',
        '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-3eb971a3-1dfa-432f-6c2f-fcf250eade25',
        '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-15864dd6-fde0-19eb-cdca-7878ffbdd434',
        '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-a304e3cc-6e2c-ffa1-2657-26ce2c4a03b9',
        '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-91dc1418-969c-74a5-056a-aa4b5c8f79c2',
      ],
    },
  ],
  sections: [
    { id: 'hero', name: 'Hero Banner', selector: '#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-hero-color', style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 'anchor-menu', name: 'Anchor Menu', selector: '#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-menu-anchor-session', style: 'light', blocks: ['anchornav-sticky'], defaultContent: [] },
    { id: 'institucional', name: 'Institucional', selector: '#main-content > div.lfr-layout-structure-item-se--o-para-textos-e-links.lfr-layout-structure-item-9417809b-3e4a-0e2a-17c7-eec0a4e39789', style: null, blocks: [], defaultContent: ['#main-content > div.lfr-layout-structure-item-se--o-para-textos-e-links.lfr-layout-structure-item-9417809b-3e4a-0e2a-17c7-eec0a4e39789'] },
    { id: 'ato-ou-lei-de-criacao', name: 'Ato ou lei de criacao', selector: '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-17bd8ca5-1046-c603-ad57-fbc74978eae8', style: null, blocks: ['cards-content-panel'], defaultContent: [] },
    { id: 'missao-visao-e-valores', name: 'Missao, Visao e Valores', selector: '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-846d505a-a4ae-469f-3ab6-727b73f91765', style: null, blocks: ['cards-content-panel'], defaultContent: [] },
    { id: 'estatuto-social', name: 'Estatuto Social', selector: '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-3eb971a3-1dfa-432f-6c2f-fcf250eade25', style: null, blocks: ['cards-content-panel'], defaultContent: [] },
    { id: 'principais-operacoes', name: 'Principais Operacoes', selector: '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-15864dd6-fde0-19eb-cdca-7878ffbdd434', style: null, blocks: ['cards-content-panel'], defaultContent: [] },
    { id: 'privacidade-e-dados-pessoais', name: 'Privacidade e dados pessoais', selector: '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-a304e3cc-6e2c-ffa1-2657-26ce2c4a03b9', style: null, blocks: ['cards-content-panel'], defaultContent: [] },
    { id: 'composicao-do-capital-social', name: 'Composicao do Capital Social', selector: '#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-91dc1418-969c-74a5-056a-aa4b5c8f79c2', style: null, blocks: ['cards-content-panel'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (only if 2+ sections),
// then asset-link rewriting (/documents/*.pdf -> /assets) and internal page-link
// relativization (https://pbio.com.br/<page> -> /<page>).
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
  assetLinksTransformer,
  internalLinksTransformer,
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
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
      if (!block.element.parentNode) return; // Already replaced by earlier parser
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

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules + template metadata tag.
    // The homepage renders with the shared default-template layout (centered
    // single-column content + sticky anchor nav, no sidebar), so it must carry
    // `template: default-template` — same as the other anchor-nav pages —
    // otherwise it falls back to the default full-width layout.
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
      valCell.textContent = 'default-template';
      row.append(keyCell, valCell);
      body.append(row);
    }
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path (fall back to /index for the homepage, whose
    // pathname collapses to an empty string and would otherwise make
    // sanitizePath resolve against process.cwd() — unavailable in the browser).
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
