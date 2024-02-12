import path from 'node:path';
import fs from 'node:fs';
import { createStarter } from './create-starter';

test('create-email behavior', async () => {
  const testingTemporaryFolderPath = path.resolve(__dirname, '../.testing-temp');
  await createStarter(testingTemporaryFolderPath);

  expect(fs.existsSync(testingTemporaryFolderPath)).toBe(true);
});
