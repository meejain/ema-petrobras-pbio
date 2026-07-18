/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: pbio (Petrobras Biocombustivel) section breaks + section metadata.
 *
 * The institucional-page template defines 9 sections. This transformer inserts
 * a section break (<hr>) before every section except the first, and a
 * Section Metadata block for every section that carries a `style`.
 *
 * Runs in beforeTransform: the block parsers replace the section container
 * elements (their instance selectors are the same as these section selectors),
 * so querying for them afterTransform would find nothing. Inserting the <hr>
 * and Section Metadata blocks as siblings before parsing lets them survive the
 * parsers' replaceWith. Section selectors come from payload.template.sections
 * (derived from captured DOM in page-templates.json), never guessed.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const sections = (payload && payload.template && payload.template.sections) || [];
    if (!sections.length) return;

    // Process in reverse so earlier inserts do not shift later section anchors.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Section Metadata block for sections that declare a style.
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(element.ownerDocument || document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Section break before every section except the first.
      if (i > 0) {
        const hr = (element.ownerDocument || document).createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
