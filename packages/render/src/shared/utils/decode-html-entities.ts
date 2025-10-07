/**
 * Decodes specific HTML entities in href and style attributes
 * This is necessary because React's rendering encodes characters like ampersands
 * in attribute values, which can break:
 * - Links with query parameters (e.g., ?param1=value1&param2=value2)
 * - CSS font-family declarations with quotes
 *
 * Note: We only decode safe entities (quotes and ampersands) and avoid decoding
 * &lt; and &gt; to prevent breaking HTML structure
 */
export const decodeAttributeEntities = (html: string): string => {
  const decodeAttributeValue = (value: string): string => {
    return value
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'");
  };

  return html
    .replace(/href="([^"]*)"/g, (_match, hrefContent) => {
      return `href="${decodeAttributeValue(hrefContent)}"`;
    })
    .replace(/style="([^"]*)"/g, (_match, styleContent) => {
      return `style="${decodeAttributeValue(styleContent)}"`;
    });
};
