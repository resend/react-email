const ATTRIBUTE_NAME_START_CHAR =
  ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
export const ATTRIBUTE_NAME_CHAR: string =
  ATTRIBUTE_NAME_START_CHAR + '\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040';

const VALID_ATTRIBUTE_NAME_REGEX: RegExp = new RegExp(
  '^[' + ATTRIBUTE_NAME_START_CHAR + '][' + ATTRIBUTE_NAME_CHAR + ']*$',
);

const illegalAttributeNameCache: Record<string, boolean> = {};
const validatedAttributeNameCache: Record<string, boolean> = {};

export function isAttributeNameSafe(attributeName: string): boolean {
  if (Object.hasOwn(validatedAttributeNameCache, attributeName)) {
    return true;
  }
  if (Object.hasOwn(illegalAttributeNameCache, attributeName)) {
    return false;
  }
  if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
    validatedAttributeNameCache[attributeName] = true;
    return true;
  }
  illegalAttributeNameCache[attributeName] = true;
  console.error('Invalid attribute name: `%s`', attributeName);
  return false;
}

