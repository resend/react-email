const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

export const isSafeUrl = (url: string): boolean => {
  if (url === '#' || url === '') {
    return true;
  }

  try {
    const parsed = new URL(url);
    return SAFE_PROTOCOLS.has(parsed.protocol);
  } catch {
    return (
      !url.trimStart().toLowerCase().startsWith('javascript:') &&
      !url.trimStart().toLowerCase().startsWith('data:') &&
      !url.trimStart().toLowerCase().startsWith('vbscript:')
    );
  }
};
