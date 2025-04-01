import { spawnSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

describe('automatic setup', () => {
  const starterPath = path.resolve(__dirname, '../.test');
  test.sequential('creation', async () => {
    await fs.rm(starterPath, { recursive: true });

    const createEmailProcess = spawnSync(
      'node',
      [path.resolve(__dirname, './index.js'), '.test'],
      {
        shell: true,
        cwd: path.resolve(__dirname, '../'),
        stdio: 'pipe',
      },
    );
    console.log(createEmailProcess.stderr?.toString());
    expect(createEmailProcess.status, 'starter creation should return 0').toBe(
      0,
    );
  });

  test.sequential('export', () => {
    const exportProcess = spawnSync('npm', ['run export'], {
      shell: true,
      cwd: starterPath,
      stdio: 'pipe',
    });
    console.log(exportProcess.stderr?.toString());
    expect(exportProcess.status, 'export should return status code 0').toBe(0);
  });

  test.sequential('type checking', () => {
    const typecheckingProcess = spawnSync('npx', ['tsc'], {
      shell: true,
      cwd: starterPath,
      stdio: 'inherit',
    });
    console.log(typecheckingProcess.stderr?.toString());
    expect(
      typecheckingProcess.status,
      'type checking should return status code 0',
    ).toBe(0);
  });
});
