import type { useCurrentEditor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import * as React from 'react';
import { isValidHexColor } from '@/utils/color-utils';
import {
  stylesToCss,
  useEmailTheming,
} from '../../../../plugins/email-theming/extension';

type Editor = ReturnType<typeof useCurrentEditor>['editor'];

const COLOR_CSS_PROPERTIES = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor',
] as const;

/**
 * Collects unique hex colors from both the global theme styles and
 * per-node inline styles / text marks across the editor document.
 */
export function useDocumentColors(editor: Editor): string[] {
  const theming = useEmailTheming(editor)!;

  const globalColors = React.useMemo(() => {
    const colors = new Set<string>();
    const cssJs = stylesToCss(theming.styles, theming.theme);

    for (const componentStyles of Object.values(cssJs)) {
      if (!componentStyles || typeof componentStyles !== 'object') {
        continue;
      }
      for (const prop of COLOR_CSS_PROPERTIES) {
        const value = (componentStyles as Record<string, unknown>)[prop];
        if (typeof value === 'string') {
          addColor(colors, value);
        }
      }
    }

    return Array.from(colors);
  }, [theming]);

  const inlineColors =
    useEditorState({
      editor,
      selector: ({ editor: ed }: { editor: Editor }): string[] => {
        if (!ed) {
          return [];
        }

        const colors = new Set<string>();

        ed.state.doc.descendants((node) => {
          for (const mark of node.marks) {
            if (mark.type.name === 'textStyle' && mark.attrs.color) {
              addColor(colors, mark.attrs.color);
            }
          }

          const style = node.attrs.style as string | undefined;
          if (style) {
            extractColorsFromInlineStyle(colors, style);
          }
        });

        return Array.from(colors);
      },
      equalityFn: (a: string[] | null, b: string[] | null) => {
        if (a === b) {
          return true;
        }
        if (!a || !b) {
          return false;
        }
        return arrayShallowEqual(a, b);
      },
    }) ?? [];

  return React.useMemo(() => {
    if (globalColors.length === 0) {
      return inlineColors;
    }
    if (inlineColors.length === 0) {
      return globalColors;
    }
    const merged = new Set([...globalColors, ...inlineColors]);
    return Array.from(merged);
  }, [globalColors, inlineColors]);
}

const COLOR_STYLE_PROPS = [
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
];

function extractColorsFromInlineStyle(
  colors: Set<string>,
  style: string,
): void {
  for (const prop of COLOR_STYLE_PROPS) {
    const regex = new RegExp(`${prop}\\s*:\\s*([^;]+)`, 'i');
    const match = style.match(regex);
    if (match) {
      addColor(colors, match[1].trim());
    }
  }
}

function addColor(colors: Set<string>, raw: string): void {
  const value = raw.trim().toLowerCase();
  if (!value || value === '#000000' || value === '#ffffff') {
    return;
  }
  if (isValidHexColor(value)) {
    const normalized = expandToSix(value);
    colors.add(normalized);
  }
}

function expandToSix(hex: string): string {
  const h = hex.slice(1);
  if (h.length === 3) {
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  if (h.length === 4) {
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  if (h.length === 8) {
    return `#${h.slice(0, 6)}`;
  }
  return hex;
}

function arrayShallowEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
