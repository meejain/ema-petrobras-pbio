function makeIcon() {
  const icon = document.createElement('span');
  icon.className = 'icon icon-download';
  const img = document.createElement('img');
  img.src = '/icons/download.svg';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  img.width = 24;
  img.height = 24;
  icon.append(img);
  return icon;
}

/**
 * Downloads Accordion block.
 * A dropdown-style document library: a selector shows the first document and,
 * when toggled, reveals a scrollable panel listing all document download links.
 * Content model: each row = one document (single cell containing a link).
 * @param {Element} block
 */
export default function decorate(block) {
  const links = [...block.querySelectorAll(':scope > div a')];

  const details = document.createElement('details');
  details.className = 'downloads-accordion-dropdown';

  const summary = document.createElement('summary');
  summary.className = 'downloads-accordion-selected';
  const summaryText = document.createElement('span');
  summaryText.className = 'downloads-accordion-label';
  summaryText.textContent = links[0]
    ? links[0].textContent.trim()
    : 'Selecione o arquivo';
  summary.append(makeIcon(), summaryText);

  const panel = document.createElement('div');
  panel.className = 'downloads-accordion-list';
  links.forEach((link) => {
    const item = document.createElement('div');
    item.className = 'downloads-accordion-item';
    item.append(makeIcon(), link);
    panel.append(item);
  });

  details.append(summary, panel);
  block.replaceChildren(details);
}
