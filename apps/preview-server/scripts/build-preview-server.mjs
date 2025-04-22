import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const nextBuildProcess = spawn('pnpm', ['next', 'build'], {
  detached: true,
  shell: true,
  stdio: 'inherit',
  cwd: path.resolve(import.meta.dirname, '../'),
});

process.on('SIGINT', () => {
  nextBuildProcess.kill('SIGINT');
});

nextBuildProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`next build failed with exit code ${code}`);
    process.exit(code);
  }

  fs.rmSync(path.resolve(import.meta.dirname, '../.next/cache'), { recursive: true });
});
