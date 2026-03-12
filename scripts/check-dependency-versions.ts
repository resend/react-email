import fs from 'node:fs/promises';
import path from 'node:path';

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

const allErrors: string[] = [];

function isPinned(version: string) {
  if (version.startsWith('workspace:')) {
    return true;
  }
  if (version.startsWith('catalog:')) {
    return true;
  }
  if (version.startsWith('npm:')) {
    return true;
  }
  if (/^\d+\.\d+\.\d+(-\S+)?$/.test(version)) {
    return true;
  }
  if (/^[a-z]+:[a-z]+@\d+$/.test(version)) {
    return true;
  }
  return false;
}

async function checkPackageJson(pkgJsonPath: string, onlyDevDeps: boolean) {
  const content = await fs
    .readFile(pkgJsonPath, 'utf8')
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
  if (content === null) return;

  const pkg: PackageJson = JSON.parse(content);
  const label = pkg.name ?? pkgJsonPath;

  if (!onlyDevDeps) {
    for (const [dep, version] of Object.entries(pkg.dependencies ?? {})) {
      if (!isPinned(version)) {
        allErrors.push(
          `[${label}] Dependency "${dep}" is not pinned: "${version}"`,
        );
      }
    }
  }

  for (const [dep, version] of Object.entries(pkg.devDependencies ?? {})) {
    if (!isPinned(version)) {
      allErrors.push(
        `[${label}] Dev dependency "${dep}" is not pinned: "${version}"`,
      );
    }
  }
}

async function checkWorkspaceDir(dirPath: string, onlyDevDeps: boolean) {
  const entries = await fs
    .readdir(dirPath, { withFileTypes: true })
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return [];
      throw error;
    });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      await checkPackageJson(
        path.join(dirPath, entry.name, 'package.json'),
        onlyDevDeps,
      );
    }
  }
}

(async () => {
  // Workspace root: check everything
  await checkPackageJson('package.json', false);

  // apps/*: check everything
  await checkWorkspaceDir('apps', false);

  // benchmarks/*: check everything
  await checkWorkspaceDir('benchmarks', false);

  // playground: check everything
  await checkPackageJson('playground/package.json', false);

  // packages/*: only check dev dependencies
  await checkWorkspaceDir('packages', true);

  if (allErrors.length > 0) {
    console.error(`\n${allErrors.join('\n')}\n`);
    process.exit(1);
  } else {
    console.log('All dependencies are pinned.');
  }
})();
