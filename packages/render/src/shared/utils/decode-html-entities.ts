/**
 * Decodes HTML entities in specific contexts where React's SSR escaping
 * causes issues with email clients or CSS processing.
 *
 * This fixes:
 * - `&amp;` in href attributes (breaks click tracking services)
 * - `&gt;`, `&lt;`, `&amp;` in style tags (breaks CSS media queries)
 *
 * @see https://github.com/resend/react-email/issues/1767
 * @see https://github.com/resend/react-email/issues/2841
 */

/**
 * Decodes common HTML entities back to their original characters.
 */
const decodeEntities = (str: string): string => {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
};

/**
 * Decodes HTML entities inside href attribute values.
 * This fixes URLs with query parameters that get escaped by React SSR.
 *
 * Example:
 *   href="https://example.com?a=1&amp;b=2"
 *   becomes
 *   href="https://example.com?a=1&b=2"
 */
const decodeHrefAttributes = (html: string): string => {
  // Match href="..." or href='...'
  return html.replace(
    /href=["']([^"']*)["']/gi,
    (_match, hrefValue: string) => {
      const decoded = hrefValue.replace(/&amp;/g, '&');
      // Preserve the original quote style by checking the match
      const quote = _match.charAt(5);
      return `href=${quote}${decoded}${quote}`;
    },
  );
};

/**
 * Decodes HTML entities inside <style> tags.
 * This fixes CSS media queries that use comparison operators.
 *
 * Example:
 *   @media (width&gt;=48rem)
 *   becomes
 *   @media (width>=48rem)
 */
const decodeStyleTags = (html: string): string => {
  return html.replace(
    /<style([^>]*)>([\s\S]*?)<\/style>/gi,
    (_match, attributes: string, cssContent: string) => {
      const decoded = decodeEntities(cssContent);
      return `<style${attributes}>${decoded}</style>`;
    },
  );
};

/**
 * Post-processes HTML output from React SSR to decode HTML entities
 * in contexts where they cause issues with email clients.
 *
 * @param html - The HTML string from React SSR
 * @returns The HTML with entities decoded in href attributes and style tags
 */
export const decodeHtmlEntities = (html: string): string => {
  let result = html;

  // Decode entities in href attributes
  result = decodeHrefAttributes(result);

  // Decode entities in style tags
  result = decodeStyleTags(result);

  return result;
};
