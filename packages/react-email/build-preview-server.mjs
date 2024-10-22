import { spawn } from 'node:child_process';
import fs from 'node:fs';

const nextBuildProcess = spawn('pnpm', ['next', 'build'], {
  detached: true,
  shell: true,
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
