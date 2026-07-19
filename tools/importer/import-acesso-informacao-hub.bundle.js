/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-acesso-informacao-hub.js
  var import_acesso_informacao_hub_exports = {};
  __export(import_acesso_informacao_hub_exports, {
    default: () => import_acesso_informacao_hub_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(
      'img.banner-hero-color-image, picture img, img[class*="hero"]'
    );
    const titleScope = element.querySelector(".banner-title, .petro-title");
    const heading = (titleScope || element).querySelector(
      'h1, h2, h3, [class*="title"] h1, [class*="title"] h2'
    );
    const breadcrumbEl = element.querySelector(".banner-breadcrumb-session .breadcrumb, ol.breadcrumb");
    let breadcrumbPara = null;
    if (breadcrumbEl) {
      const parts = [];
      breadcrumbEl.querySelectorAll(":scope > li").forEach((li) => {
        const link = li.querySelector("a[href]");
        const label = li.textContent.replace(/\s+/g, " ").trim();
        if (!label) return;
        if (link) {
          const a = document2.createElement("a");
          a.setAttribute("href", link.getAttribute("href"));
          a.textContent = label;
          parts.push(a);
        } else {
          parts.push(document2.createTextNode(label));
        }
      });
      if (parts.length) {
        breadcrumbPara = document2.createElement("p");
        breadcrumbPara.className = "hero-banner-breadcrumb";
        parts.forEach((node, i) => {
          if (i > 0) breadcrumbPara.append(document2.createTextNode(" \u203A "));
          breadcrumbPara.append(node);
        });
      }
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (breadcrumbPara) contentCell.push(breadcrumbPara);
    if (heading) contentCell.push(heading);
    if (titleScope) {
      titleScope.querySelectorAll("p, a").forEach((el) => {
        if (!contentCell.includes(el)) contentCell.push(el);
      });
    }
    cells.push([contentCell]);
    if (!bgImage && !heading) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-content-panel-plain.js
  function parse2(element, { document: document2 }) {
    const panels = Array.from(element.querySelectorAll(":scope .grid-fragment-element"));
    const sources = panels.length ? panels : [element];
    const rows = [];
    sources.forEach((panel) => {
      const cell = [];
      const heading = panel.querySelector("h1, h2, h3, h4");
      if (heading) {
        const h = document2.createElement(heading.tagName.toLowerCase());
        h.textContent = heading.textContent.trim();
        cell.push(h);
      }
      panel.querySelectorAll(".body-text").forEach((bt) => {
        const eyebrow = bt.querySelector(".small");
        if (eyebrow) {
          const span = document2.createElement("span");
          span.className = "small";
          span.textContent = eyebrow.textContent.trim();
          const p = document2.createElement("p");
          p.append(span);
          cell.push(p);
        } else if (bt.textContent.trim()) {
          const p = document2.createElement("p");
          p.textContent = bt.textContent.trim();
          cell.push(p);
        }
      });
      panel.querySelectorAll(".petro-link a[href]").forEach((a) => {
        const link = document2.createElement("a");
        link.setAttribute("href", a.getAttribute("href"));
        link.textContent = a.textContent.trim();
        const p = document2.createElement("p");
        p.append(link);
        cell.push(p);
      });
      if (cell.length) rows.push([cell]);
    });
    if (!rows.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-content-panel (plain)",
      cells: rows
    });
    element.replaceWith(block);
  }

  // tools/importer/transformers/pbio-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cookies-banner",
        ".cookie-overlay",
        ".portlet-cookies-banner-configuration",
        "#p_p_id_com_liferay_cookies_banner_web_portlet_CookiesBannerConfigurationPortlet_"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#tooltipContainer",
        "#yui3-css-stamp",
        ".search-bar-suggestions-dropdown-menu"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".quick-access-nav"]);
      WebImporter.DOMUtils.remove(element, [
        ".lfr-layout-structure-item-top-menu---empresas",
        "#ec-top-menu"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".banner-breadcrumb-session",
        ".portlet-breadcrumb"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#ec-footer",
        ".lfr-layout-structure-item-com-liferay-asset-publisher-web-portlet-assetpublisherportlet",
        ".portlet-asset-publisher"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".lfr-layout-structure-item-menu-flutuante-e-menu-de-ancoras"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".lfr-layout-structure-item-estilos-padr-es---empresas-controladas",
        ".lfr-layout-structure-item-estilos-texto-rico---empresas-controladas"
      ]);
      WebImporter.DOMUtils.remove(element, ["#hrefFm"]);
      WebImporter.DOMUtils.remove(element, [
        ".lfr-layout-structure-item-ancora-com-link"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".lfr-layout-structure-item-banner-de-cookies"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".portlet-navigation"
      ]);
      WebImporter.DOMUtils.remove(element, ["link", "noscript", "script", "style"]);
      element.querySelectorAll('img[src^="data:"]').forEach((img) => img.remove());
    }
  }

  // tools/importer/transformers/pbio-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const sections = payload && payload.template && payload.template.sections || [];
      if (!sections.length) return;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(element.ownerDocument || document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = (element.ownerDocument || document).createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/transformers/pbio-nav-fragment.js
  var TransformHook3 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var FRAGMENT_PATH = "/fragments/acesso-a-informacao-nav";
  function transform3(hookName, element, payload) {
    if (hookName !== TransformHook3.afterTransform) return;
    const doc = element.ownerDocument || document;
    const link = doc.createElement("a");
    link.setAttribute("href", FRAGMENT_PATH);
    link.textContent = FRAGMENT_PATH;
    const fragmentBlock = WebImporter.Blocks.createBlock(doc, {
      name: "fragment",
      cells: [[link]]
    });
    const hero = element.firstElementChild;
    if (hero) {
      const hr = doc.createElement("hr");
      hero.after(hr);
      hr.after(fragmentBlock);
    } else {
      element.prepend(fragmentBlock);
    }
  }

  // tools/importer/import-acesso-informacao-hub.js
  var parsers = {
    "hero-banner": parse,
    "cards-content-panel-plain": parse2
  };
  var PAGE_TEMPLATE = {
    name: "acesso-informacao-hub",
    description: 'Petrobras Biocombustivel "Acesso a Informacao" hub/landing pages: hero banner, a left-nav section navigation (shared fragment, relocated to a sidebar by the acesso-informacao-hub template), and content rows of two-up plain content panels (heading + text + CTA) plus "LINKS RELEVANTES" link panels.',
    urls: [
      "https://pbio.com.br/acesso-a-informacao"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          "#main-content > div.lfr-layout-structure-item-b35458b9-942a-2962-6c58-95820e82b3c7.lfr-layout-structure-item-container"
        ]
      },
      {
        name: "cards-content-panel-plain",
        instances: [
          "#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-7d381538-3605-5f2a-77d3-ba971425eeb7",
          "#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-cea930a4-13b2-5f72-9d38-bff7234546dc",
          "#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-9bc02fce-91ce-d3da-57b6-f1cd6bad3b56"
        ]
      }
    ],
    sections: [
      {
        id: "hero",
        name: "Hero Banner",
        selector: "#main-content > div.lfr-layout-structure-item-b35458b9-942a-2962-6c58-95820e82b3c7.lfr-layout-structure-item-container",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "row-institucional",
        name: "Institucional",
        selector: "#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-7d381538-3605-5f2a-77d3-ba971425eeb7",
        style: null,
        blocks: ["cards-content-panel-plain"],
        defaultContent: []
      },
      {
        id: "row-empregados-agenda",
        name: "Empregados e Agenda",
        selector: "#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-cea930a4-13b2-5f72-9d38-bff7234546dc",
        style: null,
        blocks: ["cards-content-panel-plain"],
        defaultContent: []
      },
      {
        id: "row-servicos",
        name: "Servicos",
        selector: "#main-content > div.lfr-layout-structure-item-grade.lfr-layout-structure-item-9bc02fce-91ce-d3da-57b6-f1cd6bad3b56",
        style: null,
        blocks: ["cards-content-panel-plain"],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    transform3,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_acesso_informacao_hub_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      const tables = main.querySelectorAll("table");
      const metaTable = tables[tables.length - 1];
      if (metaTable) {
        const body = metaTable.querySelector("tbody") || metaTable;
        const row = document2.createElement("tr");
        const keyCell = document2.createElement("td");
        keyCell.textContent = "template";
        const valCell = document2.createElement("td");
        valCell.textContent = PAGE_TEMPLATE.name;
        row.append(keyCell, valCell);
        body.append(row);
      }
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index";
      const path = WebImporter.FileUtils.sanitizePath(rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_acesso_informacao_hub_exports);
})();
