export const getStylesPerClassMap = (css: string): Record<string, string> => {
  const map = {} as Record<string, string>;
  for (const [_match, className, contents] of css.matchAll(
    /\s*\.([\S]+)\s*{([^}]*)}/gm,
  )) {
    map[className.trim()] = contents
      .replace(/^\n+/, "")
      .replace(/\n+$/, "")
      .trim();
  }
  return map;
};
