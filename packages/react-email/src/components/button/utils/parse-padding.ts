type PaddingType = string | number | undefined;

interface PaddingProperties {
  padding?: PaddingType;
  paddingTop?: PaddingType;
  paddingRight?: PaddingType;
  paddingBottom?: PaddingType;
  paddingLeft?: PaddingType;
}

/**
 * converts padding value to `px` equivalent.
 * @example "1em" =\> 16
 */
export function convertToPx(value: PaddingType) {
  let px = 0;

  if (value === undefined || value === '') {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  const matches = /^([\d.]+)(px|pt|em|rem|%)$/.exec(value);

  if (matches && matches.length === 3) {
    const numValue = Number.parseFloat(matches[1]!);
    const unit = matches[2]!;

    switch (unit) {
      case 'px':
        return numValue;
      case 'pt':
        return (numValue * 4) / 3;
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

function resolvedLength(value: PaddingType): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  const matches = /^([\d.]+)(px|pt|em|rem|%)$/.exec(trimmed);
  if (!matches) return undefined;
  return convertToPx(trimmed);
}

// Whitespace inside calc() or var() is not a shorthand separator.
function paddingTokens(value: string): string[] | undefined {
  const tokens: string[] = [];
  let token = '';
  let depth = 0;

  for (const character of value.trim()) {
    if (character === '(') depth += 1;
    else if (character === ')' && depth > 0) depth -= 1;

    if (character.trim() === '' && depth === 0) {
      if (token) {
        tokens.push(token);
        token = '';
      }
      continue;
    }
    token += character;
  }
  if (token) tokens.push(token);
  if (tokens.length === 0 || tokens.length > 4) return undefined;
  return tokens;
}

function shorthandLengths(value: string) {
  const tokens = paddingTokens(value);
  if (!tokens) return undefined;

  const lengths = tokens.map((token) => resolvedLength(token));
  if (lengths.some((length) => length === undefined)) return undefined;

  const [top, second, third, fourth] = lengths as number[];
  if (tokens.length === 1) {
    return {
      paddingTop: top,
      paddingRight: top,
      paddingBottom: top,
      paddingLeft: top,
    };
  }
  if (tokens.length === 2) {
    return {
      paddingTop: top,
      paddingRight: second,
      paddingBottom: top,
      paddingLeft: second,
    };
  }
  if (tokens.length === 3) {
    return {
      paddingTop: top,
      paddingRight: second,
      paddingBottom: third,
      paddingLeft: second,
    };
  }
  return {
    paddingTop: top,
    paddingRight: second,
    paddingBottom: third,
    paddingLeft: fourth,
  };
}

/**
 * Parses all the values out of a padding string to get the value for all padding props in `px`
 * @example e.g. "10px" =\> pt: 10, pr: 10, pb: 10, pl: 10
 */
export function parsePadding(properties: PaddingProperties) {
  let paddingTop: number | undefined;
  let paddingRight: number | undefined;
  let paddingBottom: number | undefined;
  let paddingLeft: number | undefined;

  for (const [key, value] of Object.entries(properties)) {
    if (key === 'padding' && typeof value === 'number') {
      const length = resolvedLength(value);
      paddingTop = length;
      paddingRight = length;
      paddingBottom = length;
      paddingLeft = length;
    } else if (key === 'padding' && typeof value === 'string') {
      const sides = shorthandLengths(value);
      paddingTop = sides?.paddingTop;
      paddingRight = sides?.paddingRight;
      paddingBottom = sides?.paddingBottom;
      paddingLeft = sides?.paddingLeft;
    } else if (key === 'paddingTop') {
      paddingTop = resolvedLength(value);
    } else if (key === 'paddingRight') {
      paddingRight = resolvedLength(value);
    } else if (key === 'paddingBottom') {
      paddingBottom = resolvedLength(value);
    } else if (key === 'paddingLeft') {
      paddingLeft = resolvedLength(value);
    }
  }

  return {
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
  };
}
