import fs from 'fs';
export const checkDirectoryExist = (path) => fs.existsSync(path);
