import fs from 'node:fs';
import path from 'node:path';
import { installPreviewServer } from './get-preview-server-location.js';

test.sequential('installPreviewServer()', { timeout: 60_000 }, async () => {
  const testDirectory = path.join(import.meta.dirname, '.test');
  // Pinned version here because the one in `package.json` might be unreleased
  const version = '5.2.5';
  await installPreviewServer(testDirectory, version);
  expect(fs.existsSync(testDirectory)).toBe(true);

  const importedModule = await import(path.join(testDirectory, 'index.mjs'));
  expect({ ...importedModule }).toEqual({
    version,
  });
  await fs.promises.rm(testDirectory, { recursive: true, force: true });
});
