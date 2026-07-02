/**
 * React injects `<link rel="preload" as="image" />` resource hints into the
 * document `<head>` for every `<img>` it renders during server-side rendering.
 *
 * These hints are meant for browsers loading a web page, where they can speed
 * up the initial paint. In an email they are dead weight: email clients ignore
 * `<link rel="preload">`, and the tags only add noise to the rendered HTML.
 *
 * @see https://github.com/resend/react-email/issues/3034
 *
 * This removes only those auto-injected image preload links, leaving every
 * other `<link>` (stylesheets, fonts, user-authored non-image preloads, ...)
 * untouched. It parses each `<link>` tag's attributes instead of relying on a
 * fixed string match, so it is not affected by attribute order or spacing.
 */
export const stripImagePreloadLinks = (html: string): string => {
  return html.replace(/<link\b[^>]*\/?>/gi, (tag) =>
    isImagePreloadLink(tag) ? '' : tag,
  );
};

const isImagePreloadLink = (tag: string): boolean => {
  const attributes = parseAttributes(tag);
  return attributes.rel === 'preload' && attributes.as === 'image';
};

const ATTRIBUTE_PATTERN =
  /([a-z][a-z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/gi;

/**
 * Parses the attributes of a single, already-isolated HTML tag string (e.g.
 * `<link rel="preload" as="image" href="..." />`) into a name → value map.
 * Attribute names are lower-cased; values are read from double, single, or
 * unquoted forms.
 */
const parseAttributes = (tag: string): Record<string, string> => {
  // Skip the tag name (`<link`) so it is not read as an attribute.
  const attributeSection = tag.replace(/^<[a-z][a-z0-9-]*/i, '');

  const attributes: Record<string, string> = {};
  for (const [
    ,
    name,
    doubleQuoted,
    singleQuoted,
    unquoted,
  ] of attributeSection.matchAll(ATTRIBUTE_PATTERN)) {
    attributes[name.toLowerCase()] =
      doubleQuoted ?? singleQuoted ?? unquoted ?? '';
  }

  return attributes;
};
