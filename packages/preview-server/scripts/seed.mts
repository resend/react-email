import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const previewServerRoot = path.resolve(dirname, '..');
const emailsDirectoryPath = path.join(previewServerRoot, 'emails');

const seedPath = path.join(dirname, './utils/default-seed/');

if (existsSync(emailsDirectoryPath)) {
  console.info('Deleting previous emails directory');
  await fs.rm(emailsDirectoryPath, { recursive: true, force: true });
}

console.info('Copying over the defalt seed to the emails directory');
await fs.cp(seedPath, emailsDirectoryPath, {
  recursive: true,
});
