/**
 * Sticky in-page anchor navigation.
 * Authored as a block containing links whose hrefs are in-page fragments
 * (e.g. #estatuto-social). Renders a horizontal, scrollable bar with left/right
 * scroll controls, smooth-scrolls to the target on click, and marks the link
 * for the section currently in view as active.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const links = [...block.querySelectorAll('a[href^="#"]')];

  const nav = document.createElement('nav');
  nav.className = 'anchornav-sticky-menu';
  nav.setAttribute('aria-label', 'In-page navigation');

  const itemsById = new Map();

  links.forEach((a) => {
    const id = a.getAttribute('href').slice(1);
    const link = document.createElement('a');
    link.href = a.getAttribute('href');
    link.textContent = a.textContent.trim();
    link.className = 'anchornav-sticky-item';
    link.addEventListener('click', (e) => {
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    itemsById.set(id, link);
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

  // Scroll-spy: highlight the link whose target section is currently in view.
  const setActive = (id) => {
    itemsById.forEach((link, linkId) => {
      link.classList.toggle('active', linkId === id);
    });
    // keep the active item visible within the horizontal scroller
    const active = itemsById.get(id);
    if (active && nav.scrollWidth > nav.clientWidth) {
      active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  };

  const targets = [...itemsById.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (targets.length) {
    const visible = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.add(entry.target.id);
        else visible.delete(entry.target.id);
      });
      // pick the first (topmost) target currently in view
      const current = targets.find((t) => visible.has(t.id));
      if (current) setActive(current.id);
    }, { rootMargin: '-56px 0px -60% 0px', threshold: 0 });
    targets.forEach((t) => observer.observe(t));
    // default the first link to active on load
    setActive(targets[0].id);
  }
}
