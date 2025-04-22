import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const start = async () => {
  try {
    const usersProjectLocation = process.cwd();
    const builtPreviewPath = path.resolve(
      usersProjectLocation,
      './.react-email',
    );
    if (!fs.existsSync(builtPreviewPath)) {
      console.error(
        "Could not find .react-email, maybe you haven't ran email build?",
      );
      process.exit(1);
    }

    const nextStart = spawn('npm', ['start'], {
      cwd: builtPreviewPath,
      stdio: 'inherit',
    });

    process.on('SIGINT', () => {
      nextStart.kill('SIGINT');
    });

    nextStart.on('exit', (code) => {
      process.exit(code ?? 0);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
