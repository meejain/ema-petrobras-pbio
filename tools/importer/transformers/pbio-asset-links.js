/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: rewrite Liferay document links to self-hosted DA assets.
 *
 * Source PDFs live at pbio.com.br/documents/<folder>/<id>/<file>.pdf/<uuid>?...
 * We mirror them into the project under content/assets/documents/<folder>/<id>/
 * <file>.pdf (served at /assets/documents/... in EDS). This transformer rewrites
 * every /documents/*.pdf link's href to the local /assets path, stripping the
 * trailing Liferay UUID segment and query string so it matches the mirrored
 * asset filename.
 *
 * Runs in afterTransform so it catches links inside already-parsed blocks
 * (downloads-accordion, accordion-nested) as well as default content.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;
  // Map a source document href to its mirrored /assets path:
  // `/documents/29533774/29536153/File.pdf/uuid?version=1&download=true`
  //   -> `/assets/documents/29533774/29536153/File.pdf`
  // Normalize the asset path to an AEM-friendly slug. The AEM preview/live
  // pipeline cannot serve paths containing `+` (spaces), `%XX` (percent-encoded
  // accents), OR multiple dots in a filename (it treats the last dot-segment as
  // the extension). So we slugify each segment: decode %XX, strip diacritics,
  // lowercase, collapse non [a-z0-9] runs to a single hyphen, and for the final
  // filename keep exactly ONE dot (the extension). The upload step applies the
  // SAME slugify so links and hosted files match.
  const slugifyWord = (s) => s
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const slugifySegment = (seg, isFile) => {
    let s = seg;
    try { s = decodeURIComponent(seg); } catch (e) { /* keep raw */ }
    if (!isFile) return slugifyWord(s);
    // filename: separate the real extension, slugify the rest (dots -> hyphens)
    const dot = s.lastIndexOf('.');
    const name = dot > 0 ? s.slice(0, dot) : s;
    const ext = dot > 0 ? s.slice(dot + 1) : '';
    const base = slugifyWord(name);
    return ext ? `${base}.${slugifyWord(ext)}` : base;
  };
  const toAssetPath = (href) => {
    if (!href) return null;
    const path = href.replace(/^https?:\/\/[^/]+/, '');
    if (!path.startsWith('/documents/')) return null;
    const m = path.match(/^(\/documents\/.*?\.pdf)/i);
    if (!m) return null;
    const parts = m[1].split('/');
    const slug = parts.map((seg, i) => (seg ? slugifySegment(seg, i === parts.length - 1) : seg)).join('/');
    return `/assets${slug}`;
  };
  element.querySelectorAll('a[href*="/documents/"]').forEach((a) => {
    const asset = toAssetPath(a.getAttribute('href') || '');
    if (asset) a.setAttribute('href', asset);
  });
}
