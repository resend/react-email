export function fromCamelToKebabCase(camelCased: string): string {
  return camelCased.replaceAll(
    /[A-Z]/g,
    (match) => `-${match.toLowerCase()}`,
  );
}
