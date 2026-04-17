const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

const UNSAFE_SCHEMES = new Set(['javascript:', 'data:', 'vbscript:']);

const extractScheme = (url: string): string | undefined => {
  const match = /^[\s]*([a-z][a-z0-9+\-.]*:)/i.exec(url);
  return match?.[1]?.toLowerCase();
};

export const isSafeUrl = (url: string): boolean => {
  if (url === '#' || url === '') {
    return true;
  }

  const scheme = extractScheme(url);

  if (scheme === undefined) {
    return true;
  }

  if (UNSAFE_SCHEMES.has(scheme)) {
    return false;
  }

  return SAFE_PROTOCOLS.has(scheme);
};
