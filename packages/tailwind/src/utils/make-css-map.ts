/**
 * Make a map of all class names and their css styles
 */
export function makeCssMap(css: string) {
  const cssNoMedia = css.replace(
    /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm,
    "",
  );

  const cssMap = cssNoMedia
    .split("}")
    .reduce<Record<string, string>>((acc, cur) => {
      const [key, value] = cur.split("{");
      if (key && value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  return cssMap;
}
