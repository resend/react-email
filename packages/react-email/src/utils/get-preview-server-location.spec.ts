import fs from 'node:fs';
import path from 'node:path';
import { installPreviewServer } from './get-preview-server-location.js';
import { packageJson } from './packageJson.js';

test.sequential('installPreviewServer()', { timeout: 10_000 }, async () => {
  const testDirectory = path.join(import.meta.dirname, '.test');
  await installPreviewServer(testDirectory, packageJson.version);
  expect(fs.existsSync(testDirectory)).toBe(true);

  // @ts-expect-error The directory should exist at this point
  const importedModule = await import(path.join(testDirectory, 'index.mjs'));
  expect({ ...importedModule }).toEqual({
    version: packageJson.version,
  });
  await fs.promises.rm(testDirectory, { recursive: true, force: true });
});
