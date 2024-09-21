import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = os.platform() === 'win32';
const nextExecutable = path.resolve(
  __dirname,
  'node_modules',
  '.bin',
  isWindows ? 'next.cmd' : 'next'
);

const nextBuildProcess = spawn(nextExecutable, ['build'], {
  stdio: 'inherit',
});

process.on('SIGINT', () => {
  nextBuildProcess.kill('SIGINT');
});

nextBuildProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`next build failed with exit code ${code}`);
    process.exit(code);
  }

  if (fs.existsSync('dist/preview')) {
    fs.rmSync('dist/preview', { recursive: true });
  }
  fs.mkdirSync('dist/preview', { recursive: true });
  fs.renameSync('.next', 'dist/preview/.next');
});