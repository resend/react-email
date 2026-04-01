import { ensureBorderStyleFallback } from '../../utils/styles';
import type { CssJs, PanelGroup } from './types';

export function transformToCssJs(
  styleArray: PanelGroup[],
  baseFontSize: number,
): CssJs {
  const cssJS = {} as CssJs;

  if (!Array.isArray(styleArray)) {
    return cssJS;
  }

  for (const style of styleArray) {
    for (const input of style.inputs) {
      let value = input.value;

      // If there's a unit property, append it to the value
      if (input.unit && typeof value === 'number') {
        // if font size prop convert px unit to em to adjust size in mobile
        if (input.prop === 'fontSize') {
          value = `${value / baseFontSize}em`;
        } else {
          value = `${value}${input.unit}`;
        }
      }

      if (!input.classReference) {
        continue;
      }

      if (!cssJS[input.classReference]) {
        cssJS[input.classReference] = {};
      }

      // @ts-expect-error -- backward compatibility: 'h-padding' is a legacy prop not in KnownCssProperties
      if (input.prop === 'h-padding') {
        cssJS[input.classReference].paddingLeft = value;
        cssJS[input.classReference].paddingRight = value;

        continue;
      }

      // @ts-expect-error -- input.prop is KnownCssProperties but CssJs values are React.CSSProperties; dynamic assignment is intentional
      cssJS[input.classReference][input.prop] = value;
    }
  }

  for (const key of Object.keys(cssJS)) {
    ensureBorderStyleFallback(
      cssJS[key as keyof CssJs] as Record<string, string | number>,
    );
  }

  return cssJS;
}

export function mergeCssJs(original: CssJs, newCssJs: CssJs) {
  const merged = { ...original };

  for (const key in newCssJs) {
    const keyType = key as keyof CssJs;

    if (
      Object.hasOwn(merged, key) &&
      typeof merged[keyType] === 'object' &&
      !Array.isArray(merged[keyType])
    ) {
      merged[keyType] = {
        ...merged[keyType],
        ...newCssJs[keyType],
      };
    } else {
      merged[keyType] = newCssJs[keyType];
    }
  }

  return merged;
}

export function injectThemeCss(
  styles: CssJs,
  options: { styleId?: string; scopeSelector?: string } = {},
) {
  const container =
    options.scopeSelector ?? '.tiptap-extended .tiptap.ProseMirror';
  const prefix = '.node-';
  const styleId = options.styleId ?? 'tiptap-extended-theme-css';

  const css = Object.entries(styles).reduce((acc, [key, value]) => {
    const className =
      key === 'body' ? container : `${container} ${prefix}${key}`;

    const cssString = Object.entries(value).reduce((acc, [prop, val]) => {
      const normalizeProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();

      return `${acc}${normalizeProp}:${val};`;
    }, '');

    return `${acc}${className}{${cssString}}`;
  }, '');

  let styleTag = document.getElementById(styleId) as HTMLStyleElement;

  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.textContent = css;
    styleTag.id = styleId;

    document.head.appendChild(styleTag);

    return;
  }

  styleTag.textContent = css;
}

export function injectGlobalPlainCss(
  css?: string | null,
  options: { styleId?: string; scopeSelector?: string } = {},
) {
  if (!css) {
    return;
  }

  const styleId = options.styleId ?? 'global-editor-style';
  const container = options.scopeSelector ?? '.tiptap-extended .ProseMirror';
  let styleElement = document.getElementById(styleId);

  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }

  // Remove CSS within @media (prefers-color-scheme: dark) blocks
  const cleanedCSS = css.replace(
    /@media\s?\(prefers-color-scheme:\s?dark\)\s?{([\s\S]+?})\s*}/g,
    '',
  );

  // TODO: Figure out a way to extract the body and apply the styles out of the nested .tiptap-extended
  styleElement.textContent = `${container} { ${cleanedCSS} }`;
}
