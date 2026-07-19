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

  // tools/importer/parsers/table-data.js
  function parse3(element, { document: document2 }) {
    const table = element.querySelector("table");
    if (!table) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const rows = [];
    const caption = table.querySelector("thead th, thead td");
    const titleText = caption ? caption.textContent.trim() : "";
    if (titleText) rows.push([titleText]);
    const bodyRows = table.querySelectorAll("tbody tr");
    const trList = bodyRows.length ? bodyRows : table.querySelectorAll("tr");
    trList.forEach((tr) => {
      const cells = [...tr.children].map((td) => td.textContent.trim());
      if (cells.every((c) => c === "")) return;
      rows.push(cells);
    });
    if (!rows.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "table",
      cells: rows
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function parse4(element, { document: document2 }) {
    const iframe = element.querySelector("iframe") || (element.tagName === "IFRAME" ? element : null);
    const src = iframe ? iframe.getAttribute("src") : null;
    if (!src) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const link = document2.createElement("a");
    link.setAttribute("href", src);
    link.textContent = src;
    const block = WebImporter.Blocks.createBlock(document2, {
      name: "embed",
      cells: [[link]]
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
      const PLACEHOLDER_RE = /^(duplo click aqui|digite o nome|subt[ií]tulo\s*\d+|lorem ipsum)/i;
      element.querySelectorAll("p, li, span, div, h1, h2, h3, h4, h5, h6").forEach((el) => {
        const hasRealChild = [...el.children].some((c) => c.tagName !== "BR");
        if (hasRealChild) return;
        const txt = (el.textContent || "").trim();
        if (PLACEHOLDER_RE.test(txt)) el.remove();
      });
      element.querySelectorAll("a").forEach((a) => {
        const href = (a.getAttribute("href") || "").trim();
        if (!href || href === "#") {
          const p = a.closest("p");
          a.remove();
          if (p && !p.textContent.trim() && !p.querySelector("a, img")) p.remove();
        }
      });
      element.querySelectorAll('img[src^="data:"]').forEach((img) => img.remove());
    }
  }

  // tools/importer/transformers/pbio-nav-fragment.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var FRAGMENT_PATH = "/fragments/acesso-a-informacao-nav";
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
    const doc = element.ownerDocument || document;
    const link = doc.createElement("a");
    link.setAttribute("href", FRAGMENT_PATH);
    link.textContent = FRAGMENT_PATH;
    const fragmentBlock = WebImporter.Blocks.createBlock(doc, {
      name: "fragment",
      cells: [[link]]
    });
    const hr = doc.createElement("hr");
    element.append(hr);
    element.append(fragmentBlock);
  }

  // tools/importer/transformers/pbio-asset-links.js
  var TransformHook3 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform3(hookName, element, payload) {
    if (hookName !== TransformHook3.afterTransform) return;
    const slugifyWord = (s) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const slugifySegment = (seg, isFile) => {
      let s = seg;
      try {
        s = decodeURIComponent(seg);
      } catch (e) {
      }
      if (!isFile) return slugifyWord(s);
      const dot = s.lastIndexOf(".");
      const name = dot > 0 ? s.slice(0, dot) : s;
      const ext = dot > 0 ? s.slice(dot + 1) : "";
      const base = slugifyWord(name);
      return ext ? `${base}.${slugifyWord(ext)}` : base;
    };
    const toAssetPath = (href) => {
      if (!href) return null;
      const path = href.replace(/^https?:\/\/[^/]+/, "");
      if (!path.startsWith("/documents/")) return null;
      const m = path.match(/^(\/documents\/.*?\.pdf)/i);
      if (!m) return null;
      const parts = m[1].split("/");
      const slug = parts.map((seg, i) => seg ? slugifySegment(seg, i === parts.length - 1) : seg).join("/");
      return `/assets${slug}`;
    };
    element.querySelectorAll('a[href*="/documents/"]').forEach((a) => {
      const asset = toAssetPath(a.getAttribute("href") || "");
      if (asset) a.setAttribute("href", asset);
    });
  }

  // tools/importer/import-acesso-informacao-hub.js
  var parsers = {
    "hero-banner": parse,
    "cards-content-panel-plain": parse2,
    table: parse3,
    embed: parse4
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
    transform2,
    transform3
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
  function discoverStructure(document2) {
    const main = document2.querySelector("#main-content") || document2.body;
    const pageBlocks = [];
    const sections = [];
    const heroImg = main.querySelector(".banner-hero-color");
    const hero = heroImg ? heroImg.closest(".lfr-layout-structure-item-container") || heroImg.closest("#main-content > div") || heroImg : null;
    if (hero) {
      pageBlocks.push({ name: "hero-banner", element: hero, selector: ".banner-hero-color (hero)" });
      sections.push({ id: "hero", name: "Hero Banner", element: hero, style: null });
    }
    const contentItems = [...main.children].filter((el) => el !== hero && !el.contains(hero));
    let gridCount = 0;
    let tableCount = 0;
    let embedCount = 0;
    contentItems.forEach((item, i) => {
      const iframe = item.querySelector("iframe[src]");
      if (iframe) {
        embedCount += 1;
        pageBlocks.push({ name: "embed", element: item, selector: `.iframe[${i}]` });
        sections.push({ id: `embed-${i}`, name: `Embed ${i}`, element: item, style: null });
        return;
      }
      if (item.matches(".lfr-layout-structure-item-tabela--csv-e-xlsx-") || item.querySelector(".petro-spreedsheet table")) {
        const tables = [...item.querySelectorAll("table")];
        tables.forEach((t, ti) => {
          pageBlocks.push({ name: "table", element: t.closest("article") || t, selector: `.table[${i}.${ti}]` });
        });
        if (tables.length) {
          tableCount += tables.length;
          sections.push({ id: `table-${i}`, name: `Table ${i}`, element: item, style: null });
        }
        return;
      }
      const grade = item.matches(".lfr-layout-structure-item-grade") && item.querySelector(".grid-fragment-container") ? item : null;
      if (grade) {
        gridCount += 1;
        pageBlocks.push({ name: "cards-content-panel-plain", element: grade, selector: `.grade[${i}]` });
        sections.push({ id: `row-${i}`, name: `Content Row ${i}`, element: grade, style: null });
      }
    });
    console.log(`Discovered ${pageBlocks.length} blocks (hero + ${gridCount} grid rows + ${tableCount} tables + ${embedCount} embeds)`);
    return { pageBlocks, sections };
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
      const { pageBlocks, sections } = discoverStructure(document2);
      const heroSection = sections.find((s) => s.id === "hero");
      if (heroSection && heroSection.element && heroSection.element.parentNode) {
        const hr2 = document2.createElement("hr");
        heroSection.element.after(hr2);
      }
      sections.filter((s) => s.id !== "hero").forEach((section) => {
        const el = section.element;
        if (!el || !el.parentNode) return;
        const prev = el.previousElementSibling;
        if (prev && prev.tagName === "HR") return;
        const hr2 = document2.createElement("hr");
        el.before(hr2);
      });
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
