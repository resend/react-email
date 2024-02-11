import path from 'node:path';
import { getEmailsDirectoryMetadata } from './get-emails-directory-metadata';

test('getEmailsDirectoryMetadata on demo emails', async () => {
  expect(
    await getEmailsDirectoryMetadata(
      path.resolve(__dirname, '../../../../apps/demo/emails/'),
    ),
  ).toEqual({
    absolutePath: path.resolve(__dirname, '../../../../apps/demo/emails/'),
    directoryName: 'emails',
    emailFilenames: [
      'airbnb-review.tsx',
      'amazon-review.tsx',
      'apple-receipt.tsx',
      'aws-verify-email.tsx',
      'codepen-challengers.tsx',
      'dropbox-reset-password.tsx',
      'github-access-token.tsx',
      'google-play-policy-update.tsx',
      'koala-welcome.tsx',
      'linear-login-code.tsx',
      'netlify-welcome.tsx',
      'nike-receipt.tsx',
      'notion-magic-link.tsx',
      'plaid-verify-identity.tsx',
      'raycast-magic-link.tsx',
      'slack-confirm.tsx',
      'stack-overflow-tips.tsx',
      'stripe-welcome.tsx',
      'twitch-reset-password.tsx',
      'vercel-invite-user.tsx',
      'yelp-recent-login.tsx',
    ],
    subDirectories: [],
  });
});
