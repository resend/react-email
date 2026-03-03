/**
 * Basic URL validation and auto-prefixing.
 * Returns the valid URL string or null.
 */
export function getUrlFromString(str: string): string | null {
  if (str === '#') {
    return str;
  }

  try {
    new URL(str);
    return str;
  } catch {
    // not a valid URL as-is
  }

  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch {
    // still not valid
  }

  return null;
}
