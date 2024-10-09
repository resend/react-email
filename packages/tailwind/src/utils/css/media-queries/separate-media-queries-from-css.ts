export function separateMediaQueriesFromCSS(
  css: string,
): [cssWithoutMediaQueries: string, mediaQueries: string[]] {
  let cssWithoutMediaQueries = css;
  const mediaQueries: string[] = [];

  for (const match of css.matchAll(
    /@media\s*[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/gm,
  )) {
    const [mediaQuery] = match;
    cssWithoutMediaQueries = cssWithoutMediaQueries.replace(mediaQuery, "");

    mediaQueries.push(mediaQuery);
  }

  return [cssWithoutMediaQueries, mediaQueries];
}
