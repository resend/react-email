import { Mark, mergeAttributes } from '@tiptap/core';

export const PreservedStyle = Mark.create({
  name: 'preservedStyle',

  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {};
          }
          return { style: attributes.style };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[style]',
        getAttrs: (element) => {
          if (typeof element === 'string') {
            return false;
          }
          const style = element.getAttribute('style');
          if (style && hasPreservableStyles(style)) {
            return { style };
          }
          return false;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes), 0];
  },
});

const LINK_INDICATOR_STYLES = [
  'color',
  'text-decoration',
  'text-decoration-line',
  'text-decoration-color',
  'text-decoration-style',
];

function parseStyleString(styleString: string): CSSStyleDeclaration {
  const temp = document.createElement('div');
  temp.style.cssText = styleString;
  return temp.style;
}

function hasBackground(style: CSSStyleDeclaration): boolean {
  const bgColor = style.backgroundColor;
  const bg = style.background;

  if (bgColor && bgColor !== 'transparent' && bgColor !== 'rgba(0, 0, 0, 0)') {
    return true;
  }

  if (
    bg &&
    bg !== 'transparent' &&
    bg !== 'none' &&
    bg !== 'rgba(0, 0, 0, 0)'
  ) {
    return true;
  }

  return false;
}

export function hasPreservableStyles(styleString: string): boolean {
  return processStylesForUnlink(styleString) !== null;
}

/**
 * Processes styles when unlinking:
 * - Has background (button-like): preserve all styles
 * - No background: strip link-indicator styles (color, text-decoration), keep the rest
 */
export function processStylesForUnlink(
  styleString: string | null | undefined,
): string | null {
  if (!styleString) {
    return null;
  }

  const style = parseStyleString(styleString);

  if (hasBackground(style)) {
    return styleString;
  }

  const filtered: string[] = [];

  for (let i = 0; i < style.length; i++) {
    const prop = style[i];

    if (LINK_INDICATOR_STYLES.includes(prop)) {
      continue;
    }

    const value = style.getPropertyValue(prop);
    if (value) {
      filtered.push(`${prop}: ${value}`);
    }
  }

  return filtered.length > 0 ? filtered.join('; ') : null;
}
