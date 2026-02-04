const KEBABD_CASE_REGEX = /[A-Z]/g;
const WHITE_SPACE_REGEX = /\s+/;
const UNIT_REGEX = /px|%/g;

export const inlineCSSToJS = (
  inlineStyle: string,
  options: { removeUnit?: boolean } = {},
) => {
  const styleObject: { [key: string]: string } = {};

  if (!inlineStyle || inlineStyle === '' || typeof inlineStyle === 'object') {
    return styleObject;
  }

  inlineStyle.split(';').forEach((style: string) => {
    if (style.trim()) {
      const [key, value] = style.split(':');
      const valueTrimmed = value.trim();

      if (!valueTrimmed) {
        return;
      }

      const formattedKey = key
        .trim()
        .replace(/-\w/g, (match) => match[1].toUpperCase());

      const sanitizedValue = options?.removeUnit
        ? valueTrimmed.replace(UNIT_REGEX, '')
        : valueTrimmed;

      styleObject[formattedKey] = sanitizedValue;
    }
  });

  return styleObject;
};

export const JStoInlineCSS = (styleObject: { [key: string]: any }) => {
  const parts: string[] = [];

  for (const key in styleObject) {
    const value = styleObject[key];
    if (value !== 0 && value !== undefined && value !== null && value !== '') {
      const formattedKey = key.replace(
        KEBABD_CASE_REGEX,
        (match) => `-${match.toLowerCase()}`,
      );
      parts.push(`${formattedKey}:${value}`);
    }
  }

  return parts.join(';') + (parts.length ? ';' : '');
};

/**
 * Expands CSS shorthand properties (margin, padding) into their longhand equivalents.
 * This prevents shorthand properties from overriding specific longhand properties in email clients.
 *
 * @param styles - Style object that may contain shorthand properties
 * @returns New style object with shorthand properties expanded to longhand
 *
 * @example
 * expandShorthandProperties({ margin: '0', paddingTop: '10px' })
 * // Returns: { marginTop: '0', marginRight: '0', marginBottom: '0', marginLeft: '0', paddingTop: '10px' }
 */
export function expandShorthandProperties(
  styles: Record<string, string>,
): Record<string, string> {
  if (!styles || typeof styles !== 'object') {
    return {};
  }

  const expanded: Record<string, any> = {};

  for (const key in styles) {
    const value = styles[key];
    if (value === undefined || value === null || value === '') {
      continue;
    }

    switch (key) {
      case 'margin': {
        const values = parseShorthandValue(value);
        expanded.marginTop = values.top;
        expanded.marginRight = values.right;
        expanded.marginBottom = values.bottom;
        expanded.marginLeft = values.left;
        break;
      }
      case 'padding': {
        const values = parseShorthandValue(value);
        expanded.paddingTop = values.top;
        expanded.paddingRight = values.right;
        expanded.paddingBottom = values.bottom;
        expanded.paddingLeft = values.left;
        break;
      }
      case 'border': {
        const values = convertBorderValue(value);
        expanded.borderStyle = values.style;
        expanded.borderWidth = values.width;
        expanded.borderColor = values.color;
        break;
      }
      case 'borderTopLeftRadius':
      case 'borderTopRightRadius':
      case 'borderBottomLeftRadius':
      case 'borderBottomRightRadius': {
        if (
          styles.borderTopRightRadius &&
          styles.borderBottomLeftRadius &&
          styles.borderBottomRightRadius
        ) {
          const value = [
            styles.borderTopLeftRadius,
            styles.borderTopRightRadius,
            styles.borderBottomLeftRadius,
            styles.borderBottomRightRadius,
          ];

          const uniqueValues = [...new Set(value)].length === 1;

          if (uniqueValues) {
            expanded.borderRadius = value[0];
          }
        }

        break;
      }

      default: {
        // Keep all other properties as-is
        expanded[key] = value;
      }
    }
  }

  return expanded;
}

/**
 * Parses CSS shorthand value (1-4 values) into individual side values.
 * Follows CSS specification for shorthand property value parsing.
 *
 * @param value - Shorthand value string (e.g., '0', '10px 20px', '5px 10px 15px 20px')
 * @returns Object with top, right, bottom, left values
 */
function parseShorthandValue(value: string | number): {
  top: string;
  right: string;
  bottom: string;
  left: string;
} {
  const stringValue = String(value).trim();
  const parts = stringValue.split(WHITE_SPACE_REGEX);
  const len = parts.length;

  if (len === 1) {
    return { top: parts[0], right: parts[0], bottom: parts[0], left: parts[0] };
  }
  if (len === 2) {
    return { top: parts[0], right: parts[1], bottom: parts[0], left: parts[1] };
  }
  if (len === 3) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[1] };
  }
  if (len === 4) {
    return { top: parts[0], right: parts[1], bottom: parts[2], left: parts[3] };
  }

  return {
    top: stringValue,
    right: stringValue,
    bottom: stringValue,
    left: stringValue,
  };
}

function convertBorderValue(value: string | number): {
  style: string;
  width: string;
  color: string;
} {
  const stringValue = String(value).trim();
  const parts = stringValue.split(WHITE_SPACE_REGEX);

  switch (parts.length) {
    case 1:
      // border: 1px → all sides
      return {
        style: 'solid',
        width: parts[0],
        color: 'black',
      };
    case 2:
      // border: 1px solid → top/bottom, left/right
      return {
        style: parts[1],
        width: parts[0],
        color: 'black',
      };
    case 3:
      // border: 1px solid #000 → top, left/right, bottom
      return {
        style: parts[1],
        width: parts[0],
        color: parts[2],
      };
    case 4:
      // border: 1px solid #000 #fff → top, right, bottom, left
      return {
        style: parts[1],
        width: parts[0],
        color: parts[2],
      };
    default:
      // Invalid format, return the original value for all sides
      return {
        style: 'solid',
        width: stringValue,
        color: 'black',
      };
  }
}
