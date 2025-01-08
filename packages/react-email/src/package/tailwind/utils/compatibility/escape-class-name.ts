/**
 * Escapes all characters that may not be accepted on
 * CSS selectors by using the regex "[^a-zA-Z0-9\-_]".
 *
 * Also does a bit more trickery to avoid escaping already
 * escaped characters.
 */
export const escapeClassName = (className: string) => {
  return className.replace(
    /*      we need this look ahead capturing group to avoid using negative look behinds */
    /([^\\]|^)(?=([^a-zA-Z0-9\-_]))/g,
    (match, prefixCharacter: string, characterToEscape: string) => {
      if (prefixCharacter === '' && characterToEscape === '\\') return match;

      return `${prefixCharacter}\\`;
    },
  );
};
