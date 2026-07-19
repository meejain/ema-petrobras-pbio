/**
 * Some embedded providers restrict framing to an allow-list of origins via a
 * `frame-ancestors` Content Security Policy they serve themselves. The Petrobras
 * transparency calendar (Agenda de Autoridades) only permits the production
 * `pbio.com.br` origin — framing it from the preview/live AEM domains is blocked
 * by the browser and logs a CSP violation. When we are not on an allowed origin
 * we render a fallback link instead of a blank, error-logging iframe.
 * @param {string} url the URL to be embedded
 * @returns {boolean} true if the current origin may frame the URL
 */
function canFrame(url) {
  if (!/petrobras\.com\.br/i.test(url)) return true;
  return /(^|\.)pbio\.com\.br$/i.test(window.location.hostname);
}

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

  if (!canFrame(url)) {
    wrapper.classList.add('embed-fallback');
    const fallback = document.createElement('a');
    fallback.href = url;
    fallback.target = '_blank';
    fallback.rel = 'noopener';
    fallback.className = 'embed-fallback-link';
    const isUrlTitle = /^https?:\/\//i.test(title);
    fallback.textContent = (title === 'Embedded content' || isUrlTitle)
      ? 'Abrir conteúdo em nova aba' : title;
    wrapper.append(fallback);
    block.replaceChildren(wrapper);
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.title = title;
  iframe.loading = 'lazy';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

  wrapper.append(iframe);
  block.replaceChildren(wrapper);
}
