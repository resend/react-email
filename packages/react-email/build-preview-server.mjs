import { spawn } from 'node:child_process';
import fs from 'node:fs';

const nextBuildProcess = spawn('next', ['build'], {
  detached: true,
  stdio: "inherit"
});

process.on('SIGINT', () => {
  nextBuildProcess.kill('SIGINT');
});

nextBuildProcess.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code);
  }

  if (fs.existsSync('dist/preview')) {
    fs.rmSync('dist/preview', { recursive: true });
  }
  fs.mkdirSync('dist/preview', { recursive: true });
  fs.renameSync('.next', 'dist/preview/.next');
});

