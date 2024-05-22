export function convertPropsIntoAttributes<T extends Record<string, unknown>>(
  props: T,
): string {
  return Object.keys(props)
    .filter((key) => !key.startsWith("on") && key !== 'children')
    .map((key) => {
      const value = props[key];

      if (value === undefined || value === null) return '';

      if (key === "className" && typeof value === 'string') {
        return `class="${value}"`;
      }

      if (key === "style" && typeof value === "object") {
        return convertStyleIntoAttribute(value as React.CSSProperties);
      }

      if (key === 'dangerouslySetInnerHTML' && typeof value === 'object') {
        return '';
      }

      if (typeof value === 'object') {
        return `${key}="${JSON.stringify(value)}"`;
      }

      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      return `${key}="${value}"`;
    })
    .join(" ");
}

function convertStyleIntoAttribute(style: React.CSSProperties): string {
  const inlineStyles = Object.entries(style)
    .map(([key, value]) => {
      if (key.startsWith("ms")) {
        return `-${fromCamelCaseToSnakeCase(key)}:${value}`;
      }

      return `${fromCamelCaseToSnakeCase(key)}:${value}`;
    })
    .join(";");
  return `style="${inlineStyles}"`;
}

function fromCamelCaseToSnakeCase(camelCasedText: string) {
  return camelCasedText.replaceAll(
    /([a-z])([A-Z])/g,
    (_match, lowerCaseLetter: string, upperCaseLetter: string) => {
      return `${lowerCaseLetter}-${upperCaseLetter.toLowerCase()}`;
    },
  );
}
