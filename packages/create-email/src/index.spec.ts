import { spawnSync } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { installDependencies, runScript } from 'nypm';

describe('automatic setup', () => {
  const starterPath = path.resolve(import.meta.dirname, '../.test');
  test.sequential('creation', async () => {
    if (existsSync(starterPath)) {
      await fs.rm(starterPath, { recursive: true });
    }

    const createEmailProcess = spawnSync(
      process.execPath,
      [path.resolve(import.meta.dirname, './index.js'), '.test'],
      {
        cwd: path.resolve(import.meta.dirname, '../'),
        stdio: 'pipe',
      },
    );
    if (createEmailProcess.stderr) {
      console.log(createEmailProcess.stderr.toString());
    }
    expect(createEmailProcess.status, 'starter creation should return 0').toBe(
      0,
    );
  });

  test.sequential('install', { timeout: 40_000 }, async () => {
    await installDependencies({
      cwd: starterPath,
      packageManager: 'npm',
    });
  });

  test.sequential('export', async () => {
    await runScript('export', {
      cwd: starterPath,
      packageManager: 'npm',
    });
  });

  test.sequential('type checking', { timeout: 10_000 }, async () => {
    const typecheckingProcess = spawnSync('npx tsc', {
      cwd: starterPath,
      shell: true,
      stdio: 'pipe',
    });
    if (typecheckingProcess.stderr) {
      console.log(typecheckingProcess.stderr.toString());
    }
    if (typecheckingProcess.stdout) {
      console.log(typecheckingProcess.stdout.toString());
    }
    expect(
      typecheckingProcess.status,
      'type checking should return status code 0',
    ).toBe(0);
  });
});
