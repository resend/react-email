import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';

export const start = async () => {
  try {
    const usersProjectLocation = process.cwd();
    const builtPreviewPath = path.resolve(
      usersProjectLocation,
      './.react-email',
    );
    if (!fs.existsSync(builtPreviewPath)) {
      throw new Error(
        "Could not find `.react-email`, maybe you haven't ran `email build`?",
      );
    }

    const nextStart = spawn('npm', ['start'], {
      cwd: builtPreviewPath,
      shell: true,
    });

    nextStart.stdout.pipe(process.stdout);

    nextStart.stderr.pipe(process.stderr);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
