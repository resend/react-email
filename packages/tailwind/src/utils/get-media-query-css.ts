/**
 * Get media query css to put in head
 */
export function getMediaQueryCss(css: string) {
  const mediaQueryRegex = /@media[^{]+\{(?<content>[\s\S]+?)\}\s*\}/gm;

  return (
    css
      .replace(mediaQueryRegex, (m) => {
        return m.replace(
          /([^{]+\{)([\s\S]+?)(\}\s*\})/gm,
          (_, start, content, end) => {
            const newContent = (content as string).replace(
              /(?:[\s\r\n]*)?(?<prop>[\w-]+)\s*:\s*(?<value>[^};\r\n]+)/gm,
              (__, prop, value) => {
                return `${prop}: ${value} !important;`;
              },
            );
            return `${start}${newContent}${end}`;
          },
        );
      })
      // only return media queries
      .match(/@media\s*([^{]+)\{([^{}]*\{[^{}]*\})*[^{}]*\}/g)
      ?.join("") ?? ""
  );
}
