/**
 * Template: acesso-informacao-hub
 * Builds the left-nav sidebar layout. The first section (hero) spans full
 * width. The section carrying the navigation fragment becomes a left sidebar;
 * all remaining content sections go into the right-hand content column. Both
 * are wrapped in a grid container (.aih-layout).
 * @param {Element} main
 */
export default function decorate(main) {
  // Local preview gotcha: the dev server runs with --html-folder content, so
  // fragments only resolve under /content/fragments/... locally. The authored
  // content uses the production path /fragments/...; rewrite it for localhost
  // before the fragment block fetches it. Production content stays unchanged.
  if (window.location.hostname === 'localhost') {
    main.querySelectorAll('.fragment a[href^="/fragments/"]').forEach((a) => {
      a.setAttribute('href', `/content${a.getAttribute('href')}`);
      if (a.textContent.startsWith('/fragments/')) a.textContent = `/content${a.textContent}`;
    });
  }

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

  layout.append(sidebar, content);
  main.append(layout);
}
