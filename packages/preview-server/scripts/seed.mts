import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const previewServerRoot = path.resolve(dirname, '..');
const emailsDirectoryPath = path.join(previewServerRoot, 'emails');

const seedPath = path.join(dirname, './utils/default-seed/');

if (existsSync(emailsDirectoryPath)) {
  console.info(
    'Deleting all files inside the emails directory (except for .gitkeep)',
  );
  const files = await fs.readdir(emailsDirectoryPath);
  for await (const file of files) {
    if (file === '.gitkeep') {
      continue;
    }
    await fs.rm(file, { recursive: true, force: true });
  }
}

console.info('Copying over the defalt seed to the emails directory');
await fs.cp(seedPath, emailsDirectoryPath, {
  recursive: true,
});
