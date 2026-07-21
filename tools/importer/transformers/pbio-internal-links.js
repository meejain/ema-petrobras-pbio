/* eslint-disable */
/* global WebImporter */
/**
 * Transformer: relativize internal site page links.
 *
 * The source markup hard-codes the site origin on internal navigation links
 * (e.g. `https://pbio.com.br/institucional`). On the migrated site those must
 * be root-relative (`/institucional`) so they route within the deployed EDS
 * site instead of bouncing back to the source domain.
 *
 * Scope (deliberately narrow):
 *  - Rewrites `https://<SITE_HOST>` and `https://<SITE_HOST>/<path>` to `/` and
 *    `/<path>` respectively.
 *  - Skips `/documents/*` links — those are asset/PDF links handled separately
 *    by pbio-asset-links.js (mirrored to /assets/...).
 *  - Leaves every OTHER host untouched (petrobras.com.br, cgu.gov.br, the
 *    Liferay backend host, etc.) — those are genuinely external.
 *
 * SITE_HOST is the public production host of the site being migrated. For a
 * subsidiary migration, change this one constant (e.g. 'pben.com.br').
 *
 * Runs in afterTransform so it catches links inside already-parsed blocks as
 * well as default content.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

const SITE_HOST = 'pbio.com.br';

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;
  const originRe = new RegExp(`^https?://(www\\.)?${SITE_HOST.replace(/\./g, '\\.')}`, 'i');
  element.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (!originRe.test(href)) return;
    const path = href.replace(originRe, '');
    // Leave document/asset links for the asset-links transformer to rewrite.
    if (/^\/documents\//i.test(path)) return;
    a.setAttribute('href', path === '' ? '/' : path);
  });
}
