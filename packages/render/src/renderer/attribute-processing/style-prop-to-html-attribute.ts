import type { PropValue } from "./prop-to-html-attribute";
import { isUnitlessNumber } from "./style/is-unitless-number";
import { processStyleName } from "./style/process-style-name";

export function stylePropToHtmlAttribute(style: PropValue) {
  if (typeof style !== "object") {
    throw new Error(
      "The `style` prop expects a mapping from style properties to values, " +
        "not a string. For example, style={{marginRight: spacing + 'em'}} when " +
        "using JSX.",
    );
  }

  let styles: string[] = [];

  for (const [styleName, styleValue] of Object.entries(style)) {
    if (
      styleValue == null ||
      typeof styleValue === "boolean" ||
      styleValue === ""
    ) {
      continue;
    }

    let nameChunk;
    let valueChunk;
    const isCustomProperty = styleName.indexOf("--") === 0;
    if (isCustomProperty) {
      nameChunk = styleName;
      valueChunk = ("" + styleValue).trim();
    } else {
      nameChunk = processStyleName(styleName);
      if (typeof styleValue === "number") {
        if (styleValue !== 0 && !isUnitlessNumber(styleName)) {
          valueChunk = styleValue + "px"; // Presumes implicit 'px' suffix for unitless numbers
        } else {
          valueChunk = "" + styleValue;
        }
      } else {
        valueChunk = ("" + styleValue).trim();
      }
    }
    styles.push(`${nameChunk}:${valueChunk}`);
  }
  return ` style="${styles.join(";").replaceAll('"', "'")}"`;
}
