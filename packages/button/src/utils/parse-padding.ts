function convertToPx(value: string, unit: string) {
  let px = 0;

  if (!value) return px;

  let numValue = parseFloat(value);

  switch (unit) {
    case "px":
      return numValue;
    case "em":
    case "rem":
      px = numValue * 16;
      return px;
    case "%":
      px = (numValue / 100) * 600;
      return px;
    default:
      return numValue; // Default to px if unit is not recognized
  }
}

export function parsePadding(padding: string | number | undefined = "") {
  // if padding is a number
  // then it is only one value for pX and pY
  if (typeof padding === "number") {
    return { pY: padding, pX: padding };
  }

  let pY = 0;
  let pX = 0;

  const paddingRegex =
    /^([\d.]+)(px|em|rem|%)\s*(([\d.]+)(px|em|rem|%))?\s*(([\d.]+)(px|em|rem|%))?\s*(([\d.]+)(px|em|rem|%))?$/;

  const matches = padding.match(paddingRegex);

  if (matches) {
    // Extract all values from padding string
    // Set only the first 2 values for pX and pY
    pY = convertToPx(matches[1], matches[2]);
    pX = convertToPx(matches[4] || matches[1], matches[5] || matches[2]);
  }

  return { pY, pX };
}
