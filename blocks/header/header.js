import { getMetadata } from '../../scripts/aem.js';

// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Closes all open nav dropdowns.
 * @param {Element} navSections The nav sections container
 */
function closeAllDropdowns(navSections) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((drop) => {
    drop.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Toggles the mobile menu open/closed.
 * @param {Element} nav
 * @param {Element} navSections
 * @param {boolean|null} forceExpanded
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null
    ? !forceExpanded
    : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (button) {
    button.setAttribute('aria-label', expanded ? 'Abrir navegação' : 'Fechar navegação');
  }
  if (expanded || isDesktop.matches) closeAllDropdowns(navSections);
}

/**
 * Builds the accessibility toolbar (A+ / A- font size, contrast toggle).
 * Content-free UI controls belong in JS, not in the nav fragment.
 * @returns {Element}
 */
function buildAccessibilityTools() {
  const wrapper = document.createElement('div');
  wrapper.className = 'nav-accessibility';

  // Font resize: steps the whole-page font-size in 2px increments,
  // 12px floor → 22px max (default 14px). Applied to <body> so it scales the
  // header, main content, and footer together — matching the source behavior.
  const MIN_FONT = 12;
  const MAX_FONT = 22;
  const DEFAULT_FONT = 14;
  let fontSize = DEFAULT_FONT;

  // A+/A- form a single joined pill (like the source): the button matching the
  // current zoom direction gets the filled/active state.
  const pill = document.createElement('div');
  pill.className = 'nav-font-pill';

  const incBtn = document.createElement('button');
  incBtn.type = 'button';
  incBtn.className = 'nav-font-btn nav-font-increase';
  incBtn.textContent = 'A+';
  incBtn.setAttribute('aria-label', 'Aumentar fonte');

  const decBtn = document.createElement('button');
  decBtn.type = 'button';
  decBtn.className = 'nav-font-btn nav-font-decrease';
  decBtn.textContent = 'A-';
  decBtn.setAttribute('aria-label', 'Diminuir fonte');

  const applyFont = () => {
    document.body.style.fontSize = `${fontSize}px`;
    incBtn.classList.toggle('active', fontSize > DEFAULT_FONT);
    decBtn.classList.toggle('active', fontSize < DEFAULT_FONT);
  };

  incBtn.addEventListener('click', () => {
    fontSize = Math.min(fontSize + 2, MAX_FONT);
    applyFont();
  });
  decBtn.addEventListener('click', () => {
    fontSize = Math.max(fontSize - 2, MIN_FONT);
    applyFont();
  });

  pill.append(incBtn, decBtn);

  // High-contrast (dark mode): toggles body.high-contrast-active and swaps the
  // aria-label between Ativar/Desativar, matching the source.
  const contrast = document.createElement('button');
  contrast.type = 'button';
  contrast.className = 'nav-contrast-toggle';
  contrast.setAttribute('aria-label', 'Ativar alto contraste');
  contrast.addEventListener('click', () => {
    const active = document.body.classList.toggle('high-contrast-active');
    contrast.classList.toggle('active', active);
    contrast.setAttribute('aria-label', active ? 'Desativar alto contraste' : 'Ativar alto contraste');
  });

  wrapper.append(pill, contrast);
  return wrapper;
}

/**
 * Builds the search form. Form controls belong in JS, not in the nav fragment.
 * @param {string} placeholder
 * @returns {Element}
 */
function buildSearchForm(placeholder) {
  const form = document.createElement('form');
  form.className = 'nav-search';
  form.setAttribute('role', 'search');
  form.method = 'get';
  form.action = 'https://pbio.com.br/';

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = placeholder || 'Buscar';
  input.setAttribute('aria-label', 'Campo de pesquisa');

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'nav-search-submit';
  submit.setAttribute('aria-label', 'Buscar');

  form.append(input, submit);
  return form;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav fragment: local (aem up) first, then DA/EDS production
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // Brand: strip button styling from the logo link
  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    const brandLink = navBrand.querySelector('a');
    if (brandLink) brandLink.className = '';
  }

  // Sections: wire dropdown toggles (hover on desktop, click to expand)
  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // any li that has a nested ul (at any level) is a drop parent
    navSections.querySelectorAll('li').forEach((li) => {
      if (li.querySelector(':scope > ul')) {
        li.classList.add('nav-drop');
        li.setAttribute('aria-expanded', 'false');
        // dedicated chevron toggle button (used on mobile): expands the item's
        // sub-list. The item's own text link still navigates (split-link parity).
        const link = li.querySelector(':scope > a');
        if (link && !li.querySelector(':scope > .nav-drop-toggle')) {
          const toggle = document.createElement('button');
          toggle.type = 'button';
          toggle.className = 'nav-drop-toggle';
          toggle.setAttribute('aria-label', 'Expandir');
          toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const expanded = li.getAttribute('aria-expanded') === 'true';
            li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          });
          link.insertAdjacentElement('afterend', toggle);
        }
      }
    });

    navSections.querySelectorAll(':scope > ul > li').forEach((navSection) => {
      // desktop: clicking the top-level item toggles its dropdown (no navigation)
      navSection.addEventListener('click', (e) => {
        if (!isDesktop.matches) return; // mobile uses the chevron toggle / text navigates
        if (e.target.closest('ul') || e.target.closest('.nav-drop-toggle')) return;
        if (navSection.classList.contains('nav-drop')) {
          e.preventDefault();
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          closeAllDropdowns(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
      // desktop hover opens/closes the top-level dropdown
      navSection.addEventListener('mouseenter', () => {
        if (isDesktop.matches && navSection.classList.contains('nav-drop')) {
          closeAllDropdowns(navSections);
          navSection.setAttribute('aria-expanded', 'true');
        }
      });
      navSection.addEventListener('mouseleave', () => {
        if (isDesktop.matches && navSection.classList.contains('nav-drop')) {
          navSection.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // second-level items with a nested (level-3) list:
    // desktop = hover side-flyout (handled here); mobile uses the chevron toggle.
    navSections.querySelectorAll(':scope > ul > li > ul > li.nav-drop').forEach((subItem) => {
      subItem.addEventListener('mouseenter', () => {
        if (isDesktop.matches) subItem.setAttribute('aria-expanded', 'true');
      });
      subItem.addEventListener('mouseleave', () => {
        if (isDesktop.matches) subItem.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Tools: replace the plain "Buscar" placeholder with the a11y toolbar + search form
  const navTools = nav.querySelector('.nav-tools');
  const accessibilityTools = buildAccessibilityTools();
  let searchForm = null;
  if (navTools) {
    const placeholderEl = navTools.querySelector('p');
    const placeholder = placeholderEl ? placeholderEl.textContent.trim() : 'Buscar';
    navTools.textContent = '';
    searchForm = buildSearchForm(placeholder);
    navTools.append(accessibilityTools);
    navTools.append(searchForm);
  }

  // Mobile-only "Acessibilidade" accordion: the source exposes the A+/A- and
  // contrast controls as a third top-level accordion on mobile (desktop keeps
  // them in the toolbar). Build the row here; the a11y tools node is relocated
  // into it at mobile widths (see placeAccessibilityTools below).
  let acessPanel = null;
  if (navSections) {
    const topList = navSections.querySelector(':scope > ul');
    if (topList) {
      const li = document.createElement('li');
      li.className = 'nav-drop nav-accessibility-item';
      li.setAttribute('aria-expanded', 'false');
      const label = document.createElement('a');
      label.textContent = 'Acessibilidade';
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'nav-drop-toggle';
      toggle.setAttribute('aria-label', 'Expandir');
      acessPanel = document.createElement('div');
      acessPanel.className = 'nav-accessibility-panel';
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const expanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      label.addEventListener('click', (e) => {
        if (isDesktop.matches) return;
        e.preventDefault();
        const expanded = li.getAttribute('aria-expanded') === 'true';
        li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      });
      li.append(label, toggle, acessPanel);
      topList.append(li);
    }
  }

  // Relocate the a11y controls: toolbar on desktop, Acessibilidade panel on mobile.
  const placeAccessibilityTools = () => {
    if (isDesktop.matches) {
      if (navTools) navTools.prepend(accessibilityTools);
    } else if (acessPanel) {
      acessPanel.append(accessibilityTools);
    }
  };
  placeAccessibilityTools();

  // hamburger for mobile (sits at the right of the bar, next to the search icon)
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Abrir navegação">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  // mobile-only search icon in the bar: opens the drawer and reveals the search field
  const searchToggle = document.createElement('button');
  searchToggle.type = 'button';
  searchToggle.className = 'nav-search-toggle';
  searchToggle.setAttribute('aria-label', 'Abrir barra de pesquisa');
  searchToggle.addEventListener('click', () => {
    const willOpen = !nav.classList.contains('search-open');
    if (nav.getAttribute('aria-expanded') !== 'true') toggleMenu(nav, navSections);
    nav.classList.toggle('search-open', willOpen);
    if (willOpen && searchForm) searchForm.querySelector('input')?.focus();
  });

  const navControls = document.createElement('div');
  navControls.className = 'nav-controls';
  navControls.append(searchToggle, hamburger);
  nav.append(navControls);
  nav.setAttribute('aria-expanded', 'false');

  // close dropdowns / menu on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      if (navSections) closeAllDropdowns(navSections);
      if (!isDesktop.matches) toggleMenu(nav, navSections, false);
    }
  });

  // close on Escape
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (navSections) closeAllDropdowns(navSections);
      if (!isDesktop.matches) toggleMenu(nav, navSections, false);
    }
  });

  // reset state when crossing the desktop/mobile breakpoint
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, navSections, isDesktop.matches);
    if (navSections) closeAllDropdowns(navSections);
    nav.classList.remove('search-open');
    placeAccessibilityTools();
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
