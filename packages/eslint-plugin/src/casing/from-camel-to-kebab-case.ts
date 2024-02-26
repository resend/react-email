export function fromCaemlToKebabCase(camelCased: string): string {
  return camelCased.replaceAll(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}
