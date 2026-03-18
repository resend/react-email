import fs from 'node:fs/promises';
import path from 'node:path';
import { getPackages } from '@manypkg/get-packages';

type PackageJson = {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

type PackageCheck = {
  packageJsonPath: string;
  onlyDevDeps: boolean;
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

async function checkPackageJson(packageJsonPath: string, onlyDevDeps: boolean) {
  const content = await fs
    .readFile(packageJsonPath, 'utf8')
    .catch((error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return null;
      throw error;
    });
  if (content === null) return;

  const pkg: PackageJson = JSON.parse(content);
  const label = pkg.name ?? packageJsonPath;
  const checkScope = onlyDevDeps
    ? 'dev dependencies only'
    : 'dependencies + dev dependencies';

  console.log(`Checking ${label} (${checkScope})`);

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

function isDirectWorkspaceChild(relativeDir: string, parentDir: string) {
  const segments = relativeDir.split('/');
  return segments.length === 2 && segments[0] === parentDir;
}

function getPackageChecks(rootDir: string, packageDirs: string[]) {
  const checks: PackageCheck[] = [
    {
      packageJsonPath: path.join(rootDir, 'package.json'),
      onlyDevDeps: false,
    },
  ];

  const sortedPackageDirs = [...packageDirs].sort();
  for (const packageDir of sortedPackageDirs) {
    const relativeDir = path
      .relative(rootDir, packageDir)
      .split(path.sep)
      .join('/');

    if (
      relativeDir === 'playground' ||
      isDirectWorkspaceChild(relativeDir, 'apps') ||
      isDirectWorkspaceChild(relativeDir, 'benchmarks')
    ) {
      checks.push({
        packageJsonPath: path.join(packageDir, 'package.json'),
        onlyDevDeps: false,
      });
      continue;
    }

    if (isDirectWorkspaceChild(relativeDir, 'packages')) {
      checks.push({
        packageJsonPath: path.join(packageDir, 'package.json'),
        onlyDevDeps: true,
      });
    }
  }

  return checks;
}

(async () => {
  const { packages, rootDir } = await getPackages(process.cwd());

  for (const check of getPackageChecks(
    rootDir,
    packages.map((pkg) => pkg.dir),
  )) {
    await checkPackageJson(check.packageJsonPath, check.onlyDevDeps);
  }

  if (allErrors.length > 0) {
    console.error(`\n${allErrors.join('\n')}\n`);
    process.exit(1);
  } else {
    console.log('All dependencies are pinned.');
  }
})();
