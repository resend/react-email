import child_process from 'node:child_process';
import path from 'node:path';
import url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const root = path.resolve(dirname, '../src/index.ts');

const tsxPath = path.resolve(dirname, '../../../node_modules/.bin/tsx');

const tsx = child_process.spawn(tsxPath, [root, ...process.argv.slice(2)], {
  shell: true,
  cwd: process.cwd(),
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
