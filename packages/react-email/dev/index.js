import child_process from 'node:child_process';
import path from 'node:path';
import url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const root = path.resolve(dirname, '../src/index.ts');

const args = ['tsx', root, ...process.argv.slice(2)];
const command = `pnpm ${args.map((arg) => `"${arg.replace('"', '\\"')}"`).join(' ')}`;

const tsx = child_process.spawn(command, {
  cwd: process.cwd(),
  shell: true,
  env: {
    ...process.env,
    NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --experimental-vm-modules --disable-warning=ExperimentalWarning`,
  },
  stdio: 'inherit',
});

tsx.on('close', (code) => {
  process.exit(code);
});

process.on('uncaughtExceptionMonitor', () => {
  tsx.kill();
});

process.on('exit', (code) => {
  tsx.kill(code);
});

process.on('SIGINT', () => {
  tsx.kill('SIGINT');
});

process.on('SIGTERM', () => {
  tsx.kill('SIGTERM');
});

process.on('SIGUSR1', () => {
  tsx.kill('SIGUSR1');
});

process.on('SIGUSR2', () => {
  tsx.kill('SIGUSR2');
});
