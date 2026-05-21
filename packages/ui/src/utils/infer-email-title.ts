import { removeFilenameExtension } from './contains-email-template';

/**
 * Infers a human-readable title from an email template filename.
 *
 * Handles the most common naming conventions React users reach for:
 * kebab-case, snake_case, camelCase, and PascalCase. Acronyms (sequences
 * of consecutive uppercase letters) are preserved as a single word.
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
  const nameWithoutExtension = removeFilenameExtension(filename);

  const withSeparatorsAsSpaces = nameWithoutExtension.replace(/[-_.]+/g, ' ');

  // Split camelCase/PascalCase boundaries. The first rule covers the
  // common lowercase/digit -> uppercase transition (e.g. `verifyPassword`).
  // The second rule preserves acronyms but separates the trailing word
  // (e.g. `APIKey` -> `API Key`, `MFAEmail` -> `MFA Email`). It requires
  // at least two leading capitals so PascalCase tokens that happen to
  // start with two capitals followed by a lowercase letter — like `OAuth`
  // — aren't mis-split into `O Auth`.
  const withWordBoundaries = withSeparatorsAsSpaces
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2');

  const normalized = withWordBoundaries.replace(/\s+/g, ' ').trim();

  if (normalized.length === 0) {
    return '';
  }

  return normalized
    .split(' ')
    .map((word) => {
      // Preserve acronyms (all uppercase, >1 char) so things like `API` stay
      // intact instead of becoming `Api`.
      if (word.length > 1 && word === word.toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
