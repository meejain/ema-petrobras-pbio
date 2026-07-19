/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: pbio (Petrobras Biocombustivel) site-wide cleanup.
 *
 * Removes Liferay chrome / non-authorable content so the import contains only
 * the page-level authorable content under #main-content.
 *
 * All selectors below were verified against migration-work/cleaned.html
 * (source: https://pbio.com.br/). Liferay assigns randomized id prefixes to
 * some elements (e.g. the quick-access nav id is `iazr_quickAccessNav` /
 * `ttby_quickAccessNav` across scrapes), so class-based selectors are used
 * where ids are not stable.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent chrome (overlays / modals that would interfere with parsing).
    // Verified in cleaned.html: .cookies-banner (line 1248), .cookie-overlay
    // (line 1115), and the configuration portlet (line 1006).
    WebImporter.DOMUtils.remove(element, [
      '.cookies-banner',
      '.cookie-overlay',
      '.portlet-cookies-banner-configuration',
      '#p_p_id_com_liferay_cookies_banner_web_portlet_CookiesBannerConfigurationPortlet_',
    ]);

    // Empty tooltip container, YUI css stamp helper, and the search
    // suggestions dropdown fragment (all non-authorable Liferay chrome).
    // Verified in cleaned.html: #tooltipContainer (line 1283),
    // #yui3-css-stamp (line 1285), .search-bar-suggestions-dropdown-menu (line 1289).
    WebImporter.DOMUtils.remove(element, [
      '#tooltipContainer',
      '#yui3-css-stamp',
      '.search-bar-suggestions-dropdown-menu',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Quick-access accessibility nav ("Pular para o Conteudo principal").
    // Verified in cleaned.html: .quick-access-nav (lines 2, 358; ids randomized).
    WebImporter.DOMUtils.remove(element, ['.quick-access-nav']);

    // Liferay top menu / header navigation (auto-populated in EDS).
    // Verified in cleaned.html: .lfr-layout-structure-item-top-menu---empresas
    // (line 10) and #ec-top-menu (line 11).
    WebImporter.DOMUtils.remove(element, [
      '.lfr-layout-structure-item-top-menu---empresas',
      '#ec-top-menu',
    ]);

    // Breadcrumb inside the hero banner (part of header chrome).
    // Verified in cleaned.html: .banner-breadcrumb-session (line 568) and
    // the breadcrumb portlet .portlet-breadcrumb (line 572).
    WebImporter.DOMUtils.remove(element, [
      '.banner-breadcrumb-session',
      '.portlet-breadcrumb',
    ]);

    // Liferay footer + asset-publisher wrapper that renders it (auto-populated).
    // Verified in cleaned.html: #ec-footer (line 1129), the asset publisher
    // layout item (line 1119) and its portlet (line 1122).
    WebImporter.DOMUtils.remove(element, [
      '#ec-footer',
      '.lfr-layout-structure-item-com-liferay-asset-publisher-web-portlet-assetpublisherportlet',
      '.portlet-asset-publisher',
    ]);

    // Floating menu / duplicate anchor menu in the footer region (chrome copy
    // of the sticky anchor nav; the authorable anchor menu lives in the hero).
    // Verified in cleaned.html: .lfr-layout-structure-item-menu-flutuante-e-menu-de-ancoras (line 1196).
    WebImporter.DOMUtils.remove(element, [
      '.lfr-layout-structure-item-menu-flutuante-e-menu-de-ancoras',
    ]);

    // Empty style helper containers (theme style fragments, no content).
    // Verified in cleaned.html: lines 1230 and 1235.
    WebImporter.DOMUtils.remove(element, [
      '.lfr-layout-structure-item-estilos-padr-es---empresas-controladas',
      '.lfr-layout-structure-item-estilos-texto-rico---empresas-controladas',
    ]);

    // Hidden Liferay href helper form. Verified in cleaned.html: #hrefFm (line 1240).
    WebImporter.DOMUtils.remove(element, ['#hrefFm']);

    // Invisible in-page anchor markers ("Ancora <label>"). These carry a hidden
    // duplicate label that otherwise leaks into the content as stray paragraphs;
    // the anchor navigation targets are the section heading ids, so the markers
    // are not needed. Verified in cleaned.html: .lfr-layout-structure-item-ancora-com-link.
    WebImporter.DOMUtils.remove(element, [
      '.lfr-layout-structure-item-ancora-com-link',
    ]);

    // Cookie banner layout item under #content (consent text + buttons like
    // "Fechar caixa de cookies"). Chrome, not authorable content.
    // Verified in cleaned.html: .lfr-layout-structure-item-banner-de-cookies.
    WebImporter.DOMUtils.remove(element, [
      '.lfr-layout-structure-item-banner-de-cookies',
    ]);

    // Liferay left side navigation menu (SiteNavigationMenuPortlet). On the
    // Acesso a Informacao hub/section pages this vertical menu is site
    // navigation chrome; in EDS we replace it with a shared nav fragment
    // (injected by pbio-nav-fragment) relocated to a sidebar by the
    // acesso-informacao-hub template. NOTE: the wrapping
    // .lfr-layout-structure-item-menu-lateral ALSO contains #main-content, so we
    // must remove only the nav portlet itself, not the wrapper. Verified in
    // cleaned.html: .portlet-navigation (line 559, SiteNavigationMenuPortlet).
    WebImporter.DOMUtils.remove(element, [
      '.portlet-navigation',
    ]);

    // Generic non-authorable leftovers.
    WebImporter.DOMUtils.remove(element, ['link', 'noscript', 'script', 'style']);

    // Inline base64 data-URI images (decorative SVG icon badges). They cannot
    // become managed assets and break the markdown serialization pipeline
    // (path resolution on the data: URI throws). Remove them site-wide.
    element.querySelectorAll('img[src^="data:"]').forEach((img) => img.remove());
  }
}
