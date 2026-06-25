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

export const withSpace = (
  value: number | string | undefined,
  properties: MarginCSSProperty[],
) => {
  const styles: MarginStyles = {};

  if (value === undefined) {
    return styles;
  }

  // Check to ensure string value is a valid number
  if (Number.isNaN(Number.parseFloat(String(value)))) {
    return styles;
  }

  // Pass unit-bearing strings like "2rem" through untouched; only bare
  // numbers get a px suffix, so "2rem" doesn't become an invalid "2rempx".
  const dimension =
    typeof value === 'string' && !/^-?\d*\.?\d+$/.test(value.trim())
      ? value
      : `${value}px`;

  for (const property of properties) {
    styles[property] = dimension as React.CSSProperties[MarginCSSProperty];
  }

  return styles;
};
