/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: inject the shared "Acesso a Informacao" navigation fragment.
 *
 * The Acesso a Informacao hub pages render a left-hand section navigation that
 * on the source is site chrome (Liferay menubar). In EDS we author it ONCE as a
 * shared fragment (content/fragments/acesso-a-informacao-nav) and reference it
 * on each page via a `fragment` block. The acesso-informacao-hub page template
 * (templates/acesso-informacao-hub) then moves that section into the sidebar.
 *
 * This transformer, in afterTransform, prepends a section break + a `fragment`
 * block pointing at the nav fragment, so the block lands in <main> as the first
 * content section after the hero. The template JS relocates it to the sidebar
 * at render time.
 *
 * Fragment path note: locally the dev server runs with --html-folder content,
 * so fragments resolve under /content/fragments/...; in production the path is
 * /fragments/... . We emit the production path; adjust for local preview.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

const FRAGMENT_PATH = '/fragments/acesso-a-informacao-nav';

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const doc = element.ownerDocument || document;

  const link = doc.createElement('a');
  link.setAttribute('href', FRAGMENT_PATH);
  link.textContent = FRAGMENT_PATH;

  const fragmentBlock = WebImporter.Blocks.createBlock(doc, {
    name: 'fragment',
    cells: [[link]],
  });

  // Insert the nav fragment + a section break right after the hero (first
  // top-level child of main). If there is no first child, just prepend.
  const hero = element.firstElementChild;
  if (hero) {
    const hr = doc.createElement('hr');
    hero.after(hr);
    hr.after(fragmentBlock);
  } else {
    element.prepend(fragmentBlock);
  }
}
