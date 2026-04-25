import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { EmailsDirectory } from '../../get-emails-directory-metadata.js';
import {
  collectEmailTemplatePaths,
  isUnderAnyPath,
} from './extra-watch-paths.js';

describe('isUnderAnyPath()', () => {
  const roots = [path.resolve('/proj/i18n'), path.resolve('/proj/locales')];

  it('matches an exact root', () => {
    expect(isUnderAnyPath(path.resolve('/proj/i18n'), roots)).toBe(true);
  });

  it('matches a nested file under a root', () => {
    expect(
      isUnderAnyPath(path.resolve('/proj/i18n/messages/en.json'), roots),
    ).toBe(true);
  });

  it('does not match a sibling whose name shares a prefix', () => {
    expect(isUnderAnyPath(path.resolve('/proj/i18n-extra/file'), roots)).toBe(
      false,
    );
  });

  it('does not match an unrelated path', () => {
    expect(isUnderAnyPath(path.resolve('/proj/emails/welcome.tsx'), roots)).toBe(
      false,
    );
  });

  it('returns false when no roots are configured', () => {
    expect(isUnderAnyPath(path.resolve('/proj/i18n/x.json'), [])).toBe(false);
  });
});

describe('collectEmailTemplatePaths()', () => {
  it('flattens templates from the root and nested subdirectories', () => {
    const root: EmailsDirectory = {
      absolutePath: '/proj/emails',
      relativePath: '',
      directoryName: 'emails',
      emailFilenames: ['welcome.tsx', 'goodbye.tsx'],
      subDirectories: [
        {
          absolutePath: '/proj/emails/marketing',
          relativePath: 'marketing',
          directoryName: 'marketing',
          emailFilenames: ['promo.tsx'],
          subDirectories: [
            {
              absolutePath: '/proj/emails/marketing/seasonal',
              relativePath: 'marketing/seasonal',
              directoryName: 'seasonal',
              emailFilenames: ['holiday.tsx'],
              subDirectories: [],
            },
          ],
        },
      ],
    };

    expect(collectEmailTemplatePaths(root)).toEqual([
      path.join('/proj/emails', 'welcome.tsx'),
      path.join('/proj/emails', 'goodbye.tsx'),
      path.join('/proj/emails/marketing', 'promo.tsx'),
      path.join('/proj/emails/marketing/seasonal', 'holiday.tsx'),
    ]);
  });

  it('returns an empty list for an empty directory', () => {
    expect(
      collectEmailTemplatePaths({
        absolutePath: '/proj/emails',
        relativePath: '',
        directoryName: 'emails',
        emailFilenames: [],
        subDirectories: [],
      }),
    ).toEqual([]);
  });
});
