const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/**
 * Escapes text so it shows up as-is inside HTML, the same way
 * marked's default renderers escape code.
 */
export const escapeHtml = (text: string) =>
  text.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char);
