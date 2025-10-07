/**
 * Decodes specific HTML entities in href and style attributes
 * This is necessary because React's rendering encodes characters like ampersands
 * in attribute values, which can break:
 * - Links with query parameters (e.g., ?param1=value1&param2=value2)
 * - CSS font-family declarations with quotes
 *
 * Note: We only decode safe entities and avoid decoding &lt; and &gt; to prevent
 * breaking HTML structure. Quotes are only decoded in style attributes to avoid
 * breaking href attribute syntax.
 */
export const decodeAttributeEntities = (html: string): string => {
  const decodeHrefValue = (value: string): string => {
    // Only decode ampersands in hrefs to fix URL query parameters
    // Do NOT decode quotes to avoid breaking the attribute syntax
    return value.replace(/&amp;/g, '&');
  };

  const decodeStyleValue = (value: string): string => {
    // Decode quotes and ampersands in style attributes
    // This is safe because CSS can contain quoted strings (e.g., font-family)
    return value
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'");
  };

  return html
    .replace(/href="([^"]*)"/g, (_match, hrefContent) => {
      return `href="${decodeHrefValue(hrefContent)}"`;
    })
    .replace(/style="([^"]*)"/g, (_match, styleContent) => {
      return `style="${decodeStyleValue(styleContent)}"`;
    });
};
