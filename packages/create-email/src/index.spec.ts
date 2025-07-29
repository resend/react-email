import { spawnSync } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';

describe('automatic setup', () => {
  const starterPath = path.resolve(__dirname, '../.test');
  test.sequential('creation', async () => {
    if (existsSync(starterPath)) {
      await fs.rm(starterPath, { recursive: true });
    }

    const createEmailProcess = spawnSync(
      'node',
      [path.resolve(__dirname, './index.js'), '.test'],
      {
        shell: true,
        cwd: path.resolve(__dirname, '../'),
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

  test.sequential('install', { timeout: 40_000 }, () => {
    const installProcess = spawnSync('npm', ['install'], {
      shell: true,
      cwd: path.resolve(starterPath),
      stdio: 'pipe',
    });
    if (installProcess.stderr) {
      console.log(installProcess.stderr.toString());
    }
    expect(installProcess.status, 'starter npm install should return 0').toBe(
      0,
    );
  });

  test.sequential('export', () => {
    const exportProcess = spawnSync('npm', ['run export'], {
      shell: true,
      cwd: starterPath,
      stdio: 'pipe',
    });
    if (exportProcess.stderr) {
      console.log(exportProcess.stderr.toString());
    }
    expect(exportProcess.status, 'export should return status code 0').toBe(0);
  });

  test.sequential('type checking', { timeout: 10_000 }, () => {
    const typecheckingProcess = spawnSync('npx', ['tsc'], {
      shell: true,
      cwd: starterPath,
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
