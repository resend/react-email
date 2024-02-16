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
      'airbnb-review',
      'amazon-review',
      'apple-receipt',
      'aws-verify-email',
      'codepen-challengers',
      'dropbox-reset-password',
      'github-access-token',
      'google-play-policy-update',
      'koala-welcome',
      'linear-login-code',
      'netlify-welcome',
      'nike-receipt',
      'notion-magic-link',
      'plaid-verify-identity',
      'raycast-magic-link',
      'slack-confirm',
      'stack-overflow-tips',
      'stripe-welcome',
      'twitch-reset-password',
      'vercel-invite-user',
      'yelp-recent-login',
    ],
    subDirectories: [],
  });
});
