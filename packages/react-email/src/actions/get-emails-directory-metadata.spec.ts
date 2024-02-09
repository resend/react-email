import path from 'node:path';
import { getEmailsDirectoryMetadata } from './get-emails-directory-metadata';

test('getEmailsDirectoryMetadata on demo emails', async () => {
  const emailsDirectoryPath = path.resolve(
    __dirname,
    '../../../../apps/demo/emails/',
  );
  expect(await getEmailsDirectoryMetadata(emailsDirectoryPath)).toEqual({
    absolutePath: emailsDirectoryPath,
    directoryName: 'emails',
    emailFilenames: [],
    subDirectories: [
      {
        absolutePath: `${emailsDirectoryPath}/magic-links`,
        directoryName: 'magic-links',
        emailFilenames: [
          'aws-verify-email.tsx',
          'linear-login-code.tsx',
          'notion-magic-link.tsx',
          'plaid-verify-identity.tsx',
          'raycast-magic-link.tsx',
          'slack-confirm.tsx',
        ],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/newsletters`,
        directoryName: 'newsletters',
        emailFilenames: [
          'codepen-challengers.tsx',
          'google-play-policy-update.tsx',
          'stack-overflow-tips.tsx',
        ],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/notifications`,
        directoryName: 'notifications',
        emailFilenames: [
          'github-access-token.tsx',
          'vercel-invite-user.tsx',
          'yelp-recent-login.tsx',
        ],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/receipts`,
        directoryName: 'receipts',
        emailFilenames: ['apple-receipt.tsx', 'nike-receipt.tsx'],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/reset-password`,
        directoryName: 'reset-password',
        emailFilenames: [
          'dropbox-reset-password.tsx',
          'twitch-reset-password.tsx',
        ],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/reviews`,
        directoryName: 'reviews',
        emailFilenames: ['airbnb-review.tsx', 'amazon-review.tsx'],
        subDirectories: [],
      },
      {
        absolutePath: `${emailsDirectoryPath}/welcome`,
        directoryName: 'welcome',
        emailFilenames: [
          'koala-welcome.tsx',
          'netlify-welcome.tsx',
          'stripe-welcome.tsx',
        ],
        subDirectories: [],
      },
    ],
  });
});
