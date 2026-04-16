import type { CssJs } from '../plugins/email-theming/types';

const WHITE_SPACE_REGEX = /\s+/;

const BORDER_WIDTH_TO_STYLE: Record<string, string> = {
  borderWidth: 'borderStyle',
  borderTopWidth: 'borderTopStyle',
  borderRightWidth: 'borderRightStyle',
  borderBottomWidth: 'borderBottomStyle',
  borderLeftWidth: 'borderLeftStyle',
};

export const jsToInlineCss = (styleObject: { [key: string]: any }) => {
  const parts: string[] = [];

  for (const key in styleObject) {
    const value = styleObject[key];
    if (value !== 0 && value !== undefined && value !== null && value !== '') {
      const KEBAB_CASE_REGEX = /[A-Z]/g;
      const formattedKey = key.replace(
        KEBAB_CASE_REGEX,
        (match) => `-${match.toLowerCase()}`,
      );
      parts.push(`${formattedKey}:${value}`);
    }
  }

  return parts.join(';') + (parts.length ? ';' : '');
};

const splitDeclarations = (input: string): string[] => {
  const results: string[] = [];
  let current = '';
  let depth = 0;

  for (const char of input) {
    if (char === '(') depth++;
    if (char === ')') depth--;

    if (char === ';' && depth === 0) {
      results.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current) results.push(current);
  return results;
};

export const inlineCssToJs = (
  inlineStyle: string,
  options: { removeUnit?: boolean } = {},
) => {
  const styleObject: { [key: string]: string } = {};

  if (!inlineStyle || inlineStyle === '' || typeof inlineStyle === 'object') {
    return styleObject;
  }

  splitDeclarations(inlineStyle).forEach((style: string) => {
    const trimmed = style.trim();
    if (trimmed) {
      const separatorIndex = trimmed.indexOf(':');
      if (separatorIndex === -1) return;

      const key = trimmed.slice(0, separatorIndex);
      const value = trimmed.slice(separatorIndex + 1);
      const valueTrimmed = value.trim();

      if (!valueTrimmed) {
        return;
      }

      const formattedKey = key
        .trim()
        .replace(/-\w/g, (match) => match[1].toUpperCase());

      const UNIT_REGEX = /px|%/g;
      const sanitizedValue = options?.removeUnit
        ? valueTrimmed.replace(UNIT_REGEX, '')
        : valueTrimmed;

      styleObject[formattedKey] = sanitizedValue;
    }
  });

  return styleObject;
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
        // Always preserve the longhand property
        expanded[key] = value;

        // When all four corners are present and identical, also add the shorthand
        if (
          styles.borderTopLeftRadius &&
          styles.borderTopRightRadius &&
          styles.borderBottomLeftRadius &&
          styles.borderBottomRightRadius
        ) {
          const values = [
            styles.borderTopLeftRadius,
            styles.borderTopRightRadius,
            styles.borderBottomLeftRadius,
            styles.borderBottomRightRadius,
          ];

          if (new Set(values).size === 1) {
            expanded.borderRadius = values[0];
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

/**
 * When a border-width is present but border-style is missing, browsers default
 * to `none` and the border is invisible. This adds `solid` as a sensible
 * fallback so borders show up immediately after setting a width.
 */
export function ensureBorderStyleFallback(
  styles: Record<string, string | number>,
): Record<string, string | number> {
  for (const [widthKey, styleKey] of Object.entries(BORDER_WIDTH_TO_STYLE)) {
    const widthValue = styles[widthKey];
    if (!widthValue || widthValue === '0' || widthValue === '0px') {
      continue;
    }
    if (!styles[styleKey]) {
      // Keep shorthand borderStyle authoritative for each side when present.
      if (styleKey !== 'borderStyle' && styles.borderStyle) {
        continue;
      }
      styles[styleKey] = 'solid';
    }
  }
  return styles;
}

/**
 * Resolves conflicts between reset styles and inline styles by expanding
 * shorthand properties (margin, padding) to longhand before merging.
 * This prevents shorthand properties from overriding specific longhand properties.
 *
 * @param resetStyles - Base reset styles that may contain shorthand properties
 * @param inlineStyles - Inline styles that should override reset styles
 * @returns Merged styles with inline styles taking precedence
 */
export function resolveConflictingStyles(
  resetStyles: CssJs['reset'],
  inlineStyles: Record<string, string>,
) {
  const expandedResetStyles = expandShorthandProperties(
    resetStyles as Record<string, string>,
  );
  const expandedInlineStyles = expandShorthandProperties(inlineStyles);

  return {
    ...expandedResetStyles,
    ...expandedInlineStyles,
  };
}
