import path from "node:path";

export const convertToAbsolutePath = (dir: string) =>
  path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
