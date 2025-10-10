/**
 * Decodes HTML entities in href attributes
 * This is necessary because React's rendering encodes characters like ampersands
 * in attribute values, which can break links with query parameters
 * (e.g., ?param1=value1&param2=value2)
 *
 * Note: We only decode safe entities and avoid decoding &lt; and &gt; to prevent
 * breaking HTML structure.
 */
export const decodeAttributeEntities = (html: string): string => {
  const decodeHrefValue = (value: string): string => {
    // Only decode ampersands in hrefs to fix URL query parameters
    // Do NOT decode quotes to avoid breaking the attribute syntax
    return value.replace(/&amp;/g, '&');
  };

  // Match href attributes carefully to avoid breaking HTML structure
  // Use a regex that matches the attribute name, =, opening quote, content, closing quote
  return html.replace(/\bhref="([^"]*)"/g, (_match, hrefContent) => {
    return `href="${decodeHrefValue(hrefContent)}"`;
  });
};
