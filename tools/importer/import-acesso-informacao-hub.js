/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsContentPanelPlainParser from './parsers/cards-content-panel-plain.js';
import tableParser from './parsers/table-data.js';
import embedParser from './parsers/embed.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/pbio-cleanup.js';
import navFragmentTransformer from './transformers/pbio-nav-fragment.js';
import assetLinksTransformer from './transformers/pbio-asset-links.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-content-panel-plain': cardsContentPanelPlainParser,
  table: tableParser,
  embed: embedParser,
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

// TRANSFORMER REGISTRY - cleanup first, then nav-fragment injection. Section
// breaks are inserted inline in transform() from the structurally-discovered
// rows (see discoverStructure), so the selector-based sections transformer is
// not used here.
const transformers = [
  cleanupTransformer,
  navFragmentTransformer,
  assetLinksTransformer,
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

/**
 * Structurally discover the hero + content rows for any Acesso a Informacao hub
 * page. Liferay assigns per-page hashes to layout items, so we match on stable
 * structural classes instead:
 *   - hero  = the layout container holding `.banner-hero-color`
 *   - rows  = each `.lfr-layout-structure-item-grade` under #main-content that
 *             directly holds a `.grid-fragment-container` (the two-up panels);
 *             nested grades are excluded so rows are not double-counted.
 * Returns { pageBlocks, sections } describing what was found, so the section
 * break/metadata transformer and the parser loop can operate generically.
 */
function discoverStructure(document) {
  const main = document.querySelector('#main-content') || document.body;
  const pageBlocks = [];
  const sections = [];

  // Hero — the container wrapping the banner-hero image.
  const heroImg = main.querySelector('.banner-hero-color');
  const hero = heroImg
    ? (heroImg.closest('.lfr-layout-structure-item-container') || heroImg.closest('#main-content > div') || heroImg)
    : null;
  if (hero) {
    pageBlocks.push({ name: 'hero-banner', element: hero, selector: '.banner-hero-color (hero)' });
    sections.push({ id: 'hero', name: 'Hero Banner', element: hero, style: null });
  }

  // Ordered content items after the hero. We walk direct children of
  // #main-content in document order so grid rows, table sections, and other
  // content keep their relative position (some pages interleave them).
  const contentItems = [...main.children].filter((el) => el !== hero && !el.contains(hero));

  let gridCount = 0;
  let tableCount = 0;
  let embedCount = 0;
  contentItems.forEach((item, i) => {
    // External iframe (e.g. Agenda de Autoridades transparency calendar) →
    // `embed` block. Handle before other checks so the widget is preserved.
    const iframe = item.querySelector('iframe[src]');
    if (iframe) {
      embedCount += 1;
      // Replace the whole layout item (not just the iframe) so the embed block
      // becomes a clean top-level section child and serializes correctly.
      pageBlocks.push({ name: 'embed', element: item, selector: `.iframe[${i}]` });
      sections.push({ id: `embed-${i}`, name: `Embed ${i}`, element: item, style: null });
      return;
    }
    // Table section (CSV/XLSX spreadsheet) → one `table` block PER table inside.
    if (item.matches('.lfr-layout-structure-item-tabela--csv-e-xlsx-') || item.querySelector('.petro-spreedsheet table')) {
      const tables = [...item.querySelectorAll('table')];
      tables.forEach((t, ti) => {
        // wrap each table in a stub the parser can replace in place
        pageBlocks.push({ name: 'table', element: t.closest('article') || t, selector: `.table[${i}.${ti}]` });
      });
      if (tables.length) {
        tableCount += tables.length;
        sections.push({ id: `table-${i}`, name: `Table ${i}`, element: item, style: null });
      }
      return;
    }
    // Content grid row (two-up panels) → cards-content-panel-plain.
    const grade = item.matches('.lfr-layout-structure-item-grade') && item.querySelector('.grid-fragment-container')
      ? item
      : null;
    if (grade) {
      gridCount += 1;
      pageBlocks.push({ name: 'cards-content-panel-plain', element: grade, selector: `.grade[${i}]` });
      sections.push({ id: `row-${i}`, name: `Content Row ${i}`, element: grade, style: null });
    }
    // Anything else (intro sections, flat rich text) is left as default content
    // and captured by the section-break logic / WebImporter default conversion.
  });

  console.log(`Discovered ${pageBlocks.length} blocks (hero + ${gridCount} grid rows + ${tableCount} tables + ${embedCount} embeds)`);
  return { pageBlocks, sections };
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Structurally discover hero + content rows (works across all hub pages)
    const { pageBlocks, sections } = discoverStructure(document);

    // 3. Insert section breaks (<hr>). Always break right after the hero so the
    //    first block of page content (intro text, grid row, or table) starts a
    //    new section. Then break before each subsequent discovered content
    //    section, skipping any that already have a break immediately before
    //    them (avoids empty sections when a content section directly follows
    //    the hero).
    const heroSection = sections.find((s) => s.id === 'hero');
    if (heroSection && heroSection.element && heroSection.element.parentNode) {
      const hr = document.createElement('hr');
      heroSection.element.after(hr);
    }
    sections.filter((s) => s.id !== 'hero').forEach((section) => {
      const el = section.element;
      if (!el || !el.parentNode) return;
      const prev = el.previousElementSibling;
      if (prev && prev.tagName === 'HR') return; // already separated
      const hr = document.createElement('hr');
      el.before(hr);
    });

    // 4. Parse each block using registered parsers
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

    // 5. afterTransform (final cleanup + nav fragment injection)
    executeTransformers('afterTransform', main, payload);

    // 6. WebImporter built-in rules
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

    // 7. Generate sanitized path
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
