import {
  containsEmailTemplate,
  removeFilenameExtension,
} from './contains-email-template';
import type { EmailsDirectory } from './get-emails-directory-metadata';

describe('removeFilenameExtension()', () => {
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

describe('containsEmailTemplate()', () => {
  const directory: EmailsDirectory = {
    absolutePath: '/fake/path/emails',
    directoryName: 'emails',
    relativePath: '',
    emailFilenames: [],
    subDirectories: [
      {
        absolutePath: '/fake/path/emails/magic-links',
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
        subDirectories: [
          {
            absolutePath: '/fake/path/emails/magic-links/resend',
            directoryName: 'resend',
            emailFilenames: ['verify-email'],
            relativePath: 'magic-links/resend',
            subDirectories: [],
          },
        ],
      },
      {
        absolutePath: '/fake/path/emails/newsletters',
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
        absolutePath: '/fake/path/emails/notifications',
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
        absolutePath: '/fake/path/emails/receipts',
        directoryName: 'receipts',
        relativePath: 'receipts',
        emailFilenames: ['apple-receipt', 'nike-receipt'],
        subDirectories: [],
      },
      {
        absolutePath: '/fake/path/emails/reset-password',
        directoryName: 'reset-password',
        relativePath: 'reset-password',
        emailFilenames: ['dropbox-reset-password', 'twitch-reset-password'],
        subDirectories: [],
      },
      {
        absolutePath: '/fake/path/emails/reviews',
        directoryName: 'reviews',
        relativePath: 'reviews',
        emailFilenames: ['airbnb-review', 'amazon-review'],
        subDirectories: [],
      },
      {
        absolutePath: '/fake/path/emails/welcome',
        directoryName: 'welcome',
        relativePath: 'welcome',
        emailFilenames: ['koala-welcome', 'netlify-welcome', 'stripe-welcome'],
        subDirectories: [],
      },
    ],
  };
  it('should work with email inside a single sub directory', () => {
    expect(containsEmailTemplate('welcome/koala-welcome', directory)).toBe(
      true,
    );
    expect(containsEmailTemplate('welcome/missing-template', directory)).toBe(
      false,
    );
  });

  it('should work with email inside a second sub directory', () => {
    expect(
      containsEmailTemplate('magic-links/resend/verify-email', directory),
    ).toBe(true);
    expect(
      containsEmailTemplate('magic-links/resend/missing-template', directory),
    ).toBe(false);
  });
});
