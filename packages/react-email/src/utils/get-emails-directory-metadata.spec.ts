import path from 'node:path';
import { getEmailsDirectoryMetadata } from './get-emails-directory-metadata';

test('getEmailsDirectoryMetadata on demo emails', async () => {
  const emailsDirectoryPath = path.resolve(
    __dirname,
    '../../../../apps/demo/emails',
  );
  expect(await getEmailsDirectoryMetadata(emailsDirectoryPath)).toEqual({
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
          'jobaccepted-magic-link',
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
  });
});
