import fs from 'node:fs';
import path from 'node:path';
import { runScript } from 'nypm';

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

    await runScript('crossEnvStart', {
      cwd: builtPreviewPath,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
