import path from 'node:path';
import { getEmailsDirectoryMetadata } from './get-emails-directory-metadata.js';

test('getEmailsDirectoryMetadata on demo emails', async () => {
  const emailsDirectoryPath = path.resolve(
    __dirname,
    '../../../../../apps/demo/emails',
  );
  expect(await getEmailsDirectoryMetadata(emailsDirectoryPath)).toEqual({
    absolutePath: emailsDirectoryPath,
    directoryName: 'emails',
    relativePath: '',
    emailFilenames: [],
    subDirectories: [
      {
        absolutePath: path.join(emailsDirectoryPath, '01-Barebone'),
        directoryName: '01-Barebone',
        relativePath: '01-Barebone',
        emailFilenames: [
          'activation',
          'feature-announcement',
          'password-reset',
          'product-update',
          'subscription-confirmation',
          'subscription-update',
          'text-only',
          'welcome',
        ],
        subDirectories: [],
      },
      {
        absolutePath: path.join(emailsDirectoryPath, '02-Matte'),
        directoryName: '02-Matte',
        relativePath: '02-Matte',
        emailFilenames: [
          'activation',
          'feature-announcement',
          'password-reset',
          'product-update',
          'subscription-confirmation',
          'subscription-update',
          'text-only',
          'welcome',
        ],
        subDirectories: [],
      },
      {
        absolutePath: path.join(emailsDirectoryPath, '03-Protocol'),
        directoryName: '03-Protocol',
        relativePath: '03-Protocol',
        emailFilenames: [
          'activation',
          'feature-announcement',
          'password-reset',
          'product-update',
          'subscription-confirmation',
          'subscription-update',
          'text-only',
          'welcome',
        ],
        subDirectories: [],
      },
      {
        absolutePath: path.join(emailsDirectoryPath, '04-Arcane'),
        directoryName: '04-Arcane',
        relativePath: '04-Arcane',
        emailFilenames: [
          'abandoned-cart',
          'activation',
          'newsletter',
          'order-confirmation',
          'order-shipping',
          'password-reset',
          'promo',
          'welcome',
        ],
        subDirectories: [],
      },
      {
        absolutePath: path.join(emailsDirectoryPath, '05-Studio'),
        directoryName: '05-Studio',
        relativePath: '05-Studio',
        emailFilenames: [
          'abandoned-cart',
          'activation',
          'newsletter',
          'order-confirmation',
          'order-shipping',
          'password-reset',
          'promo',
          'welcome',
        ],
        subDirectories: [],
      },
      {
        absolutePath: path.join(emailsDirectoryPath, 'Community'),
        directoryName: 'Community',
        relativePath: 'Community',
        emailFilenames: [],
        subDirectories: [
          {
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'ecommerce',
            ),
            directoryName: 'ecommerce',
            relativePath: path.join('Community', 'ecommerce'),
            emailFilenames: [
              '01-order-created',
              '02-order-confirmed',
              '03-order-shipped',
              '04-order-delivered',
            ],
            subDirectories: [],
          },
          {
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'magic-links',
            ),
            directoryName: 'magic-links',
            relativePath: path.join('Community', 'magic-links'),
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
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'newsletters',
            ),
            directoryName: 'newsletters',
            relativePath: path.join('Community', 'newsletters'),
            emailFilenames: [
              'codepen-challengers',
              'google-play-policy-update',
              'stack-overflow-tips',
            ],
            subDirectories: [],
          },
          {
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'notifications',
            ),
            directoryName: 'notifications',
            relativePath: path.join('Community', 'notifications'),
            emailFilenames: [
              'github-access-token',
              'papermark-year-in-review',
              'vercel-invite-user',
              'yelp-recent-login',
            ],
            subDirectories: [],
          },
          {
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'receipts',
            ),
            directoryName: 'receipts',
            relativePath: path.join('Community', 'receipts'),
            emailFilenames: ['apple-receipt', 'nike-receipt'],
            subDirectories: [],
          },
          {
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'reset-password',
            ),
            directoryName: 'reset-password',
            relativePath: path.join('Community', 'reset-password'),
            emailFilenames: ['dropbox-reset-password', 'twitch-reset-password'],
            subDirectories: [],
          },
          {
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'reviews',
            ),
            directoryName: 'reviews',
            relativePath: path.join('Community', 'reviews'),
            emailFilenames: ['airbnb-review', 'amazon-review'],
            subDirectories: [],
          },
          {
            absolutePath: path.join(
              emailsDirectoryPath,
              'Community',
              'welcome',
            ),
            directoryName: 'welcome',
            relativePath: path.join('Community', 'welcome'),
            emailFilenames: [
              'koala-welcome',
              'netlify-welcome',
              'stripe-welcome',
            ],
            subDirectories: [],
          },
        ],
      },
    ],
  });
});
