const marginVals = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '-1',
  '-2',
  '-3',
  '-4',
  '-5',
  '-6',
  '-7',
  '-8',
  '-9',
] as const;

export interface Margin {
  m?: typeof marginVals[number];
  mx?: typeof marginVals[number];
  my?: typeof marginVals[number];
  mt?: typeof marginVals[number];
  mr?: typeof marginVals[number];
  mb?: typeof marginVals[number];
  ml?: typeof marginVals[number];
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
