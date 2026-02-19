import fs from 'node:fs/promises';

(async () => {
  const pkg: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  } = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const errors = [];

  function isPinned(version: string) {
    if (version.startsWith('workspace:')) {
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

  for (const [dep, version] of Object.entries(pkg.dependencies || {})) {
    if (!isPinned(version)) {
      errors.push(`Dependency "${dep}" is not pinned: "${version}"`);
    }
  }

  for (const [dep, version] of Object.entries(pkg.devDependencies || {})) {
    if (!isPinned(version)) {
      errors.push(`Dev dependency "${dep}" is not pinned: "${version}"`);
    }
  }

  if (errors.length > 0) {
    console.error(`\n${errors.join('\n')}\n`);
    process.exit(1);
  } else {
    console.log('All dependencies are pinned.');
  }
})();
