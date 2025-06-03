/**
 * this file is required so that import.meta.resolve and require.resolve can properly can find the module for this package
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const packageJson = JSON.parse(
  await fs.readFile(path.join(dirname, 'package.json'), 'utf-8'),
);

/**
 * @type {string}
 */
export const version = packageJson.version;
