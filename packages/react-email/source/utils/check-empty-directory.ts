import fs from 'fs';

export const checkEmptyDirectory = async (path: string): Promise<boolean> => {
  const files = await fs.promises.readdir(path);
  return files.length === 0;
};
