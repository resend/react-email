import fs from 'node:fs';
import path from 'node:path';
import { getEmailsDirectoryMetadata } from './get-emails-directory-metadata';

describe('JavaScript Email Detection', () => {
  const testingDir = path.resolve(__dirname, 'testing');

  test('should detect JavaScript files with ES6 export default syntax', async () => {
    const emailsMetadata = await getEmailsDirectoryMetadata(testingDir, true);

    expect(emailsMetadata).toBeDefined();
    expect(emailsMetadata?.emailFilenames).toContain(
      'js-email-export-default.js',
    );
  });

  test('should detect JavaScript files with CommonJS module.exports', async () => {
    const emailsMetadata = await getEmailsDirectoryMetadata(testingDir, true);

    expect(emailsMetadata).toBeDefined();
    expect(emailsMetadata?.emailFilenames).toContain('js-email-test.js');
  });

  test('should detect MDX-style JavaScript files with named exports', async () => {
    const emailsMetadata = await getEmailsDirectoryMetadata(testingDir, true);

    expect(emailsMetadata).toBeDefined();
    expect(emailsMetadata?.emailFilenames).toContain('mdx-email-test.js');
  });

  // This test will help us understand the current behavior
  test('debug: examine the regex pattern used for detection', () => {
    // Read the file content
    const jsExportDefaultFile = path.join(
      testingDir,
      'js-email-export-default.js',
    );
    const jsModuleExportsFile = path.join(testingDir, 'js-email-test.js');
    const mdxEmailFile = path.join(testingDir, 'mdx-email-test.js');

    const exportDefaultContent = fs.readFileSync(jsExportDefaultFile, 'utf8');
    const moduleExportsContent = fs.readFileSync(jsModuleExportsFile, 'utf8');
    const mdxEmailContent = fs.readFileSync(mdxEmailFile, 'utf8');

    // Test the current regex pattern
    const currentPattern = /\bexport\s+default\b/gm;
    const moduleExportsPattern = /\bmodule\.exports\s*=/gm;
    const namedExportPattern = /\bexport\s+\{/gm;

    expect(currentPattern.test(exportDefaultContent)).toBe(true);
    expect(moduleExportsPattern.test(moduleExportsContent)).toBe(true);
    expect(namedExportPattern.test(mdxEmailContent)).toBe(true);
  });
});
