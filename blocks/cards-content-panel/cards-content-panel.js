// Section icon badges — exact SVGs extracted from the source (pbio.com.br).
// Each is a 48px teal circle (25% opacity) with a dark-grey glyph.
const FLAG_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <rect width="48" height="48" rx="24" fill="currentColor" fill-opacity="0.25"></rect>
  <path d="M15.2587 15.9376C15.1781 16.0076 15.1132 16.0939 15.0686 16.1909C15.024 16.2879 15.0006 16.3934 15 16.5001V32.2501C15 32.449 15.079 32.6398 15.2197 32.7805C15.3603 32.9211 15.5511 33.0001 15.75 33.0001C15.9489 33.0001 16.1397 32.9211 16.2803 32.7805C16.421 32.6398 16.5 32.449 16.5 32.2501V28.1036C19.0116 26.1198 21.1753 27.1895 23.6672 28.4233C25.2047 29.1836 26.8603 30.0029 28.6359 30.0029C29.9419 30.0029 31.3116 29.5576 32.7441 28.3154C32.8247 28.2455 32.8896 28.1591 32.9342 28.0621C32.9788 27.9651 33.0022 27.8597 33.0028 27.7529V16.5001C33.0025 16.3562 32.9607 16.2154 32.8825 16.0945C32.8043 15.9736 32.693 15.8778 32.5618 15.8185C32.4306 15.7592 32.2852 15.7389 32.1428 15.76C32.0004 15.7811 31.8671 15.8428 31.7587 15.9376C29.1337 18.2092 26.91 17.1086 24.3328 15.8326C21.6628 14.5089 18.6356 13.0117 15.2587 15.9376ZM31.5 27.3986C28.9884 29.3823 26.8247 28.3117 24.3328 27.0789C21.9891 25.9211 19.3819 24.6292 16.5 26.2914V16.8554C19.0116 14.8717 21.1753 15.9414 23.6672 17.1742C26.0109 18.332 28.6191 19.6239 31.5 17.9617V27.3986Z" fill="#373737"></path>
</svg>`;

const BUILDING_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <rect width="48" height="48" rx="24" fill="currentColor" fill-opacity="0.25"></rect>
  <g clip-path="url(#ccp_building_clip)"><path d="M24.75 32.2495V14.9996C24.7499 14.8638 24.713 14.7306 24.6432 14.6142C24.5734 14.4978 24.4733 14.4026 24.3536 14.3386C24.2339 14.2746 24.099 14.2443 23.9635 14.2509C23.8279 14.2575 23.6967 14.3008 23.5838 14.3761L16.0838 19.3758C15.9809 19.4444 15.8966 19.5374 15.8383 19.6465C15.7801 19.7556 15.7498 19.8774 15.75 20.0011V32.2495" stroke="#373737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M24.75 20.25H31.5C31.6989 20.25 31.8897 20.329 32.0303 20.4697C32.171 20.6103 32.25 20.8011 32.25 21V32.25" stroke="#373737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.5 32.25H34.5" stroke="#373737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.75 22.5V24" stroke="#373737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.75 22.5V24" stroke="#373737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18.75 27.75V29.25" stroke="#373737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21.75 27.75V29.25" stroke="#373737" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></g>
  <defs><clipPath id="ccp_building_clip"><rect width="24" height="24" fill="white" transform="translate(12 12)"></rect></clipPath></defs>
</svg>`;

const PERCENTAGE_SVG = `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
  <rect width="48" height="48" rx="24" fill="currentColor" fill-opacity="0.25"></rect>
  <path d="M31.2808 17.7784L17.7808 31.2784C17.6401 31.4192 17.4492 31.4982 17.2502 31.4982C17.0512 31.4982 16.8603 31.4192 16.7196 31.2784C16.5789 31.1377 16.4998 30.9468 16.4998 30.7478C16.4998 30.5488 16.5789 30.3579 16.7196 30.2172L30.2196 16.7172C30.3602 16.5764 30.551 16.4973 30.7499 16.4972C30.9488 16.4972 31.1396 16.5761 31.2804 16.7167C31.4211 16.8573 31.5002 17.0481 31.5003 17.247C31.5004 17.4459 31.4215 17.6368 31.2808 17.7775V17.7784ZM16.7383 21.5097C16.1054 20.8766 15.7499 20.0181 15.75 19.1229C15.7501 18.2278 16.1058 17.3693 16.7388 16.7364C17.3719 16.1035 18.2304 15.748 19.1256 15.748C20.0207 15.7481 20.8792 16.1038 21.5121 16.7369C22.145 17.3699 22.5005 18.2284 22.5004 19.1236C22.5004 20.0188 22.1447 20.8772 21.5116 21.5101C20.8786 22.1431 20.0201 22.4986 19.1249 22.4985C18.2297 22.4984 17.3713 22.1427 16.7383 21.5097ZM17.2502 19.1247C17.2505 19.433 17.3267 19.7364 17.4722 20.0082C17.6178 20.28 17.8281 20.5117 18.0845 20.6829C18.3409 20.854 18.6356 20.9592 18.9425 20.9893C19.2493 21.0193 19.5588 20.9732 19.8436 20.8551C20.1283 20.737 20.3796 20.5505 20.5751 20.3121C20.7706 20.0737 20.9043 19.7908 20.9643 19.4884C21.0244 19.186 21.0089 18.8735 20.9194 18.5785C20.8298 18.2835 20.6689 18.0151 20.4508 17.7972C20.1885 17.5349 19.8543 17.3564 19.4904 17.2841C19.1266 17.2119 18.7495 17.2491 18.4069 17.3913C18.0642 17.5334 17.7715 17.7739 17.5656 18.0825C17.3597 18.391 17.2499 18.7537 17.2502 19.1247ZM32.2502 28.8747C32.25 29.6555 31.9791 30.4121 31.4837 31.0156C30.9882 31.619 30.2988 32.032 29.5329 32.1842C28.7671 32.3364 27.9722 32.2183 27.2836 31.8501C26.5951 31.4818 26.0555 30.8863 25.7569 30.1648C25.4582 29.4434 25.4189 28.6407 25.6457 27.8936C25.8725 27.1464 26.3514 26.501 27.0007 26.0673C27.65 25.6337 28.4296 25.4385 29.2066 25.5152C29.9836 25.5919 30.7101 25.9356 31.2621 26.4878C31.5765 26.8005 31.8257 27.1725 31.9953 27.5822C32.1649 27.992 32.2516 28.4312 32.2502 28.8747ZM30.7502 28.8747C30.7503 28.4409 30.6 28.0205 30.3249 27.6851C30.0497 27.3497 29.6668 27.1201 29.2414 27.0354C28.8159 26.9507 28.3743 27.0161 27.9917 27.2205C27.6091 27.4249 27.3092 27.7557 27.1431 28.1564C26.977 28.5572 26.955 29.0031 27.0809 29.4182C27.2067 29.8334 27.4726 30.192 27.8333 30.4331C28.1939 30.6742 28.627 30.7827 29.0587 30.7403C29.4904 30.6978 29.8941 30.507 30.2008 30.2003C30.3755 30.0266 30.514 29.82 30.6083 29.5925C30.7026 29.365 30.7508 29.121 30.7502 28.8747Z" fill="#373737"></path>
</svg>`;

// Source assigns a specific icon per section heading.
const ICON_BY_HEADING = [
  [/ato ou lei/i, FLAG_SVG],
  [/miss[aã]o/i, FLAG_SVG],
  [/composi[cç][aã]o/i, FLAG_SVG],
  [/estatuto/i, BUILDING_SVG],
  [/privacidade/i, BUILDING_SVG],
  [/principais opera/i, PERCENTAGE_SVG],
];

function iconForHeading(text) {
  const match = ICON_BY_HEADING.find(([re]) => re.test(text || ''));
  return match ? match[1] : FLAG_SVG;
}

// Leading download-arrow icon shown before the PDF download link.
const DOWNLOAD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">
  <path d="M222,152v56a14,14,0,0,1-14,14H48a14,14,0,0,1-14-14V152a6,6,0,0,1,12,0v56a2,2,0,0,0,2,2H208a2,2,0,0,0,2-2V152a6,6,0,0,1,12,0Zm-98.24,4.24a6,6,0,0,0,8.48,0l40-40a6,6,0,0,0-8.48-8.48L134,137.51V40a6,6,0,0,0-12,0v97.51L92.24,107.76a6,6,0,0,0-8.48,8.48Z"></path>
</svg>`;

/**
 * loads and decorates the block
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const iconCell = cells[0];
    const bodyCell = cells[1] || iconCell;

    // Second cell = rich-text body (heading, paragraphs, lists, optional link).
    if (bodyCell) {
      bodyCell.className = 'cards-content-panel-card-body';
      // Add a leading download-arrow icon to any PDF download link.
      bodyCell.querySelectorAll('a[href]').forEach((a) => {
        const href = a.getAttribute('href') || '';
        const isDownload = /\.pdf/i.test(href) || /download=true/i.test(href);
        if (isDownload && !a.previousElementSibling?.classList?.contains('cards-content-panel-download-icon')) {
          const p = a.closest('p') || a.parentElement;
          p.classList.add('cards-content-panel-download');
          const icon = document.createElement('span');
          icon.className = 'cards-content-panel-download-icon';
          icon.innerHTML = DOWNLOAD_SVG;
          a.parentElement.insertBefore(icon, a);
        }
      });
    }

    // First cell = icon badge, chosen to match the section heading (source SVGs).
    if (iconCell && iconCell !== bodyCell) {
      iconCell.className = 'cards-content-panel-card-image';
      const headingText = bodyCell.querySelector('h1,h2,h3,h4')?.textContent || '';
      iconCell.innerHTML = iconForHeading(headingText);
    }
  });
}
