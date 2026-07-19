/**
 * Embed block — embeds an external URL as a responsive iframe.
 * Content model: one cell containing a link (the URL to embed). An optional
 * second cell / `data-` aspect can set a fixed height; by default the iframe
 * uses the height captured from the source (via the `fixed-height` variant +
 * inline style set by the parser, or a 16:9 responsive ratio otherwise).
 * @param {Element} block
 */
export default function decorate(block) {
  const link = block.querySelector('a[href]');
  const url = link ? link.getAttribute('href') : block.textContent.trim();
  if (!url) return;

  const title = link?.getAttribute('title') || 'Embedded content';

  const wrapper = document.createElement('div');
  wrapper.className = 'embed-frame';

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

  wrapper.append(iframe);
  block.replaceChildren(wrapper);
}
