import { getPackages } from '@manypkg/get-packages';

// Walks up from `usersProjectLocation` to the true workspace root (Yarn/npm/pnpm/Bolt/Lerna/Rush),
// falling back to the nearest package.json, so nested monorepo packages trace files from the real
// repo root instead of their own package directory.
export const getTracingRootDir = async (usersProjectLocation: string) => {
  try {
    const { rootDir } = await getPackages(usersProjectLocation);
    return rootDir.replaceAll('\\', '/');
  } catch {
    return usersProjectLocation.replaceAll('\\', '/');
  }
};
