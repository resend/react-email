import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const previewServerRoot = path.resolve(import.meta.dirname, '../');

const nextBuildProcess = spawn('pnpm next build', {
  shell: true,
  stdio: 'inherit',
  cwd: previewServerRoot,
});

process.on('SIGINT', () => {
  nextBuildProcess.kill('SIGINT');
});

nextBuildProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`next build failed with exit code ${code}`);
    process.exit(code);
  }

  fs.rmSync(path.join(previewServerRoot, '.next', 'cache'), {
    recursive: true,
    force: true,
  });

  const nodeModules = path.join(previewServerRoot, '.next', 'node_modules');
  if (!fs.existsSync(nodeModules)) {
    return;
  }

  for (const entry of fs.readdirSync(nodeModules, { withFileTypes: true })) {
    const entryPath = path.join(nodeModules, entry.name);
    if (!entry.isSymbolicLink()) {
      continue;
    }

    const realPath = fs.realpathSync(entryPath);
    fs.unlinkSync(entryPath);
    fs.cpSync(realPath, entryPath, { recursive: true });
  }
});
