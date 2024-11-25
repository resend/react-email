
const uppercasePattern = /([A-Z])/g;
const msPattern = /^ms-/;
export function hyphenateStyleName(name: string): string {
  return name
    .replace(uppercasePattern, '-$1')
    .toLowerCase()
    .replace(msPattern, '-ms-');
}
