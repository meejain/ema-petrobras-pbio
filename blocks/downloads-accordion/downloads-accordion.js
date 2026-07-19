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
 * Downloads Accordion block — a document picker matching the source behavior:
 *   - A selector box shows a placeholder prompt ("Selecione por produto…").
 *   - Clicking it reveals a scrollable panel of document download links.
 *   - Selecting a document collapses the panel, shows the chosen document's
 *     name in the selector, and enables a separate round download button that
 *     links to (and downloads) the selected file.
 * Content model: first row = the placeholder prompt (single cell, no link);
 * each subsequent row = one document (single cell containing a link).
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];
  // First row without a link is the placeholder prompt.
  let promptText = 'Selecione o arquivo';
  if (rows[0] && !rows[0].querySelector('a')) {
    promptText = rows[0].textContent.trim() || promptText;
    rows.shift();
  }
  const links = rows.map((r) => r.querySelector('a')).filter(Boolean);
  if (!links.length) {
    block.replaceChildren();
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'downloads-accordion-picker';

  const details = document.createElement('details');
  details.className = 'downloads-accordion-dropdown';

  const summary = document.createElement('summary');
  summary.className = 'downloads-accordion-selected';
  const summaryText = document.createElement('span');
  summaryText.className = 'downloads-accordion-label downloads-accordion-placeholder';
  summaryText.textContent = promptText;
  summary.append(summaryText);

  const panel = document.createElement('div');
  panel.className = 'downloads-accordion-list';

  // The download button: disabled until a document is chosen.
  const downloadBtn = document.createElement('a');
  downloadBtn.className = 'downloads-accordion-download';
  downloadBtn.setAttribute('aria-label', 'Baixar documento selecionado');
  downloadBtn.setAttribute('aria-disabled', 'true');
  downloadBtn.append(makeIcon());

  links.forEach((link) => {
    const item = document.createElement('div');
    item.className = 'downloads-accordion-item';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'downloads-accordion-option';
    trigger.append(makeIcon());
    const label = document.createElement('span');
    label.textContent = link.textContent.trim();
    trigger.append(label);
    trigger.addEventListener('click', () => {
      summaryText.textContent = link.textContent.trim();
      summaryText.classList.remove('downloads-accordion-placeholder');
      downloadBtn.href = link.getAttribute('href');
      downloadBtn.setAttribute('download', '');
      downloadBtn.removeAttribute('aria-disabled');
      downloadBtn.classList.add('is-active');
      details.open = false;
    });
    item.append(trigger);
    panel.append(item);
  });

  details.append(summary, panel);
  wrapper.append(details, downloadBtn);
  block.replaceChildren(wrapper);
}
