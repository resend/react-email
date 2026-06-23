import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  getEmailConfigPath,
  supportedEmailConfigFilenames,
} from './get-email-config-path';

describe('getEmailConfigPath()', () => {
  let temporaryDirectory = '';

  beforeEach(() => {
    temporaryDirectory = fs.mkdtempSync(
      path.join(os.tmpdir(), 'react-email-config-path-'),
    );
  });

  afterEach(() => {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it('returns undefined when there is no config file', () => {
    expect(getEmailConfigPath(temporaryDirectory)).toBeUndefined();
  });

  it.each(
    supportedEmailConfigFilenames,
  )('detects a %s config file', (filename) => {
    const emailConfigPath = path.join(temporaryDirectory, filename);
    fs.writeFileSync(emailConfigPath, 'export default {};\n', 'utf8');

    expect(getEmailConfigPath(temporaryDirectory)).toBe(emailConfigPath);
  });

  it('prefers the first supported filename when multiple configs exist', () => {
    for (const filename of supportedEmailConfigFilenames) {
      fs.writeFileSync(
        path.join(temporaryDirectory, filename),
        'export default {};\n',
        'utf8',
      );
    }

    expect(getEmailConfigPath(temporaryDirectory)).toBe(
      path.join(temporaryDirectory, supportedEmailConfigFilenames[0]!),
    );
  });
});
