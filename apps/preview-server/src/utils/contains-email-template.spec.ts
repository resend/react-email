import path from 'node:path';
import {
  containsEmailTemplate,
  removeFilenameExtension,
} from './contains-email-template';

describe('removeFilenameExtension()', async () => {
  it('should work with a single .', () => {
    expect(removeFilenameExtension('email-template.tsx')).toBe(
      'email-template',
    );
  });

  it('should work with an example test file', () => {
    expect(removeFilenameExtension('email-template.spec.tsx')).toBe(
      'email-template.spec',
    );
  });

  it('should do nothing when there is no extension', () => {
    expect(removeFilenameExtension('email-template')).toBe('email-template');
  });
});

test('containsEmailTemplate()', async () => {
  const emailsDirectoryPath = path.resolve(
    __dirname,
    '../../../../apps/demo/emails',
  );
  const directory = {
    absolutePath: emailsDirectoryPath,
    directoryName: 'emails',
    relativePath: '',
    emailFilenames: [],
    subDirectories: [
      {
        absolutePath: `${emailsDirectoryPath}/magic-links`,
        directoryName: 'magic-links',
        relativePath: 'magic-links',
        emailFilenames: [
          'aws-verify-email',
          'linear-login-code',
          'notion-magic-link',
          'plaid-verify-identity',
          'raycast-magic-link',
          'slack-confirm',
        ],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/newsletters`,
        directoryName: 'newsletters',
        relativePath: 'newsletters',
        emailFilenames: [
          'codepen-challengers',
          'google-play-policy-update',
          'stack-overflow-tips',
        ],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/notifications`,
        directoryName: 'notifications',
        relativePath: 'notifications',
        emailFilenames: [
          'github-access-token',
          'papermark-year-in-review',
          'vercel-invite-user',
          'yelp-recent-login',
        ],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/receipts`,
        directoryName: 'receipts',
        relativePath: 'receipts',
        emailFilenames: ['apple-receipt', 'nike-receipt'],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/reset-password`,
        directoryName: 'reset-password',
        relativePath: 'reset-password',
        emailFilenames: ['dropbox-reset-password', 'twitch-reset-password'],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/reviews`,
        directoryName: 'reviews',
        relativePath: 'reviews',
        emailFilenames: ['airbnb-review', 'amazon-review'],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/welcome`,
        directoryName: 'welcome',
        relativePath: 'welcome',
        emailFilenames: ['koala-welcome', 'netlify-welcome', 'stripe-welcome'],
        subDirectories: [],
      },
    ],
  };
  expect(containsEmailTemplate('welcome/koala-welcome', directory)).toBe(true);
  expect(containsEmailTemplate('welcome/missing-template', directory)).toBe(
    false,
  );
});
