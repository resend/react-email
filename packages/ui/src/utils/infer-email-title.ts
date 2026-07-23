import { removeFilenameExtension } from './contains-email-template';
import { humanizeIdentifier } from './humanize-identifier';

/**
 * Infers a human-readable title from an email template filename.
 *
 * @example
 *   inferEmailTitle('verify-password.tsx')      // 'Verify Password'
 *   inferEmailTitle('verifyPassword.tsx')       // 'Verify Password'
 *   inferEmailTitle('VerifyPassword.tsx')       // 'Verify Password'
 *   inferEmailTitle('verify_password.tsx')      // 'Verify Password'
 *   inferEmailTitle('APIKey.tsx')               // 'API Key'
 *   inferEmailTitle('MFAEmail.tsx')             // 'MFA Email'
 */
export function inferEmailTitle(filename: string): string {
  return humanizeIdentifier(removeFilenameExtension(filename));
}
