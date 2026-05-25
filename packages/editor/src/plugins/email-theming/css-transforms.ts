import { ensureBorderStyleFallback } from '../../utils/styles';
import { RESET_NODE_TYPES } from './extension';
import type { CssJs, KnownThemeComponents, PanelGroup } from './types';

export function transformToCssJs(
  styleArray: PanelGroup[],
  baseFontSize: number,
): CssJs {
  // Use prototype-less objects so attacker-supplied keys like `__proto__`,
  // `constructor`, or `prototype` are stored as plain own properties instead
  // of routing through the Object.prototype setter, which would mutate the
  // global prototype.
  const cssJS = Object.create(null) as CssJs;

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
        cssJS[input.classReference] = Object.create(null);
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
  // Same defensive pattern as `transformToCssJs`: a prototype-less root keeps
  // a hostile `__proto__` key in the input from triggering the
  // Object.prototype setter during assignment.
  const merged = Object.assign(Object.create(null), original) as CssJs;

  for (const key in newCssJs) {
    const keyType = key as keyof CssJs;

    if (
      Object.hasOwn(merged, key) &&
      typeof merged[keyType] === 'object' &&
      !Array.isArray(merged[keyType])
    ) {
      merged[keyType] = Object.assign(
        Object.create(null),
        merged[keyType],
        newCssJs[keyType],
      );
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
  const getNodeSelector = (classReference: string) =>
    `${container} ${prefix}${classReference}`;
  const getSelectors = (classReference: KnownThemeComponents) => {
    switch (classReference) {
      case 'body':
        return [container];
      case 'reset':
        return [];
      case 'list':
        return [
          getNodeSelector('list'),
          getNodeSelector('bulletList'),
          getNodeSelector('orderedList'),
        ];
      case 'bulletList':
        return [getNodeSelector('bulletList')];
      case 'orderedList':
        return [getNodeSelector('orderedList')];
      case 'nestedList':
        return [
          getNodeSelector('nestedList'),
          `${container} .node-list .node-list`,
          `${container} .node-bulletList .node-bulletList`,
          `${container} .node-bulletList .node-orderedList`,
          `${container} .node-orderedList .node-bulletList`,
          `${container} .node-orderedList .node-orderedList`,
        ];
      case 'listParagraph':
        return [`${container} .node-listItem > .node-paragraph`];
      default:
        return [getNodeSelector(classReference)];
    }
  };
  const resetStyles = styles.reset ?? {};

  const css = Object.entries(styles).reduce((acc, [key, value]) => {
    const classReference = key as KnownThemeComponents;
    const selectors = getSelectors(classReference);
    if (selectors.length === 0) {
      return acc;
    }

    const resolvedStyles = RESET_NODE_TYPES.has(classReference)
      ? { ...resetStyles, ...value }
      : value;

    const cssString = Object.entries(resolvedStyles).reduce(
      (acc, [prop, val]) => {
        const normalizeProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();

        if (val === undefined) {
          return acc;
        }

        return `${acc}${normalizeProp}:${val};`;
      },
      '',
    );

    return `${acc}${selectors.join(',')}{${cssString}}`;
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
  const styleId = options.styleId ?? 'global-editor-style';
  const container = options.scopeSelector ?? '.tiptap-extended .ProseMirror';
  let styleElement = document.getElementById(styleId);

  if (!css) {
    if (styleElement) {
      styleElement.textContent = '';
    }
    return;
  }

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
