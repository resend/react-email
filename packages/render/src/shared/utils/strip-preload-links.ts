/**
 * Strips auto-injected image preload links from rendered HTML.
 *
 * React 19's server renderer automatically injects preload links for every
 * `<img>` it encounters during SSR:
 *
 *   - `<img src="X">`       → `<link rel="preload" as="image" href="X" />`
 *   - `<img srcset="X 1x">` → `<link rel="preload" as="image" imagesrcset="X 1x" />`
 *
 * These are useful for web pages but unnecessary in email HTML, where they add
 * noise and are ignored by email clients.
 *
 * To avoid removing preload links that the template author added intentionally
 * (e.g., font or script preloads, or image preloads for resources not rendered
 * via `<img>`), we only strip image preloads whose href/imagesrcset matches an
 * `<img src>`/`<img srcset>` found in the document.
 *
 * Known limitation: if a template author explicitly adds
 * `<link rel="preload" as="image" href="X">` inside `<Head>` for the exact
 * same `X` that also appears as an `<img src="X">`, it will be stripped.
 * This is acceptable because image preloads are not supported by email clients
 * and have no effect in rendered emails.
 */
export const stripAutoInjectedImagePreloads = (html: string): string => {
  // Collect every <img src="..."> and <img srcset="..."> in the document.
  const imgSrcs = new Set<string>();
  const imgSrcSets = new Set<string>();

  const imgPattern = /<img\b[^>]*?\/?>/gi;
  let imgMatch: RegExpExecArray | null;
  while ((imgMatch = imgPattern.exec(html)) !== null) {
    const tag = imgMatch[0];

    const srcMatch = /\bsrc=["']([^"']+)["']/i.exec(tag);
    if (srcMatch) {
      imgSrcs.add(srcMatch[1]!);
    }

    const srcSetMatch = /\bsrcset=["']([^"']+)["']/i.exec(tag);
    if (srcSetMatch) {
      imgSrcSets.add(srcSetMatch[1]!);
    }
  }

  if (imgSrcs.size === 0 && imgSrcSets.size === 0) return html;

  // Remove only <link rel="preload" as="image"> whose href or imagesrcset
  // matches a rendered <img> — these are the ones React 19 auto-injects.
  return html.replace(
    /<link[^>]*?\s+rel="preload"[^>]*?\/?>/gi,
    (tag) => {
      const isImage = /\bas=["']image["']/i.test(tag);
      if (!isImage) return tag;

      // React 19 emits href-based preloads for <img src>.
      const hrefMatch = /\bhref=["']([^"']+)["']/i.exec(tag);
      if (hrefMatch && imgSrcs.has(hrefMatch[1]!)) {
        return '';
      }

      // React 19 emits imagesrcset-based preloads for <img srcset>.
      const imgSrcSetMatch = /\bimagesrcset=["']([^"']+)["']/i.exec(tag);
      if (imgSrcSetMatch && imgSrcSets.has(imgSrcSetMatch[1]!)) {
        return '';
      }

      return tag;
    },
  );
};
