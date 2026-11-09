import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { EmailsDirectory } from './get-emails-directory-metadata';
import { planHotReloadRerender } from './plan-hot-reload-rerender';
import type { HotReloadChange } from './types/hot-reload-change';

const emailsDir = path.resolve('/emails');

const metadata: EmailsDirectory = {
  absolutePath: emailsDir,
  relativePath: '',
  directoryName: 'emails',
  emailFilenames: ['email-001', 'email-002', 'email-003', 'email-004'],
  subDirectories: [],
};

const resolveEmailPathFromSlug = async (slug: string) =>
  path.join(emailsDir, slug);

const pathOf = (filename: string) => path.join(emailsDir, filename);

// Mirrors what the CLI watcher emits when a shared component under `_components`
// is saved: the component itself plus one change per dependent template.
const sharedComponentSaveChanges: HotReloadChange[] = [
  { event: 'change', filename: '_components/button.tsx' },
  { event: 'change', filename: 'email-001.tsx' },
  { event: 'change', filename: 'email-002.tsx' },
  { event: 'change', filename: 'email-003.tsx' },
  { event: 'change', filename: 'email-004.tsx' },
];

describe('planHotReloadRerender()', () => {
  it('re-renders only the open preview and invalidates the other dependents', async () => {
    const { pathToRerender, pathsToInvalidate } = await planHotReloadRerender(
      sharedComponentSaveChanges,
      pathOf('email-001.tsx'),
      metadata,
      resolveEmailPathFromSlug,
    );

    expect(pathToRerender).toBe(pathOf('email-001.tsx'));
    expect(pathsToInvalidate).toEqual([
      pathOf('email-002.tsx'),
      pathOf('email-003.tsx'),
      pathOf('email-004.tsx'),
    ]);
  });

  it('ignores changes that are not email templates (the shared component itself)', async () => {
    const { pathToRerender, pathsToInvalidate } = await planHotReloadRerender(
      [{ event: 'change', filename: '_components/button.tsx' }],
      pathOf('email-001.tsx'),
      metadata,
      resolveEmailPathFromSlug,
    );

    expect(pathToRerender).toBeNull();
    expect(pathsToInvalidate).toEqual([]);
  });

  it('does not re-render anything when the open preview is unaffected', async () => {
    const { pathToRerender, pathsToInvalidate } = await planHotReloadRerender(
      [{ event: 'change', filename: 'email-002.tsx' }],
      pathOf('email-001.tsx'),
      metadata,
      resolveEmailPathFromSlug,
    );

    expect(pathToRerender).toBeNull();
    expect(pathsToInvalidate).toEqual([pathOf('email-002.tsx')]);
  });

  it('deduplicates repeated changes for the same template', async () => {
    const { pathsToInvalidate } = await planHotReloadRerender(
      [
        { event: 'change', filename: 'email-002.tsx' },
        { event: 'change', filename: 'email-002.tsx' },
      ],
      pathOf('email-001.tsx'),
      metadata,
      resolveEmailPathFromSlug,
    );

    expect(pathsToInvalidate).toEqual([pathOf('email-002.tsx')]);
  });
});
