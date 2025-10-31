export function snakeToCamel(snakeStr: string) {
  return snakeStr
    .toLowerCase()
    .replace(/-+([a-z])/g, (_match, letter) => letter.toUpperCase());
}
