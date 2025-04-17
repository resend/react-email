type MarginType = string | number | undefined;

interface MarginProperties {
  margin: MarginType;
  marginTop?: MarginType;
  marginRight?: MarginType;
  marginBottom?: MarginType;
  marginLeft?: MarginType;
}

/**
 * Parses all the values out of a margin string to get the value for all margin props in the four margin properties
 * @example e.g. "10px" =\> mt: "10px", mr: "10px", mb: "10px", ml: "10px"
 */
export function parseMargin({
  margin,
  marginTop,
  marginRight,
  marginBottom,
  marginLeft,
}: MarginProperties) {
  let mt: MarginType;
  let mr: MarginType;
  let mb: MarginType;
  let ml: MarginType;

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

  return {
    mt: marginTop ?? mt,
    mr: marginRight ?? mr,
    mb: marginBottom ?? mb,
    ml: marginLeft ?? ml,
  };
}
