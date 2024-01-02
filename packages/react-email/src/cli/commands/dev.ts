import fs from 'node:fs';
import shell from 'shelljs';
import { setupServer } from '../utils/run-server';

interface Args {
  dir: string;
  port: string;
  skipInstall: boolean;
}

export const dev = async ({ dir, port }: Args) => {
  try {
    if (!fs.existsSync(dir)) {
      throw new Error(`Missing ${dir} folder`);
    }

    await setupServer(dir, port);
  } catch (error) {
    console.log(error);
    shell.exit(1);
  }
};
