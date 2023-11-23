import fs from 'node:fs';
import shell from 'shelljs';
import { downloadClient, PREVIEW_CLIENT_DIR } from '../utils';
import { setupServer } from '../utils/run-server';

interface Args {
  dir: string;
  port: string;
  skipInstall: boolean;
}

export const dev = async ({ dir, port, skipInstall }: Args) => {
  try {
    if (!fs.existsSync(dir)) {
      throw new Error(`Missing ${dir} folder`);
    }

    if (fs.existsSync(PREVIEW_CLIENT_DIR)) {
      await setupServer('dev', dir, port, skipInstall);
      return;
    }

    await downloadClient();

    await setupServer('dev', dir, port, skipInstall);
  } catch (error) {
    console.log(error);
    shell.exit(1);
  }
};
