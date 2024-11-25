import { escapeTextForBrowser } from "../escape-html";
import { booleanPropToHtmlAttribute } from "./boolean-prop-to-html-attribute";
import { getAttributeAlias } from "./get-attribute-alias";
import { isAttributeNameSafe } from "./is-attribute-name-safe";
import { stringPropToHtmlAttribute } from "./string-prop-to-html-attribute";
import { stylePropToHtmlAttribute } from "./style-prop-to-html-attribute";

export type PropValue = string | boolean | number | Function | Object;

export function propToHtmlAttribute(name: string, value: PropValue): string {
  if (value === undefined) return "";

  switch (name) {
    // These are very common props and therefore are in the beginning of the switch.
    // TODO: aria-label is a very common prop but allows booleans so is not like the others
    // but should ideally go in this list too.
    case "className": {
      return stringPropToHtmlAttribute("class", value);
    }
    case "tabIndex": {
      return stringPropToHtmlAttribute("tabindex", value);
    }
    case "dir":
    case "role":
    case "viewBox":
    case "width":
    case "height": {
      return stringPropToHtmlAttribute(name, value);
    }
    case "style": {
      return stylePropToHtmlAttribute(value);
    }
    case "defaultValue":
    case "defaultChecked": // These shouldn't be set as attributes on generic HTML elements.
    case "innerHTML": // Must use dangerouslySetInnerHTML instead.
    case "suppressContentEditableWarning":
    case "suppressHydrationWarning":
    case "ref":
      // Ignored. These are built-in to React on the client.
      return "";
    case "autoFocus":
    case "multiple":
    case "muted": {
      return booleanPropToHtmlAttribute(name, value);
    }
    case "xlinkHref": {
      if (
        typeof value === "function" ||
        typeof value === "symbol" ||
        typeof value === "boolean"
      ) {
        return "";
      }
      return ` xlink:href="${escapeTextForBrowser(value)}"`;
    }
    case "contentEditable":
    case "spellCheck":
    case "draggable":
    case "value":
    case "autoReverse":
    case "externalResourcesRequired":
    case "focusable":
    case "preserveAlpha": {
      // Booleanish String
      // These are "enumerated" attributes that accept "true" and "false".
      // In React, we let users pass `true` and `false` even though technically
      // these aren't boolean attributes (they are coerced to strings).
      if (typeof value !== "function" && typeof value !== "symbol") {
        return ` ${name}="${escapeTextForBrowser(value)}"`;
      }
      return "";
    }
    // Fallthrough for boolean props that don't have a warning for empty strings.
    case "allowFullScreen":
    case "async":
    case "autoPlay":
    case "controls":
    case "default":
    case "defer":
    case "disabled":
    case "disablePictureInPicture":
    case "disableRemotePlayback":
    case "formNoValidate":
    case "hidden":
    case "loop":
    case "noModule":
    case "noValidate":
    case "open":
    case "playsInline":
    case "readOnly":
    case "required":
    case "reversed":
    case "scoped":
    case "seamless":
    case "itemScope": {
      // Boolean
      if (value && typeof value !== "function" && typeof value !== "symbol") {
        return ` ${name}=""`;
      }
      return "";
    }
    case "capture":
    case "download": {
      // Overloaded Boolean
      if (value === true) {
        return ` ${name}=""`;
      } else if (value === false) {
        // Ignored
      } else if (typeof value !== "function" && typeof value !== "symbol") {
        return ` ${name}="${escapeTextForBrowser(value)}"`;
      }
      return "";
    }
    case "cols":
    case "rows":
    case "size":
    case "span": {
      // These are HTML attributes that must be positive numbers.
      if (
        typeof value !== "function" &&
        typeof value !== "symbol" &&
        !isNaN(value as number) &&
        (value as number) >= 1
      ) {
        return ` ${name}="${escapeTextForBrowser(value)}"`;
      }
      return "";
    }
    case "rowSpan":
    case "start": {
      // These are HTML attributes that must be numbers.
      if (
        typeof value !== "function" &&
        typeof value !== "symbol" &&
        !isNaN(value as number)
      ) {
        return ` ${name}="${escapeTextForBrowser(value)}"`;
      }
      return "";
    }
    case "xlinkActuate":
      return stringPropToHtmlAttribute("xlink:actuate", escapeTextForBrowser(value));
    case "xlinkArcrole":
      return stringPropToHtmlAttribute("xlink:arcrole", escapeTextForBrowser(value));
    case "xlinkRole":
      return stringPropToHtmlAttribute("xlink:role", escapeTextForBrowser(value));
    case "xlinkShow":
      return stringPropToHtmlAttribute("xlink:show", escapeTextForBrowser(value));
    case "xlinkTitle":
      return stringPropToHtmlAttribute("xlink:title", escapeTextForBrowser(value));
    case "xlinkType":
      return stringPropToHtmlAttribute("xlink:type", escapeTextForBrowser(value));
    case "xmlBase":
      return stringPropToHtmlAttribute("xml:base", escapeTextForBrowser(value));
    case "xmlLang":
      return stringPropToHtmlAttribute("xml:lang", escapeTextForBrowser(value));
    case "xmlSpace":
      return stringPropToHtmlAttribute("xml:space", escapeTextForBrowser(value));
    default:
      if (
        // shouldIgnoreAttribute
        // We have already filtered out null/undefined and reserved words.
        name.length > 2 &&
        (name[0] === "o" || name[0] === "O") &&
        (name[1] === "n" || name[1] === "N")
      ) {
        return "";
      }

      const attributeName = getAttributeAlias(name);
      if (isAttributeNameSafe(attributeName)) {
        // shouldRemoveAttribute
        switch (typeof value) {
          case "function":
          case "symbol":
            return "";
          case "boolean": {
            const prefix = attributeName.toLowerCase().slice(0, 5);
            if (prefix !== "data-" && prefix !== "aria-") {
              return "";
            }
          }
        }
        return ` ${name}="${escapeTextForBrowser(value)}"`;
      }
  }
  return "";
}
