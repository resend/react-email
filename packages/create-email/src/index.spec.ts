import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, promises as fs } from 'node:fs';
import path from 'node:path';
import { expect, test, describe } from 'vitest';

const execAsync = promisify(exec);

describe('automatic setup', () => {
  const starterPath = path.resolve(__dirname, '../.test');

  test.sequential('creation', async () => {
    if (existsSync(starterPath)) {
      await fs.rm(starterPath, { recursive: true });
    }

    const { stderr, stdout } = await execAsync(
      `node ${path.resolve(__dirname, './index.js')} .test`,
      {
        cwd: path.resolve(__dirname, '../'),
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
      }
    );

    if (stderr) console.error(stderr);
    console.log(stdout);

    expect(true).toBe(true); // Will throw if command fails
  });

  test.sequential('install', { timeout: 180_000 }, async () => {
    try {
      const { stdout, stderr } = await execAsync('npm install', {
        cwd: starterPath,
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
      });
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (err: any) {
      console.error(err.stderr || err);
      throw err;
    }
  });

  test.sequential('export', { timeout: 60_000 }, async () => {
    try {
      const { stdout, stderr } = await execAsync('npm run export', {
        cwd: starterPath,
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash'
      });
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (err: any) {
      console.error(err.stderr || err);
      throw new Error('npm run export failed');
    }
  });

  test.sequential('type checking', { timeout: 60_000 }, async () => {
    try {
      const { stdout, stderr } = await execAsync('npx tsc', {
        cwd: starterPath,
        shell: process.platform === 'win32' ? 'cmd.exe' : '/bin/bash',
      });
      console.log(stdout);
      if (stderr) console.error(stderr);
    } catch (err: any) {
      console.error(err.stderr || err);
      throw new Error('Type checking failed');
    }
  });
});
