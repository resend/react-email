import fs from 'fs';

export const createDirectory = async (directory: string) =>
  fs.promises.mkdir(directory, { recursive: true });
