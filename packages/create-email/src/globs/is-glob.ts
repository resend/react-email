export function isGlob(possibleGlob: string): boolean {
  return /[*{}?[\]]/.test(possibleGlob);
}
