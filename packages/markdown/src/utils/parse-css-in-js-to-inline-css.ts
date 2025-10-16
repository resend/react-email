function camelToKebabCase(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function escapeQuotes(value: unknown) {
  if (typeof value === 'string' && value.includes('"')) {
    return value.replace(/"/g, '&#x27;');
  }
  return value;
}

export function parseCssInJsToInlineCss(
  cssProperties: React.CSSProperties | undefined,
): string {
  if (!cssProperties) return '';

  const numericalCssProperties = [
    'width',
    'height',
    'margin',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'padding',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'borderWidth',
    'borderTopWidth',
    'borderRightWidth',
    'borderBottomWidth',
    'borderLeftWidth',
    'outlineWidth',
    'top',
    'right',
    'bottom',
    'left',
    'fontSize',
    'lineHeight',
    'letterSpacing',
    'wordSpacing',
    'maxWidth',
    'minWidth',
    'maxHeight',
    'minHeight',
    'borderRadius',
    'borderTopLeftRadius',
    'borderTopRightRadius',
    'borderBottomLeftRadius',
    'borderBottomRightRadius',
    'textIndent',
    'gridColumnGap',
    'gridRowGap',
    'gridGap',
    'translateX',
    'translateY',
  ];

  return Object.entries(cssProperties)
    .map(([property, value]) => {
      if (
        typeof value === 'number' &&
        numericalCssProperties.includes(property)
      ) {
        return `${camelToKebabCase(property)}:${value}px`;
      }

      const escapedValue = escapeQuotes(value);
      return `${camelToKebabCase(property)}:${escapedValue}`;
    })
    .join(';');
}
