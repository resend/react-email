// Uses only Node built-ins: this runs in the only release job that holds the npm OIDC token.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const distTagOf = (version) => version.split('-')[1]?.split('.')[0] ?? 'latest';

export function findManifestProblems(entries, expectedVersions, readTarball) {
  const problems = [];
  for (const entry of entries) {
    const label = `${entry.name}@${entry.version}`;
    if (expectedVersions.get(entry.name) !== entry.version) {
      problems.push(`${label} is not a package version in this commit`);
      continue;
    }
    if (entry.distTag !== distTagOf(entry.version)) {
      problems.push(
        `${label} has the dist-tag "${entry.distTag}", expected "${distTagOf(entry.version)}"`,
      );
      continue;
    }
    if (
      typeof entry.tarball !== 'string' ||
      entry.tarball !== path.basename(entry.tarball) ||
      !entry.tarball.endsWith('.tgz')
    ) {
      problems.push(`${label} has an invalid tarball name "${entry.tarball}"`);
      continue;
    }
    const packed = readTarball(entry.tarball);
    if (packed === undefined) {
      problems.push(`${label} has no readable tarball "${entry.tarball}"`);
      continue;
    }
    if (packed.name !== entry.name || packed.version !== entry.version) {
      problems.push(
        `${label} has a tarball that contains ${packed.name}@${packed.version}`,
      );
    }
  }
  return problems;
}

export function publishInOrder(entries, publish, onProgress = () => {}) {
  const published = [];
  const failed = new Set();
  const snapshot = () => ({ published: [...published], failed: [...failed] });

  for (const entry of entries) {
    const failedDependency = entry.dependsOn.find((dep) => failed.has(dep));
    if (failedDependency !== undefined) {
      console.log(
        `Skipping ${entry.name}: its dependency ${failedDependency} failed to publish`,
      );
      failed.add(entry.name);
    } else if (publish(entry)) {
      published.push(entry.name);
    } else {
      failed.add(entry.name);
    }
    onProgress(snapshot());
  }

  return snapshot();
}

const readWorkspaceVersions = (packagesDir) => {
  const versions = new Map();
  for (const name of fs.readdirSync(packagesDir)) {
    const file = path.join(packagesDir, name, 'package.json');
    if (!fs.existsSync(file)) {
      continue;
    }
    const packageJson = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (packageJson.private !== true) {
      versions.set(packageJson.name, packageJson.version);
    }
  }
  return versions;
};

const readTarballManifest = (file) => {
  if (!fs.existsSync(file) || !fs.lstatSync(file).isFile()) {
    return undefined;
  }
  const result = spawnSync('tar', ['-xOzf', file, 'package/package.json'], {
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    return undefined;
  }
  try {
    return JSON.parse(result.stdout);
  } catch {
    return undefined;
  }
};

const isAlreadyPublished = (entry) => {
  const result = spawnSync(
    'npm',
    ['view', `${entry.name}@${entry.version}`, 'version'],
    { encoding: 'utf8' },
  );
  return result.status === 0 && result.stdout.trim() === entry.version;
};

const npmPublish = (dir, entry) => {
  if (isAlreadyPublished(entry)) {
    console.log(`${entry.name}@${entry.version} is already published`);
    return true;
  }
  const result = spawnSync(
    'npm',
    [
      'publish',
      path.resolve(dir, entry.tarball),
      '--ignore-scripts',
      '--access',
      'public',
      '--provenance',
      '--tag',
      entry.distTag,
    ],
    { stdio: 'inherit' },
  );
  if (result.status === 0) {
    console.log(`Published ${entry.name}@${entry.version}`);
    return true;
  }
  console.log(`::error::Failed to publish ${entry.name}@${entry.version}`);
  return false;
};

if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const dir = process.argv[2];
  if (dir === undefined) {
    throw new Error('Usage: node publish-tarballs.mjs <artifact-dir>');
  }
  const { packages } = JSON.parse(
    fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'),
  );

  const problems = findManifestProblems(
    packages,
    readWorkspaceVersions('packages'),
    (tarball) => readTarballManifest(path.resolve(dir, tarball)),
  );
  const writeResults = (result) =>
    fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify(result));
  for (const problem of problems) {
    console.log(`::error::${problem}`);
  }

  const result =
    problems.length > 0
      ? { published: [], failed: packages.map((entry) => entry.name) }
      : publishInOrder(
          packages,
          (entry) => npmPublish(dir, entry),
          writeResults,
        );
  writeResults(result);
  if (result.failed.length > 0) {
    process.exitCode = 1;
  }
}
