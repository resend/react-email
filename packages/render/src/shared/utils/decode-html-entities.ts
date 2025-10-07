import { decode } from 'html-entities';

/**
 * Decodes HTML entities in href and style attributes
 * This is necessary because React's rendering encodes characters like ampersands
 * in attribute values, which can break:
 * - Links with query parameters (e.g., ?param1=value1&param2=value2)
 * - CSS font-family declarations with quotes
 * - Other special characters in attributes
 */
export const decodeAttributeEntities = (html: string): string => {
  return html
    .replace(/href="([^"]*)"/g, (match, hrefContent) => {
      const decoded = decode(hrefContent);
      return `href="${decoded}"`;
    })
    .replace(/style="([^"]*)"/g, (match, styleContent) => {
      const decoded = decode(styleContent);
      return `style="${decoded}"`;
    });
};
