/**
 * Template: acesso-informacao-hub
 * Builds the left-nav sidebar layout. The first section (hero) spans full
 * width. The section carrying the navigation fragment becomes a left sidebar;
 * all remaining content sections go into the right-hand content column. Both
 * are wrapped in a grid container (.aih-layout).
 * @param {Element} main
 */
export default function decorate(main) {
  const sections = [...main.querySelectorAll(':scope > .section')];
  if (sections.length < 2) return;

  // Hero is the first section — leave it full-width and untouched.
  const [, ...rest] = sections;

  // The nav section is the one holding the navigation fragment link/block.
  const navSection = rest.find((s) => s.querySelector(
    '.fragment, a[href*="/fragments/"], .accordion.navigation',
  )) || rest[0];

  const contentSections = rest.filter((s) => s !== navSection);

  const layout = document.createElement('div');
  layout.className = 'aih-layout';

  const sidebar = document.createElement('div');
  sidebar.className = 'aih-sidebar';
  sidebar.append(navSection);

  const content = document.createElement('div');
  content.className = 'aih-content';
  contentSections.forEach((s) => content.append(s));

  // The page title (first heading in the content column) is rendered teal in
  // the source, while the section sub-headings below it stay grey.
  const pageTitle = content.querySelector('h1, h2, h3, h4, h5, h6');
  if (pageTitle) pageTitle.classList.add('aih-page-title');

  layout.append(sidebar, content);
  main.append(layout);
}
