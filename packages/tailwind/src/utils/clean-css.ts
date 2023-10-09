/**
 * Clean css selectors to replace all non-alphanumeric characters with underscores
 */
export function cleanCss(css: string) {
  const newCss = css
    .replace(/\\/g, "")
    // find all css selectors and look ahead for opening and closing curly braces
    .replace(/[.!#\w\d\\:\-[\]/.%())]+(?=\s*?{[^{]*?\})\s*?{/g, (m) => {
      return m.replace(/(?<=.)[:#!\-[\\\]/.%]+/g, "_");
    })
    .replace(/font-family(?<value>[^;\r\n]+)/g, (m, value) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return `font-family${value.replace(/['"]+/g, "")}`;
    });
  return newCss;
}
