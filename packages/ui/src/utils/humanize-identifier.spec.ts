import { humanizeIdentifier } from './humanize-identifier';

describe('humanizeIdentifier()', () => {
  it('converts camelCase', () => {
    expect(humanizeIdentifier('inviterName')).toBe('Inviter Name');
    expect(humanizeIdentifier('itemCount')).toBe('Item Count');
  });

  it('converts PascalCase', () => {
    expect(humanizeIdentifier('VerifyPassword')).toBe('Verify Password');
  });

  it('converts kebab-case and snake_case', () => {
    expect(humanizeIdentifier('verify-password')).toBe('Verify Password');
    expect(humanizeIdentifier('verify_password')).toBe('Verify Password');
  });

  it('capitalizes single words', () => {
    expect(humanizeIdentifier('username')).toBe('Username');
  });

  it('preserves acronyms', () => {
    expect(humanizeIdentifier('APIKey')).toBe('API Key');
    expect(humanizeIdentifier('userURL')).toBe('User URL');
    expect(humanizeIdentifier('OAuthToken')).toBe('OAuth Token');
  });

  it('handles digits within identifiers', () => {
    expect(humanizeIdentifier('address2Line')).toBe('Address2 Line');
  });

  it('returns an empty string for empty input', () => {
    expect(humanizeIdentifier('')).toBe('');
  });
});
