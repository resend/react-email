import child_process from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const filename = url.fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const previewServerRoot = path.resolve(dirname, '..');
const emailsDirectoryPath = path.join(previewServerRoot, 'emails');

const envPath = path.join(previewServerRoot, '.env.local');

await fs.writeFile(
  envPath,
  `EMAILS_DIR_RELATIVE_PATH=./emails
EMAILS_DIR_ABSOLUTE_PATH=${emailsDirectoryPath}
USER_PROJECT_LOCATION=${previewServerRoot}
NEXT_PUBLIC_IS_PREVIEW_DEVELOPMENT=true`,
  'utf8',
);

const webServerProcess = child_process.spawn('next', ['dev'], {
  cwd: previewServerRoot,
  shell: true,
  stdio: 'inherit',
});

webServerProcess.on('exit', async () => {
  await fs.rm(envPath);
});

process.on('SIGINT', () => {
  webServerProcess.kill('SIGINT');
});
process.on('SIGUSR1', () => {
  webServerProcess.kill('SIGUSR1');
});
process.on('SIGUSR2', () => {
  webServerProcess.kill('SIGUSR2');
});
process.on('uncaughtExceptionMonitor', () => {
  webServerProcess.kill();
});
process.on('exit', () => {
  webServerProcess.kill();
});
