// Uses only Node built-ins: this runs in the only release job that holds the npm OIDC token.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function publishInOrder(entries, publish) {
  const published = [];
  const failed = new Set();

  for (const entry of entries) {
    const failedDependency = entry.dependsOn.find((dep) => failed.has(dep));
    if (failedDependency !== undefined) {
      console.log(
        `Skipping ${entry.name}: its dependency ${failedDependency} failed to publish`,
      );
      failed.add(entry.name);
      continue;
    }

    if (publish(entry)) {
      published.push(entry.name);
    } else {
      failed.add(entry.name);
    }
  }

  return { published, failed: [...failed] };
}

const npmPublish = (dir, entry) => {
  const result = spawnSync(
    'npm',
    [
      'publish',
      path.resolve(dir, entry.tarball),
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
  const result = publishInOrder(packages, (entry) => npmPublish(dir, entry));
  fs.writeFileSync(path.join(dir, 'results.json'), JSON.stringify(result));
  if (result.failed.length > 0) {
    process.exitCode = 1;
  }
}
