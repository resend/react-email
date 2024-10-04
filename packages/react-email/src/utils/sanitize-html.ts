export function sanitizeHtml(html: string): string {
  // Replace HTML entities for single and double quotes in any context
  return html.replace(/(&quot;|&#x27;|&#39;)/g, (match) => {
    switch (match) {
      case '&quot;':
        return '"';
      case '&#x27;':
      case '&#39;':
        return "'";
      default:
        return match;
    }
  });
}
