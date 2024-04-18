import { spawn } from 'node:child_process';
import { existsSync, promises as fs } from 'node:fs';

const nextBuildProcess = spawn('next', ['build'], {
  detached: true,
  stdio: "inherit"
});

process.on('SIGINT', () => {
  nextBuildProcess.kill('SIGINT');
});

nextBuildProcess.on('exit', async (code) => {
  if (code !== 0) {
    process.exit(code);
  }

  if (existsSync('dist/preview')) {
    await fs.rm('dist/preview', { recursive: true });
  }
  await fs.mkdir('dist/preview', { recursive: true });
  await fs.rename('.next', 'dist/preview/.next');
});

