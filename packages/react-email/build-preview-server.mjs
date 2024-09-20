import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

// Define __filename and __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the correct executable based on the operating system
const isWindows = os.platform() === 'win32';
const nextExecutable = path.resolve(
  __dirname,
  'node_modules',
  '.bin',
  isWindows ? 'next.cmd' : 'next'
);

// Spawn the 'next build' process
const nextBuildProcess = spawn(nextExecutable, ['build'], {
  stdio: 'inherit',
});

// Handle graceful shutdown on SIGINT (Ctrl+C)
process.on('SIGINT', () => {
  nextBuildProcess.kill('SIGINT');
});

// Handle process exit
nextBuildProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`next build failed with exit code ${code}`);
    process.exit(code);
  }

  // Manage the 'dist/preview' directory
  if (fs.existsSync('dist/preview')) {
    fs.rmSync('dist/preview', { recursive: true, force: true });
  }
  fs.mkdirSync('dist/preview', { recursive: true });
  fs.renameSync('.next', 'dist/preview/.next');
});

// Handle errors during spawning
nextBuildProcess.on('error', (err) => {
  console.error('Failed to start next build process:', err);
  process.exit(1);
});
