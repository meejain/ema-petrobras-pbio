/**
 * Sticky in-page anchor navigation.
 * Authored as a block containing links whose hrefs are in-page fragments
 * (e.g. #estatuto-social). Renders a horizontal, scrollable bar with left/right
 * scroll controls, smooth-scrolls to the target on click, and marks the
 * clicked link as active (the first link is active by default).
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

  // All the rendered tab links, so the click handler can clear the others.
  const tabs = [];

  // The clicked tab becomes the active one; CSS styles `.active`. This is the
  // single source of truth — no scroll-spy — so the selection never jumps back.
  const setActive = (activeLink) => {
    tabs.forEach((link) => link.classList.toggle('active', link === activeLink));
    if (activeLink && nav.scrollWidth > nav.clientWidth) {
      activeLink.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };

  links.forEach((a) => {
    const rawId = a.getAttribute('href').slice(1);
    const target = resolveTarget(rawId);
    const link = document.createElement('a');
    // point at the real element id so native anchor navigation also works
    link.href = target ? `#${target.id}` : `#${rawId}`;
    link.textContent = a.textContent.trim();
    link.className = 'anchornav-sticky-item';
    link.addEventListener('click', (e) => {
      setActive(link);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    tabs.push(link);
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

  // Default: the first label in the ribbon is selected.
  setActive(tabs[0] || null);
}
