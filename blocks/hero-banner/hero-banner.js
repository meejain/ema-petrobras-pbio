export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }

  // The content cell holds a breadcrumb paragraph (a "Root > Current" line)
  // above the title heading. Tag the first paragraph if it precedes the heading.
  const contentCell = block.querySelector(':scope > div:last-child > div');
  const heading = contentCell?.querySelector('h1, h2, h3');
  const firstPara = contentCell?.querySelector('p');
  if (firstPara && heading) {
    const followsPara = firstPara.compareDocumentPosition(heading)
      === Node.DOCUMENT_POSITION_FOLLOWING;
    if (followsPara) firstPara.classList.add('hero-banner-breadcrumb');
  }
}
