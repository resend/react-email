import { getThemeComponentKey } from '../../../plugins/email-theming/extension';
import type { KnownThemeComponents } from '../../../plugins/email-theming/types';

function expandPaddingShorthand(
  value: string | number,
): Record<string, string> {
  const parts = String(value).trim().split(/\s+/);
  const [top, right = top, bottom = top, left = right] = parts;
  return {
    paddingTop: top,
    paddingRight: right,
    paddingBottom: bottom,
    paddingLeft: left,
  };
}

export function parseCssValue(
  value: string | number | undefined,
): { numeric: number; unit: string } | null {
  if (value === undefined || value === null) {
    return null;
  }

  const strValue = String(value).trim();
  const match = strValue.match(/^(-?\d*\.?\d+)(px|em|%|rem)?$/);

  if (match) {
    return {
      numeric: Number.parseFloat(match[1]),
      unit: match[2] || '',
    };
  }

  return null;
}

export function convertToInspectorUnit(
  value: string | number | undefined,
  bodyFontSize: number,
  targetUnit: 'px' | '%',
): number | string {
  const parsed = parseCssValue(value);
  if (!parsed) {
    return '';
  }

  if (parsed.unit === 'em' || parsed.unit === 'rem') {
    return Math.round(parsed.numeric * bodyFontSize);
  }

  if (parsed.unit === '%') {
    return targetUnit === '%' ? parsed.numeric : parsed.numeric;
  }

  if (parsed.unit === 'px' || parsed.unit === '') {
    return parsed.numeric;
  }

  return '';
}

const BASE_FONT_SIZE_PX = 16;

export function normalizeInlineStyleUnits(
  expanded: Record<string, string>,
): Record<string, string> {
  const result = { ...expanded };

  if (result.fontSize !== undefined) {
    const converted = convertToInspectorUnit(
      result.fontSize,
      BASE_FONT_SIZE_PX,
      'px',
    );
    if (converted !== '') {
      result.fontSize = String(converted);
    }
  }

  if (result.lineHeight !== undefined) {
    const parsed = parseCssValue(result.lineHeight);
    if (parsed && (parsed.unit === 'em' || parsed.unit === 'rem')) {
      result.lineHeight = String(Math.round(parsed.numeric * 100));
    } else if (parsed && parsed.unit === '%') {
      result.lineHeight = String(parsed.numeric);
    }
  }

  return result;
}

export function resolveThemeDefaults(
  nodeType: string,
  attrs: Record<string, unknown>,
  themeStyles: Record<KnownThemeComponents, React.CSSProperties>,
): Record<string, string | number> {
  const componentKey = getThemeComponentKey(nodeType, 0, attrs);
  if (!componentKey) {
    return {};
  }

  const componentStyles = themeStyles[componentKey];
  if (!componentStyles) {
    return {};
  }
  const resolvedDefaults: Record<string, string | number> = {};

  if (componentStyles.color) {
    resolvedDefaults.color = componentStyles.color;
  } else if (themeStyles.body?.color) {
    resolvedDefaults.color = themeStyles.body.color;
  }

  if (componentStyles.fontWeight !== undefined) {
    resolvedDefaults.fontWeight = componentStyles.fontWeight;
  }

  if (componentStyles.textDecoration !== undefined) {
    resolvedDefaults.textDecoration = componentStyles.textDecoration;
  }

  if (componentStyles.backgroundColor !== undefined) {
    resolvedDefaults.backgroundColor = componentStyles.backgroundColor;
  }

  if (componentStyles.borderRadius !== undefined) {
    const converted = convertToInspectorUnit(
      componentStyles.borderRadius,
      BASE_FONT_SIZE_PX,
      'px',
    );
    if (converted !== '') {
      resolvedDefaults.borderRadius = converted;
    }
  }

  if (componentStyles.borderWidth !== undefined) {
    const converted = convertToInspectorUnit(
      componentStyles.borderWidth,
      BASE_FONT_SIZE_PX,
      'px',
    );
    if (converted !== '') {
      resolvedDefaults.borderWidth = converted;
    }
  }

  if (componentStyles.borderColor !== undefined) {
    resolvedDefaults.borderColor = componentStyles.borderColor;
  }

  if (componentStyles.borderStyle !== undefined) {
    resolvedDefaults.borderStyle = componentStyles.borderStyle;
  }

  const shorthandPadding =
    componentStyles.padding === undefined
      ? {}
      : expandPaddingShorthand(componentStyles.padding);

  const paddingSides = [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
  ] as const;
  for (const prop of paddingSides) {
    const value = componentStyles[prop] ?? shorthandPadding[prop];
    if (value !== undefined) {
      const converted = convertToInspectorUnit(value, BASE_FONT_SIZE_PX, 'px');
      if (converted !== '') {
        resolvedDefaults[prop] = converted;
      }
    }
  }

  return resolvedDefaults;
}
