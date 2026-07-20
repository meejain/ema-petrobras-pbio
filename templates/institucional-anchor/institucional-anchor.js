/**
 * Template: institucional-anchor
 * Decorates standalone document (PDF) links in the content area with a leading
 * download icon — matching the source, where every downloadable link shows the
 * cyan download glyph. Links already inside a downloads-accordion block are
 * skipped (that block renders its own icons).
 * @param {Element} main
 */
export default function decorate(main) {
  const links = main.querySelectorAll('a[href*="/documents/"], a[href$="download=true"], a[href*="?download"]');
  links.forEach((a) => {
    // Blocks that render their own download icon: skip so we don't double-icon.
    if (a.closest('.downloads-accordion, .downloads-link, .cards-content-panel')) return;
    if (a.previousElementSibling?.classList?.contains('institucional-download-icon')) return;
    const icon = document.createElement('span');
    icon.className = 'institucional-download-icon';
    const img = document.createElement('img');
    img.src = '/icons/download.svg';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.width = 24;
    img.height = 24;
    icon.append(img);
    a.parentElement.insertBefore(icon, a);
    a.parentElement.classList.add('institucional-download-link');
  });
}
