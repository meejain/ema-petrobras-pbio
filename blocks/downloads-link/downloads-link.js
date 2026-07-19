/**
 * Downloads Link block.
 * A single downloadable-document link, prefixed with a download icon.
 * Content model: one row, one cell containing a link (the document href + label).
 * @param {Element} block
 */
export default function decorate(block) {
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const link = cell.querySelector('a');
    if (!link) return;

    const item = document.createElement('div');
    item.className = 'downloads-link-item';

    const icon = document.createElement('span');
    icon.className = 'icon icon-download';
    const img = document.createElement('img');
    img.src = '/icons/download.svg';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.width = 24;
    img.height = 24;
    icon.append(img);

    item.append(icon, link);
    cell.replaceChildren(item);
  });
}
