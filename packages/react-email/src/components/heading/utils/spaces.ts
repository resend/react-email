import type React from 'react';

type MarginCSSProperty =
  | 'margin'
  | 'marginLeft'
  | 'marginRight'
  | 'marginTop'
  | 'marginBottom';

type MarginStyles = Partial<Pick<React.CSSProperties, MarginCSSProperty>>;

export interface Margin {
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
}

export const withMargin = (props: Margin): MarginStyles => {
  const candidates = [
    withSpace(props.m, ['margin']),
    withSpace(props.mx, ['marginLeft', 'marginRight']),
    withSpace(props.my, ['marginTop', 'marginBottom']),
    withSpace(props.mt, ['marginTop']),
    withSpace(props.mr, ['marginRight']),
    withSpace(props.mb, ['marginBottom']),
    withSpace(props.ml, ['marginLeft']),
  ];

  const mergedStyles: MarginStyles = {};

  for (const style of candidates) {
    if (Object.keys(style).length > 0) {
      Object.assign(mergedStyles, style);
    }
  }

  return mergedStyles;
};

const NUMBER_PATTERN = /^-?(\d+\.?\d*|\.\d+)$/;

const CSS_VALUE_PATTERN =
  /^auto$|^-?(\d+\.?\d*|\.\d+)(px|em|rem|%|vh|vw|vmin|vmax|svh|svw|lvh|lvw|dvh|dvw|in|cm|mm|pt|pc|q|ex|ch|cap|ic|lh|rlh|vi|vb|cqw|cqh|cqi|cqb|cqmin|cqmax)?$/;

export const withSpace = (
  value: number | string | undefined,
  properties: MarginCSSProperty[],
) => {
  const styles: MarginStyles = {};

  if (value === undefined) {
    return styles;
  }

  const trimmed = String(value).trim();
  const tokens = trimmed.split(/\s+/);

  if (!tokens.every((token) => CSS_VALUE_PATTERN.test(token))) {
    return styles;
  }

  const resolved = NUMBER_PATTERN.test(trimmed) ? `${trimmed}px` : trimmed;

  for (const property of properties) {
    styles[property] = resolved as React.CSSProperties[MarginCSSProperty];
  }

  return styles;
};
