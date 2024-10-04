export const sanitizeHtml = (html: string): string => {
  return html
    .replace(/(?:['"])javascript:/gi, '$&unsupported:')
    .replace(/(?:['"])vbscript:/gi, '$&unsupported:')
    .replace(/(?:['"])data:/gi, '$&unsupported:')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(
      /onclick|onload|onerror|onmouseover|onmouseout|onmousedown|onmouseup|onkeydown|onkeypress|onkeyup/gi,
      'unsupported-event',
    );
};
