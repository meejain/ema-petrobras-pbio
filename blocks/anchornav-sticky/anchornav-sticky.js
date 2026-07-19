/**
 * Sticky in-page anchor navigation.
 * Authored as a block containing links whose hrefs are in-page fragments
 * (e.g. #estatuto-social). Renders a horizontal, scrollable bar with left/right
 * scroll controls, smooth-scrolls to the target on click, and marks the link
 * for the section currently in view as active.
 * @param {Element} block The block element
 */

/** Accent/diacritic-insensitive slug for matching hrefs to heading ids. */
const normalizeId = (s) => (s || '')
  .normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href^="#"]')];

  // Build an accent-normalized lookup of every element that has an id so a nav
  // href like #principais-operacoes resolves to a heading id like
  // "principais-operações" even though the accents differ.
  const byNormId = new Map();
  document.querySelectorAll('main [id]').forEach((el) => {
    const key = normalizeId(el.id);
    if (!byNormId.has(key)) byNormId.set(key, el);
  });
  const resolveTarget = (rawId) => document.getElementById(rawId)
    || byNormId.get(normalizeId(rawId)) || null;

  const nav = document.createElement('nav');
  nav.className = 'anchornav-sticky-menu';
  nav.setAttribute('aria-label', 'In-page navigation');

  // link element -> resolved target element (may be null for a "home" tab)
  const linkTargets = new Map();

  links.forEach((a) => {
    const rawId = a.getAttribute('href').slice(1);
    const target = resolveTarget(rawId);
    const link = document.createElement('a');
    // point at the real element id so native anchor navigation also works
    link.href = target ? `#${target.id}` : `#${rawId}`;
    link.textContent = a.textContent.trim();
    link.className = 'anchornav-sticky-item';
    link.addEventListener('click', (e) => {
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    linkTargets.set(link, target);
    nav.append(link);
  });

  const scrollLeft = document.createElement('button');
  scrollLeft.type = 'button';
  scrollLeft.className = 'anchornav-sticky-scroll left';
  scrollLeft.setAttribute('aria-label', 'Scroll navigation left');

  const scrollRight = document.createElement('button');
  scrollRight.type = 'button';
  scrollRight.className = 'anchornav-sticky-scroll right';
  scrollRight.setAttribute('aria-label', 'Scroll navigation right');

  const scrollBy = (dir) => nav.scrollBy({ left: dir * (nav.clientWidth * 0.6), behavior: 'smooth' });
  scrollLeft.addEventListener('click', () => scrollBy(-1));
  scrollRight.addEventListener('click', () => scrollBy(1));

  block.textContent = '';
  block.append(scrollLeft, nav, scrollRight);

  // Scroll-spy: highlight one link and keep it visible within the scroller.
  const setActive = (activeLink) => {
    linkTargets.forEach((_t, link) => link.classList.toggle('active', link === activeLink));
    if (activeLink && nav.scrollWidth > nav.clientWidth) {
      activeLink.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };

  // The first item (e.g. "Início") is the default/home tab; it stays active
  // until the reader actually scrolls down to the first real section.
  const [firstLink] = links.length ? [...linkTargets.keys()] : [null];
  const spied = [...linkTargets.entries()].filter(([, t]) => t);

  if (spied.length) {
    // A section becomes active once its top scrolls above the activation line
    // (just below the sticky bar). Above the first section, the home tab stays.
    const ACTIVATION_OFFSET = 120;
    const onScroll = () => {
      // At the very top the first (home) tab is always active — this also avoids
      // a mis-highlight before the hero image loads and sections settle.
      if (window.scrollY <= 0) { setActive(firstLink); return; }
      let current = firstLink;
      spied.forEach(([link, target]) => {
        if (target.getBoundingClientRect().top <= ACTIVATION_OFFSET) current = link;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Default: the first label in the ribbon is selected.
  setActive(firstLink);
}
