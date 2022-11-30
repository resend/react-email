export interface Margin {
  m?: string;
  mx?: string;
  my?: string;
  mt?: string;
  mr?: string;
  mb?: string;
  ml?: string;
}

export const withMargin = (props: Margin) =>
  [
    withSpace(props.m, ['margin']),
    withSpace(props.mx, ['marginLeft', 'marginRight']),
    withSpace(props.my, ['marginTop', 'marginBottom']),
    withSpace(props.mt, ['marginTop']),
    withSpace(props.mr, ['marginRight']),
    withSpace(props.mb, ['marginBottom']),
    withSpace(props.ml, ['marginLeft']),
  ].filter((s) => Object.keys(s).length)[0];

const withSpace = (value: string | undefined, properties: string[]) => {
  return properties.reduce((styles, property) => {
    if (value) {
      return { ...styles, [property]: `${value}px` };
    }
    return styles;
  }, {});
};
