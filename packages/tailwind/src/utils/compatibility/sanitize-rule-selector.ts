import { sanitizeClassName } from "./sanitize-class-name";
import { unescapeClass } from "./unescape-class";

export function sanitizeRuleSelector(classSelector: string) {
  const unescapedClass = unescapeClass(classSelector);

  return sanitizeClassName(unescapedClass);
}
