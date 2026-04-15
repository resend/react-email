import path from 'node:path';
import { getEmailsDirectoryMetadata } from './get-emails-directory-metadata.js';

test('getEmailsDirectoryMetadata on demo emails', async () => {
  const emailsDirectoryPath = path.resolve(
    __dirname,
    '../../../../../apps/demo/emails',
  );
  expect(
    await getEmailsDirectoryMetadata(emailsDirectoryPath),
  ).toMatchInlineSnapshot(`
    {
      "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails",
      "directoryName": "emails",
      "emailFilenames": [],
      "relativePath": "",
      "subDirectories": [
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/barebones",
          "directoryName": "barebones",
          "emailFilenames": [
            "activation",
            "feature-announcement",
            "password-reset",
            "product-update",
            "subscription-confirmation",
            "subscription-update",
            "text-only",
            "welcome",
          ],
          "relativePath": "barebones",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/collage",
          "directoryName": "collage",
          "emailFilenames": [
            "activation",
            "feature-announcement",
            "password-reset",
            "product-update",
            "subscription-confirmation",
            "subscription-update",
            "text-only",
            "welcome",
          ],
          "relativePath": "collage",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/dither",
          "directoryName": "dither",
          "emailFilenames": [
            "activation",
            "feature-announcement",
            "password-reset",
            "product-update",
            "subscription-confirmation",
            "subscription-update",
            "text-only",
            "welcome",
          ],
          "relativePath": "dither",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/magic-links",
          "directoryName": "magic-links",
          "emailFilenames": [
            "aws-verify-email",
            "linear-login-code",
            "notion-magic-link",
            "plaid-verify-identity",
            "raycast-magic-link",
            "slack-confirm",
          ],
          "relativePath": "magic-links",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/newsletters",
          "directoryName": "newsletters",
          "emailFilenames": [
            "codepen-challengers",
            "google-play-policy-update",
            "stack-overflow-tips",
          ],
          "relativePath": "newsletters",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/notifications",
          "directoryName": "notifications",
          "emailFilenames": [
            "github-access-token",
            "papermark-year-in-review",
            "vercel-invite-user",
            "yelp-recent-login",
          ],
          "relativePath": "notifications",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/receipts",
          "directoryName": "receipts",
          "emailFilenames": [
            "apple-receipt",
            "nike-receipt",
          ],
          "relativePath": "receipts",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/reset-password",
          "directoryName": "reset-password",
          "emailFilenames": [
            "dropbox-reset-password",
            "twitch-reset-password",
          ],
          "relativePath": "reset-password",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/reviews",
          "directoryName": "reviews",
          "emailFilenames": [
            "airbnb-review",
            "amazon-review",
          ],
          "relativePath": "reviews",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/skin",
          "directoryName": "skin",
          "emailFilenames": [
            "abandoned-cart",
            "activation",
            "newsletter",
            "order-confirmation",
            "order-shipping",
            "password-reset",
            "promo",
            "welcome",
          ],
          "relativePath": "skin",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/tech",
          "directoryName": "tech",
          "emailFilenames": [
            "abandoned-cart",
            "activation",
            "newsletter",
            "order-confirmation",
            "order-shipping",
            "password-reset",
            "promo",
            "welcome",
          ],
          "relativePath": "tech",
          "subDirectories": [],
        },
        {
          "absolutePath": "/home/gabriel/programming/resend/open-source/react-email/apps/demo/emails/welcome",
          "directoryName": "welcome",
          "emailFilenames": [
            "koala-welcome",
            "netlify-welcome",
            "stripe-welcome",
          ],
          "relativePath": "welcome",
          "subDirectories": [],
        },
      ],
    }
  `);
});
