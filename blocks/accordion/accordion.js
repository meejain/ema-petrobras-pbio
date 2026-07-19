/**
 * Accordion block.
 * Each row models one accordion item:
 *   - first cell: the summary/label (heading or link)
 *   - second cell: the panel body (sub-links list or rich content)
 * Variants:
 *   - navigation: vertical side-nav of collapsible sections with sub-links.
 *     Supports multi-level submenus: any <li> that contains a nested <ul>
 *     becomes a collapsible sub-level with its own chevron.
 *   - nested: document/content library accordions
 *   - downloads: modifier — prefix body links with a download icon
 * @param {Element} block
 */

/**
 * Recursively converts nested <ul>/<li> structures into collapsible sub-levels.
 * Any <li> that directly contains a child <ul> is turned into a <details> with
 * a chevron; leaf items are left as plain links.
 * @param {HTMLElement} list the <ul> to process
 */
function decorateSubLevels(list) {
  [...list.children].forEach((li) => {
    const childList = li.querySelector(':scope > ul');
    if (!childList) return;

    // recurse first so deeper levels are decorated
    decorateSubLevels(childList);

    const link = li.querySelector(':scope > a');
    const details = document.createElement('details');
    details.className = 'accordion-subitem';

    const summary = document.createElement('summary');
    summary.className = 'accordion-subitem-label';
    if (link) {
      // clicking the link navigates; only the rest of the row toggles
      link.addEventListener('click', (e) => e.stopPropagation());
      summary.append(link);
    } else {
      // no link: use the li's leading text node(s) as the label
      const text = document.createElement('span');
      [...li.childNodes].forEach((n) => {
        if (n !== childList && n.nodeName !== 'UL') text.append(n);
      });
      summary.append(text);
    }

    const panel = document.createElement('div');
    panel.className = 'accordion-subitem-body';
    panel.append(childList);

    li.replaceChildren(details);
    details.append(summary, panel);

    if (link && link.classList.contains('active')) details.open = true;
  });
}

export default function decorate(block) {
  const isSingle = block.classList.contains('single-select');
  const isDownloads = block.classList.contains('downloads');
  const isNavigation = block.classList.contains('navigation');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const label = cells[0];
    const body = cells[1];

    const details = document.createElement('details');
    details.className = 'accordion-item';

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    // preserve an existing link as the label, otherwise use plain content
    while (label.firstChild) summary.append(label.firstChild);

    const content = document.createElement('div');
    content.className = 'accordion-item-body';
    if (body) {
      while (body.firstChild) content.append(body.firstChild);
    }

    // navigation variant: wire up multi-level nested submenus with chevrons
    if (isNavigation) {
      content.querySelectorAll(':scope > ul').forEach((list) => decorateSubLevels(list));
    }

    // downloads variant: prefix each document link with a download icon
    if (isDownloads) {
      content.querySelectorAll('li > a').forEach((link) => {
        const icon = document.createElement('span');
        icon.className = 'icon icon-download';
        const img = document.createElement('img');
        img.src = '/icons/download.svg';
        img.alt = '';
        img.setAttribute('aria-hidden', 'true');
        img.width = 24;
        img.height = 24;
        icon.append(img);
        link.parentElement.prepend(icon);
      });
    }

    // start expanded if the source marks this item active
    if (summary.querySelector('a.active, .active') || label.classList.contains('active')) {
      details.open = true;
    }

    details.append(summary, content);
    row.replaceWith(details);
  });

  // single-select: opening one item closes the others (top level only)
  if (isSingle) {
    const items = [...block.children].filter((c) => c.matches('details.accordion-item'));
    items.forEach((item) => {
      item.addEventListener('toggle', () => {
        if (item.open) {
          items.filter((i) => i !== item && i.open).forEach((i) => { i.open = false; });
        }
      });
    });
  }
}
