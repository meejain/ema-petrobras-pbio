import { getMetadata } from '../../scripts/aem.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer fragment: local (aem up) first, then DA/EDS production
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // classify the two top-level sections (primary links + legal/copyright)
  const sections = footer.querySelectorAll(':scope > div');
  if (sections[0]) sections[0].classList.add('footer-primary');
  if (sections[1]) sections[1].classList.add('footer-legal');

  // primary section: build one bounded inner row with three space-between
  // groups — "you are here", the "Acesse também" label + links, and the
  // info-icon / transparency block.
  const primary = sections[0];
  if (primary) {
    const row = document.createElement('div');
    row.className = 'footer-primary-row';

    const paras = primary.querySelectorAll(':scope > p');
    // first <p> = "Você está em", second <p> = "Acesse também" label
    if (paras[0]) paras[0].classList.add('footer-you-are');
    if (paras[1]) paras[1].classList.add('footer-access-label');
    const list = primary.querySelector(':scope > ul');
    if (list) list.classList.add('footer-access-links');

    // group the "Acesse também" label with its list of portal links
    const accessGroup = document.createElement('div');
    accessGroup.className = 'footer-access-group';
    if (paras[1]) accessGroup.append(paras[1]);
    if (list) accessGroup.append(list);

    // info block: icon on the left, then a column of "Acesso à Informação"
    // label + "Portal da Transparência" link on the right.
    const infoPara = [...paras].find((p) => p.querySelector('img'));
    const infoBlock = document.createElement('div');
    infoBlock.className = 'footer-info-block';
    if (infoPara) {
      const img = infoPara.querySelector('img');
      // The authored image path can't be served through the DA document
      // pipeline (it rewrites the src to about:error), so point the footer
      // information icon at the static repo-hosted asset.
      if (img) img.src = '/icons/footer-information.svg';
      const transpPara = infoPara.nextElementSibling;
      const col = document.createElement('div');
      col.className = 'footer-info-texts';
      infoPara.classList.add('footer-info-label');
      col.append(infoPara);
      if (transpPara) col.append(transpPara);
      if (img) infoBlock.append(img);
      infoBlock.append(col);
    }

    if (paras[0]) row.append(paras[0]);
    row.append(accessGroup, infoBlock);
    primary.textContent = '';
    primary.append(row);
  }

  // legal section: mark the links list and copyright
  const legal = sections[1];
  if (legal) {
    const list = legal.querySelector(':scope > ul');
    if (list) list.classList.add('footer-legal-links');
    const copy = legal.querySelector(':scope > p');
    if (copy) copy.classList.add('footer-copyright');
  }

  block.append(footer);
}
