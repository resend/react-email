export function isFirstDepthGlob(glob: string): boolean {
  return glob.split("*").length === 2 && glob.endsWith("*");
}
