import path from 'node:path';
import { getEmailsDirectoryMetadata } from './get-emails-directory-metadata';

describe('JavaScript Email Detection', async () => {
  const testingDir = path.resolve(__dirname, 'testing');
  const emailsMetadata = await getEmailsDirectoryMetadata(testingDir, true);

  it('detects JavaScript files with ES6 export default syntax', async () => {
    expect(emailsMetadata).toBeDefined();
    expect(emailsMetadata?.emailFilenames).toContain(
      'js-email-export-default.js',
    );
  });

  it('detects JavaScript files with CommonJS module.exports', async () => {
    expect(emailsMetadata).toBeDefined();
    expect(emailsMetadata?.emailFilenames).toContain('js-email-test.js');
  });

  it('detects MDX-style JavaScript files with named exports', async () => {
    expect(emailsMetadata).toBeDefined();
    expect(emailsMetadata?.emailFilenames).toContain('mdx-email-test.js');
  });
});
