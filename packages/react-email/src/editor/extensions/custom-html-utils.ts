/**
 * @returns HTMLElement
 */
export function elementFromString(value: string) {
  const wrappedValue = `<body>${value}</body>`;
  return new window.DOMParser().parseFromString(wrappedValue, 'text/html').body;
}
