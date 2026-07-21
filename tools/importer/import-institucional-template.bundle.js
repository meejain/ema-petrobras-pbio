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

  // tools/importer/import-institucional-template.js
  var import_institucional_template_exports = {};
  __export(import_institucional_template_exports, {
    default: () => import_institucional_template_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
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
          const a = document.createElement("a");
          a.setAttribute("href", link.getAttribute("href"));
          a.textContent = label;
          parts.push(a);
        } else {
          parts.push(document.createTextNode(label));
        }
      });
      if (parts.length) {
        breadcrumbPara = document.createElement("p");
        breadcrumbPara.className = "hero-banner-breadcrumb";
        parts.forEach((node, i) => {
          if (i > 0) breadcrumbPara.append(document.createTextNode(" \u203A "));
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
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/anchornav-sticky.js
  function parse2(element, { document }) {
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
    const block = WebImporter.Blocks.createBlock(document, { name: "anchornav-sticky", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/table-data.js
  function parse3(element, { document }) {
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
    const block = WebImporter.Blocks.createBlock(document, {
      name: "table",
      cells: rows
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed.js
  function parse4(element, { document }) {
    const iframe = element.querySelector("iframe") || (element.tagName === "IFRAME" ? element : null);
    const src = iframe ? iframe.getAttribute("src") : null;
    if (!src) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const link = document.createElement("a");
    link.setAttribute("href", src);
    link.textContent = src;
    const block = WebImporter.Blocks.createBlock(document, {
      name: "embed",
      cells: [[link]]
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/downloads-accordion.js
  function parse5(element, { document }) {
    const links = [...element.querySelectorAll("a[href]")].filter((a) => (a.getAttribute("href") || "").trim() && a.textContent.trim());
    if (!links.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const promptEl = element.querySelector(".downloader-dropbox [data-lfr-editable-id], .downloader-dropbox span, .downloader-dropbox");
    const prompt = promptEl ? promptEl.textContent.trim() : "Selecione o arquivo";
    const rows = [];
    const promptCell = document.createElement("p");
    promptCell.textContent = prompt || "Selecione o arquivo";
    rows.push([promptCell]);
    links.forEach((a) => {
      const link = document.createElement("a");
      link.setAttribute("href", a.getAttribute("href"));
      link.textContent = a.textContent.trim();
      rows.push([link]);
    });
    const block = WebImporter.Blocks.createBlock(document, {
      name: "downloads-accordion",
      cells: rows
    });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-nested.js
  function parse6(element, { document }) {
    const groups = [...element.querySelectorAll("details.accordion")];
    if (!groups.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const rows = [];
    groups.forEach((group) => {
      var _a;
      const label = (((_a = group.querySelector(".accordion-label, summary h3, summary")) == null ? void 0 : _a.textContent) || "").trim();
      if (!label) return;
      const bodyCell = [];
      const summary = group.querySelector("summary");
      const intro = [...group.querySelectorAll("p, .paragraph-md-regular, .content-section-content > div")].map((el) => el.textContent.trim()).find((t) => t && !(summary && summary.textContent.includes(t)));
      if (intro) {
        const p = document.createElement("p");
        p.textContent = intro;
        bodyCell.push(p);
      }
      const links = [...group.querySelectorAll("a[href]")].filter((a) => (a.getAttribute("href") || "").trim() && a.textContent.trim());
      if (links.length) {
        const ul = document.createElement("ul");
        links.forEach((a) => {
          const li = document.createElement("li");
          const link = document.createElement("a");
          link.setAttribute("href", a.getAttribute("href"));
          link.textContent = a.textContent.trim();
          li.append(link);
          ul.append(li);
        });
        bodyCell.push(ul);
      }
      const labelEl = document.createElement("div");
      labelEl.textContent = label;
      rows.push([labelEl, bodyCell]);
    });
    if (!rows.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, {
      name: "accordion (nested, downloads)",
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

  // tools/importer/transformers/pbio-asset-links.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName !== TransformHook2.afterTransform) return;
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

  // tools/importer/transformers/pbio-internal-links.js
  var TransformHook3 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var SITE_HOST = "pbio.com.br";
  function transform3(hookName, element, payload) {
    if (hookName !== TransformHook3.afterTransform) return;
    const originRe = new RegExp(`^https?://(www\\.)?${SITE_HOST.replace(/\./g, "\\.")}`, "i");
    element.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href") || "";
      if (!originRe.test(href)) return;
      const path = href.replace(originRe, "");
      if (/^\/documents\//i.test(path)) return;
      a.setAttribute("href", path === "" ? "/" : path);
    });
  }

  // tools/importer/import-institucional-template.js
  var parsers = {
    "hero-banner": parse,
    "anchornav-sticky": parse2,
    table: parse3,
    embed: parse4,
    "downloads-accordion": parse5,
    "accordion-nested": parse6
  };
  var PAGE_TEMPLATE = {
    name: "default-template",
    description: 'Petrobras Biocombustivel "Portal Institucional" pages (/institucional/*, /cartas-*, /demonstrativos-*, /outras-informacoes): hero + sticky in-page anchor nav + single-column content sections (rich text, "Selecione o arquivo" document pickers -> downloads-accordion, nested "Atas" accordions, and CSV/XLSX tables). NO left sidebar.'
  };
  var transformers = [transform, transform2, transform3];
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
  function discoverStructure(document) {
    const main = document.querySelector("#main-content") || document.body;
    const pageBlocks = [];
    const sections = [];
    const heroImg = main.querySelector(".banner-hero-color");
    const hero = heroImg ? heroImg.closest(".lfr-layout-structure-item-container") || heroImg.closest("#main-content > div") || heroImg : null;
    if (hero) {
      pageBlocks.push({ name: "hero-banner", element: hero });
      sections.push({ id: "hero", element: hero });
    }
    const counts = {
      anchor: 0,
      downloads: 0,
      accordion: 0,
      table: 0,
      embed: 0
    };
    const anchorNav = main.querySelector(".banner-menu-anchor-session, .petro-anchor-menu-container, .petro-nav-anchor-menu");
    if (anchorNav) {
      counts.anchor += 1;
      pageBlocks.push({ name: "anchornav-sticky", element: anchorNav, relocateAfterHero: true });
    }
    const items = [...main.children].filter(
      (el) => el !== hero && !el.contains(hero)
    );
    items.forEach((item, i) => {
      if (item.matches(".lfr-layout-structure-item-ancora-com-link")) return;
      const hasBlockContent = item.querySelector("iframe[src], details.accordion, table, .lfr-layout-structure-item-combobox-download-de-arquivos, a[href], img");
      if (!item.textContent.trim() && !hasBlockContent) return;
      if (item.querySelector("iframe[src]")) {
        counts.embed += 1;
        pageBlocks.push({ name: "embed", element: item });
        sections.push({ id: `embed-${i}`, element: item });
        return;
      }
      if (item.querySelector("details.accordion")) {
        counts.accordion += 1;
        pageBlocks.push({ name: "accordion-nested", element: item });
        sections.push({ id: `accordion-${i}`, element: item });
        return;
      }
      if (item.matches(".lfr-layout-structure-item-tabela--csv-e-xlsx-") || item.querySelector(".petro-spreedsheet table")) {
        const tables = [...item.querySelectorAll("table")];
        tables.forEach((t) => {
          counts.table += 1;
          pageBlocks.push({ name: "table", element: t.closest("article") || t });
        });
        if (tables.length) sections.push({ id: `table-${i}`, element: item });
        return;
      }
      const combos = [...item.querySelectorAll(".lfr-layout-structure-item-combobox-download-de-arquivos")];
      if (combos.length) {
        combos.forEach((combo) => {
          counts.downloads += 1;
          pageBlocks.push({ name: "downloads-accordion", element: combo });
        });
        sections.push({ id: `content-${i}`, element: item });
        return;
      }
      sections.push({ id: `content-${i}`, element: item });
    });
    console.log(`Discovered ${pageBlocks.length} blocks: hero + ${counts.anchor} anchor + ${counts.downloads} downloads + ${counts.accordion} accordion + ${counts.table} tables + ${counts.embed} embeds`);
    return { pageBlocks, sections };
  }
  var import_institucional_template_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const { pageBlocks, sections } = discoverStructure(document);
      const heroSection = sections.find((s) => s.id === "hero");
      const heroEl = heroSection && heroSection.element;
      const anchorBlockDef = pageBlocks.find((b) => b.relocateAfterHero);
      if (anchorBlockDef && anchorBlockDef.element && heroEl && heroEl.parentNode) {
        heroEl.after(anchorBlockDef.element);
      }
      const breakTargets = [];
      if (anchorBlockDef && anchorBlockDef.element) breakTargets.push(anchorBlockDef.element);
      sections.filter((s) => s.id !== "hero").forEach((s) => breakTargets.push(s.element));
      if (heroEl && heroEl.parentNode) {
        const hr2 = document.createElement("hr");
        heroEl.after(hr2);
      }
      breakTargets.forEach((el) => {
        if (!el || !el.parentNode) return;
        const prev = el.previousElementSibling;
        if (prev && prev.tagName === "HR") return;
        const hr2 = document.createElement("hr");
        el.before(hr2);
      });
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      const tables = main.querySelectorAll("table");
      const metaTable = tables[tables.length - 1];
      if (metaTable) {
        const body = metaTable.querySelector("tbody") || metaTable;
        const row = document.createElement("tr");
        const keyCell = document.createElement("td");
        keyCell.textContent = "template";
        const valCell = document.createElement("td");
        valCell.textContent = PAGE_TEMPLATE.name;
        row.append(keyCell, valCell);
        body.append(row);
      }
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index";
      const path = WebImporter.FileUtils.sanitizePath(rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_institucional_template_exports);
})();
