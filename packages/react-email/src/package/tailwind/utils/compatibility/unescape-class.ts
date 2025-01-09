export function unescapeClass(singleClass: string) {
  return singleClass.replaceAll(/\\[0-9]|\\/g, '');
}
