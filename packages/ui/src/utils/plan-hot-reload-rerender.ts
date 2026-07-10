import { containsEmailTemplate } from './contains-email-template';
import type { EmailsDirectory } from './get-emails-directory-metadata';
import type { HotReloadChange } from './types/hot-reload-change';

export interface HotReloadRerenderPlan {
  pathToRerender: string | null;
  // Only their stale cache is dropped, not re-rendered here: eagerly rendering
  // every dependent of a shared component is what exhausts the Node heap.
  pathsToInvalidate: string[];
}

export const planHotReloadRerender = async (
  changes: HotReloadChange[],
  currentEmailPath: string,
  emailsDirectoryMetadata: EmailsDirectory,
  resolveEmailPathFromSlug: (slug: string) => Promise<string | undefined>,
): Promise<HotReloadRerenderPlan> => {
  let pathToRerender: string | null = null;
  const pathsToInvalidate: string[] = [];

  for (const change of changes) {
    // ex: apple-receipt.tsx — the path relative to the emails directory, which
    // is equivalent to the slug.
    const relativePathForChangedFile = change.filename;

    if (
      !containsEmailTemplate(
        relativePathForChangedFile,
        emailsDirectoryMetadata,
      )
    ) {
      continue;
    }

    const pathForChangedEmail = await resolveEmailPathFromSlug(
      relativePathForChangedFile,
    );
    if (!pathForChangedEmail) {
      continue;
    }

    if (pathForChangedEmail === currentEmailPath) {
      pathToRerender = pathForChangedEmail;
    } else if (!pathsToInvalidate.includes(pathForChangedEmail)) {
      pathsToInvalidate.push(pathForChangedEmail);
    }
  }

  return { pathToRerender, pathsToInvalidate };
};
