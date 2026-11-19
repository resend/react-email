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

const unitlessNumber = /^[+-]?(?:\d+\.?\d*|\.\d+)$/;
const lengthWithUnit = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:%|[a-z]+)$/i;

const toCssSpace = (value: number | string) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? `${value}px` : undefined;
  }

  const parts = value.trim().split(/\s+/);
  const cssParts: string[] = [];

  for (const part of parts) {
    if (unitlessNumber.test(part)) {
      cssParts.push(`${part}px`);
    } else if (lengthWithUnit.test(part) || part === 'auto') {
      cssParts.push(part);
    } else {
      return undefined;
    }
  }

  return cssParts.join(' ');
};

export const withSpace = (
  value: number | string | undefined,
  properties: MarginCSSProperty[],
) => {
  const styles: MarginStyles = {};

  if (value === undefined) {
    return styles;
  }

  const cssValue = toCssSpace(value);

  if (cssValue === undefined) {
    return styles;
  }

  for (const property of properties) {
    styles[property] = cssValue as React.CSSProperties[MarginCSSProperty];
  }

  return styles;
};
