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

  // tools/importer/import-institucional-page.js
  var import_institucional_page_exports = {};
  __export(import_institucional_page_exports, {
    default: () => import_institucional_page_default
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

  // tools/importer/parsers/anchornav-sticky.js
  function parse2(element, { document: document2 }) {
    const navScope = element.querySelector("nav.petro-nav-anchor-menu, nav, .petro-anchor-menu-container");
    const links = Array.from(
      (navScope || element).querySelectorAll('a[href^="#"], a[href*="#"]')
    );
    const cells = [];
    links.forEach((link) => {
      link.textContent = link.textContent.trim();
      cells.push([link]);
    });
    if (links.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "anchornav-sticky", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-content-panel.js
  function parse3(element, { document: document2 }) {
    const iconArea = element.querySelector(".section-icon-area");
    let icon = (iconArea || element).querySelector("img");
    if (icon && (icon.getAttribute("src") || "").startsWith("data:")) {
      icon = null;
    }
    const heading = element.querySelector(
      ".content-section-title, .content-section-menu h2, h1, h2, h3"
    );
    const contentArea = element.querySelector(".content-section-content");
    const bodyBlocks = contentArea ? Array.from(contentArea.querySelectorAll(".body-text")) : [];
    const ctaLinks = Array.from(
      element.querySelectorAll(".petro-link a.link-text, .petro-link a[href]")
    );
    const contentCell = [];
    if (heading) contentCell.push(heading);
    bodyBlocks.forEach((el) => contentCell.push(el));
    ctaLinks.forEach((el) => contentCell.push(el));
    if (!icon && contentCell.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([icon || "", contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "cards-content-panel",
      cells
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

  // tools/importer/import-institucional-page.js
  var parsers = {
    "hero-banner": parse,
    "anchornav-sticky": parse2,
    "cards-content-panel": parse3
  };
  var PAGE_TEMPLATE = {
    name: "institucional-page",
    description: "Petrobras Biocombustivel institutional homepage: hero banner, anchor navigation menu, and multiple content sections with headings, rich text, lists, and document download links.",
    urls: [
      "https://pbio.com.br/"
    ],
    blocks: [
      {
        name: "hero-banner",
        instances: [
          "#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-hero-color"
        ]
      },
      {
        name: "anchornav-sticky",
        instances: [
          "#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-menu-anchor-session"
        ]
      },
      {
        name: "cards-content-panel",
        instances: [
          "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-17bd8ca5-1046-c603-ad57-fbc74978eae8",
          "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-846d505a-a4ae-469f-3ab6-727b73f91765",
          "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-3eb971a3-1dfa-432f-6c2f-fcf250eade25",
          "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-15864dd6-fde0-19eb-cdca-7878ffbdd434",
          "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-a304e3cc-6e2c-ffa1-2657-26ce2c4a03b9",
          "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-91dc1418-969c-74a5-056a-aa4b5c8f79c2"
        ]
      }
    ],
    sections: [
      { id: "hero", name: "Hero Banner", selector: "#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-hero-color", style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "anchor-menu", name: "Anchor Menu", selector: "#main-content > div.lfr-layout-structure-item-a1fe871f-b55a-8996-7e5c-d227b1270ffd.lfr-layout-structure-item-container > div.lfr-layout-structure-item-banner-hero---cor.lfr-layout-structure-item-26b542c7-e406-80d2-9181-ac522f2200c2 > div > div.fragment_1139686 > div.banner-menu-anchor-session", style: "light", blocks: ["anchornav-sticky"], defaultContent: [] },
      { id: "institucional", name: "Institucional", selector: "#main-content > div.lfr-layout-structure-item-se--o-para-textos-e-links.lfr-layout-structure-item-9417809b-3e4a-0e2a-17c7-eec0a4e39789", style: null, blocks: [], defaultContent: ["#main-content > div.lfr-layout-structure-item-se--o-para-textos-e-links.lfr-layout-structure-item-9417809b-3e4a-0e2a-17c7-eec0a4e39789"] },
      { id: "ato-ou-lei-de-criacao", name: "Ato ou lei de criacao", selector: "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-17bd8ca5-1046-c603-ad57-fbc74978eae8", style: null, blocks: ["cards-content-panel"], defaultContent: [] },
      { id: "missao-visao-e-valores", name: "Missao, Visao e Valores", selector: "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-846d505a-a4ae-469f-3ab6-727b73f91765", style: null, blocks: ["cards-content-panel"], defaultContent: [] },
      { id: "estatuto-social", name: "Estatuto Social", selector: "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-3eb971a3-1dfa-432f-6c2f-fcf250eade25", style: null, blocks: ["cards-content-panel"], defaultContent: [] },
      { id: "principais-operacoes", name: "Principais Operacoes", selector: "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-15864dd6-fde0-19eb-cdca-7878ffbdd434", style: null, blocks: ["cards-content-panel"], defaultContent: [] },
      { id: "privacidade-e-dados-pessoais", name: "Privacidade e dados pessoais", selector: "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-a304e3cc-6e2c-ffa1-2657-26ce2c4a03b9", style: null, blocks: ["cards-content-panel"], defaultContent: [] },
      { id: "composicao-do-capital-social", name: "Composicao do Capital Social", selector: "#main-content > div.lfr-layout-structure-item-se--o-de-conte-do.lfr-layout-structure-item-91dc1418-969c-74a5-056a-aa4b5c8f79c2", style: null, blocks: ["cards-content-panel"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_institucional_page_default = {
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
  return __toCommonJS(import_institucional_page_exports);
})();
