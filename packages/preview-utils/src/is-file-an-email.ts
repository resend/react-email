import fs from 'node:fs';
import path from 'node:path';

export const isFileAnEmail = (fullPath: string): boolean => {
  const stat = fs.statSync(fullPath);

  if (stat.isDirectory()) return false;

  const { ext } = path.parse(fullPath);

  if (!['.js', '.tsx', '.jsx'].includes(ext)) return false;

  // This is to avoid a possible race condition where the file doesn't exist anymore
  // once we are checking if it is an actual email, this couuld cause issues that
  // would be very hard to debug and find out the why of it happening.
  if (!fs.existsSync(fullPath)) {
    return false;
  }

  // check with a heuristic to see if the file has at least
  // a default export
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  return /\bexport\s+default\b/gm.test(fileContents);
};
