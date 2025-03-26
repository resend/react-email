type MarginType = string | number | undefined;

interface MarginProperties {
  margin: MarginType;
  marginTop?: MarginType;
  marginRight?: MarginType;
  marginBottom?: MarginType;
  marginLeft?: MarginType;
}

/**
 * converts margin value to `px` equivalent.
 * @example "1em" =\> 16
 */
function convertToPx(value: MarginType) {
  let px = 0;

  if (!value) {
    return px;
  }

  if (typeof value === 'number') {
    return value;
  }

  const matches = /^([\d.]+)(px|em|rem|%)$/.exec(value);

  if (matches && matches.length === 3) {
    const numValue = Number.parseFloat(matches[1]);
    const unit = matches[2];

    switch (unit) {
      case 'px':
        return numValue;
      case 'em':
      case 'rem':
        px = numValue * 16;
        return px;
      case '%':
        px = (numValue / 100) * 600;
        return px;
      default:
        return numValue;
    }
  }
  return 0;
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
        mt = convertToPx(values[0]);
        mr = convertToPx(values[0]);
        mb = convertToPx(values[0]);
        ml = convertToPx(values[0]);
        break;
      case 2:
        mt = convertToPx(values[0]);
        mb = convertToPx(values[0]);
        mr = convertToPx(values[1]);
        ml = convertToPx(values[1]);
        break;
      case 3:
        mt = convertToPx(values[0]);
        mr = convertToPx(values[1]);
        mb = convertToPx(values[2]);
        ml = convertToPx(values[1]);
        break;
      case 4:
        mt = convertToPx(values[0]);
        mr = convertToPx(values[1]);
        mb = convertToPx(values[2]);
        ml = convertToPx(values[3]);
        break;
      default:
        break;
    }
  }

  return { mt, mr, mb, ml };
}
