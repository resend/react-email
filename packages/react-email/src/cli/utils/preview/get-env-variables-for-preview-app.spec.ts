import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { getEnvVariablesForPreviewApp } from './get-env-variables-for-preview-app';

describe('getEnvVariablesForPreviewApp()', () => {
  let temporaryDirectory = '';

  beforeEach(() => {
    temporaryDirectory = fs.mkdtempSync(
      path.join(os.tmpdir(), 'react-email-preview-env-'),
    );
  });

  afterEach(() => {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  });

  it('includes the discovered email config path', () => {
    const emailConfigPath = path.join(temporaryDirectory, 'email.config.cts');
    fs.writeFileSync(emailConfigPath, 'export default {};\n', 'utf8');

    expect(
      getEnvVariablesForPreviewApp('emails', '/preview', temporaryDirectory),
    ).toMatchObject({
      REACT_EMAIL_INTERNAL_EMAIL_CONFIG_PATH: emailConfigPath,
      REACT_EMAIL_INTERNAL_EMAILS_DIR_RELATIVE_PATH: 'emails',
      REACT_EMAIL_INTERNAL_EMAILS_DIR_ABSOLUTE_PATH: path.join(
        temporaryDirectory,
        'emails',
      ),
      REACT_EMAIL_INTERNAL_PREVIEW_SERVER_LOCATION: '/preview',
      REACT_EMAIL_INTERNAL_USER_PROJECT_LOCATION: temporaryDirectory,
    });
  });
});
