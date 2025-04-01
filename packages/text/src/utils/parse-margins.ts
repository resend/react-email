type MarginType = string | number | undefined;

interface MarginProperties {
  margin: MarginType;
  marginTop?: MarginType;
  marginRight?: MarginType;
  marginBottom?: MarginType;
  marginLeft?: MarginType;
}

/**
 * Parses all the values out of a margin string to get the value for all margin props in `px`
 * @example e.g. "10px" =\> mt: 10, mr: 10, mb: 10, ml: 10
 */
export function parseMargin({
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
}: MarginProperties) {
  let mt = marginTop;
  let mr = marginRight;
  let mb = marginBottom;
  let ml = marginLeft;

  if (typeof margin === 'number') {
    mt = margin;
    mr = margin;
    mb = margin;
    ml = margin;
  } else if (typeof margin === 'string') {
    const values = margin.split(/\s+/);

    switch (values.length) {
      case 1:
        mt = values[0];
        mr = values[0];
        mb = values[0];
        ml = values[0];
        break;
      case 2:
        mt = values[0];
        mb = values[0];
        mr = values[1];
        ml = values[1];
        break;
      case 3:
        mt = values[0];
        mr = values[1];
        mb = values[2];
        ml = values[1];
        break;
      case 4:
        mt = values[0];
        mr = values[1];
        mb = values[2];
        ml = values[3];
        break;
      default:
        break;
    }
  }

  return { mt, mr, mb, ml };
}
