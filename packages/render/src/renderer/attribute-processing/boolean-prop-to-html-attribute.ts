import type { PropValue } from "./prop-to-html-attribute";

export function booleanPropToHtmlAttribute(name: string, value: PropValue) {
  if (value === true) {
    return ` ${name}=""`;
  }

  return "";
}
