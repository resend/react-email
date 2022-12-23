import fs from 'fs';

export const checkDirectoryExist = (path: string): boolean =>
  fs.existsSync(path);
