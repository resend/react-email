import { SUPPORTED_CSS_PROPERTIES } from './themes';
import type {
  EditorTheme,
  EditorThemeInput,
  KnownCssProperties,
  KnownThemeComponents,
  PanelGroup,
  ThemeComponentStyles,
  ThemeConfig,
} from './types';

const CLASS_REFERENCE_TO_PANEL_ID: Partial<
  Record<KnownThemeComponents, string>
> = {
  body: 'body',
  container: 'container',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  link: 'link',
  image: 'image',
  button: 'button',
  codeBlock: 'code-block',
  inlineCode: 'inline-code',
};

export function parseCssValue(value: string | number): {
  value: string | number;
  unit?: 'px' | '%';
} {
  if (typeof value === 'number') {
    return { value };
  }
  const pxMatch = /^(-?\d+(?:\.\d+)?)px$/.exec(value);
  if (pxMatch) {
    return { value: Number.parseFloat(pxMatch[1]), unit: 'px' };
  }
  const percentMatch = /^(-?\d+(?:\.\d+)?)%$/.exec(value);
  if (percentMatch) {
    return { value: Number.parseFloat(percentMatch[1]), unit: '%' };
  }
  return { value };
}

export function isThemeConfig(
  theme: EditorThemeInput | undefined,
): theme is ThemeConfig {
  return typeof theme === 'object' && theme !== null && 'styles' in theme;
}

export function themeStylesToPanelOverrides(
  styles: ThemeComponentStyles,
  basePanels: PanelGroup[],
): PanelGroup[] {
  const result: PanelGroup[] = basePanels.map((group) => ({
    ...group,
    inputs: group.inputs.map((input) => ({ ...input })),
  }));

  for (const [component, cssProps] of Object.entries(styles) as [
    KnownThemeComponents,
    React.CSSProperties,
  ][]) {
    if (!cssProps) continue;
    const panelId = CLASS_REFERENCE_TO_PANEL_ID[component];
    if (!panelId) continue;

    const group = result.find((g) => g.id === panelId);
    if (!group) continue;

    for (const [cssProp, cssValue] of Object.entries(cssProps) as [
      KnownCssProperties,
      string | number,
    ][]) {
      if (cssValue === undefined) continue;

      const existingInput = group.inputs.find(
        (i) => i.prop === cssProp && i.classReference === component,
      );

      const parsed = parseCssValue(cssValue);

      if (existingInput) {
        existingInput.value = parsed.value;
        if (parsed.unit !== undefined) {
          existingInput.unit = parsed.unit;
        }
      } else {
        const propMeta = SUPPORTED_CSS_PROPERTIES[cssProp];
        group.inputs.push({
          label: propMeta?.label ?? cssProp,
          type: propMeta?.type ?? 'text',
          prop: cssProp,
          classReference: component,
          value: parsed.value,
          unit: parsed.unit ?? propMeta?.unit,
          options: propMeta?.options,
        });
      }
    }
  }

  return result;
}

export function createTheme(styles: ThemeComponentStyles): ThemeConfig {
  return { styles };
}

export function extendTheme(
  base: EditorTheme,
  overrides: ThemeComponentStyles,
): ThemeConfig {
  return { extends: base, styles: overrides };
}
