import type React from "react";

type MarginCSSProperty = React.CSSProperties[
  | "margin"
  | "marginLeft"
  | "marginRight"
  | "marginTop"
  | "marginBottom"];

export interface Margin {
  m?: number | string;
  mx?: number | string;
  my?: number | string;
  mt?: number | string;
  mr?: number | string;
  mb?: number | string;
  ml?: number | string;
}

export const withMargin = (props: Margin) => {
  const nonEmptyStyles = [
    withSpace(props.m, ["margin"]),
    withSpace(props.mx, ["marginLeft", "marginRight"]),
    withSpace(props.my, ["marginTop", "marginBottom"]),
    withSpace(props.mt, ["marginTop"]),
    withSpace(props.mr, ["marginRight"]),
    withSpace(props.mb, ["marginBottom"]),
    withSpace(props.ml, ["marginLeft"]),
  ].filter((s) => Object.keys(s).length);

  const mergedStyles = nonEmptyStyles.reduce((acc, style) => {
    return { ...acc, ...style };
  }, {});
  return mergedStyles;
};

export const withSpace = (
  value: number | string | undefined,
  properties: MarginCSSProperty[],
) => {
  return properties.reduce((styles, property) => {
    // Check to ensure string value is a valid number
    if (!isNaN(Number.parseFloat(value as string))) {
      return { ...styles, [property as keyof MarginCSSProperty]: `${value}px` };
    }
    return styles;
  }, {});
};
