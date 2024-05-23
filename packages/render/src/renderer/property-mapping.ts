import { getPropertyInfo, shouldIgnoreAttribute } from "./dom-property";

export function convertPropsIntoAttributes<T extends Record<string, unknown>>(
  props: T,
): string {
  return Object.keys(props)
    .filter((key) => !key.startsWith("on") && key !== 'children')
    .map((originalKey) => {
      const propertyInfo = getPropertyInfo(originalKey);
      if (shouldIgnoreAttribute(originalKey, propertyInfo)) {
        return '';
      }

      const value = props[originalKey];

      if (value === undefined || value === null) return '';

      const propertyName = propertyInfo ? propertyInfo.attributeName : originalKey;

      if (typeof value === 'string') {
        return `${propertyName}="${value}"`;
      }

      if (propertyName === "style" && typeof value === "object") {
        return convertStyleIntoAttribute(value as React.CSSProperties);
      }

      if (typeof value === 'object') {
        return `${propertyName}="${JSON.stringify(value)}"`;
      }

      // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
      return `${propertyName}="${value}"`;
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
