import { inferEmailTitle } from './infer-email-title';

describe('inferEmailTitle()', () => {
  it('handles kebab-case filenames', () => {
    expect(inferEmailTitle('verify-password.tsx')).toBe('Verify Password');
    expect(inferEmailTitle('notion-magic-link.tsx')).toBe('Notion Magic Link');
    expect(inferEmailTitle('getting-started-with-react.tsx')).toBe(
      'Getting Started With React',
    );
  });

  it('handles snake_case filenames', () => {
    expect(inferEmailTitle('verify_password.tsx')).toBe('Verify Password');
    expect(inferEmailTitle('reset_password_request.tsx')).toBe(
      'Reset Password Request',
    );
  });

  it('handles camelCase filenames', () => {
    expect(inferEmailTitle('verifyPassword.tsx')).toBe('Verify Password');
    expect(inferEmailTitle('welcomeEmail.tsx')).toBe('Welcome Email');
    expect(inferEmailTitle('orderConfirmation.tsx')).toBe('Order Confirmation');
  });

  it('handles PascalCase filenames', () => {
    expect(inferEmailTitle('VerifyPassword.tsx')).toBe('Verify Password');
    expect(inferEmailTitle('WelcomeEmail.tsx')).toBe('Welcome Email');
  });

  it('preserves acronyms', () => {
    expect(inferEmailTitle('APIKey.tsx')).toBe('API Key');
    expect(inferEmailTitle('MFAEmail.tsx')).toBe('MFA Email');
    expect(inferEmailTitle('NewAPIToken.tsx')).toBe('New API Token');
  });

  it('handles single-word filenames', () => {
    expect(inferEmailTitle('welcome.tsx')).toBe('Welcome');
    expect(inferEmailTitle('Welcome.tsx')).toBe('Welcome');
  });

  it('handles mixed conventions', () => {
    expect(inferEmailTitle('verify-passwordEmail.tsx')).toBe(
      'Verify Password Email',
    );
    expect(inferEmailTitle('reset_PasswordRequest.tsx')).toBe(
      'Reset Password Request',
    );
  });

  it('keeps digits attached to adjacent letters', () => {
    expect(inferEmailTitle('email2FA.tsx')).toBe('Email2 FA');
    expect(inferEmailTitle('welcome2023.tsx')).toBe('Welcome2023');
  });

  it('handles filenames without an extension', () => {
    expect(inferEmailTitle('verify-password')).toBe('Verify Password');
    expect(inferEmailTitle('verifyPassword')).toBe('Verify Password');
  });

  it('handles filenames with multiple dots', () => {
    expect(inferEmailTitle('verify-password.spec.tsx')).toBe(
      'Verify Password Spec',
    );
  });

  it('returns an empty string for empty input', () => {
    expect(inferEmailTitle('')).toBe('');
    expect(inferEmailTitle('.tsx')).toBe('');
  });
});
