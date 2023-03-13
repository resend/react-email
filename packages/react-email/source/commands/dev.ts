import { downloadClient, REACT_EMAIL_ROOT } from '../utils';
import fs from 'fs';
import shell from 'shelljs';
import { setupServer } from '../utils/run-server';

interface Args {
  dir: string;
  port: string;
}

export const dev = async ({ dir, port }: Args) => {
  try {
    if (fs.existsSync(REACT_EMAIL_ROOT)) {
      await setupServer("dev", dir, port);
      return;
    }

    await downloadClient();

    await setupServer("dev", dir, port);
  } catch (error) {
    console.log(error);
    shell.exit(1);
  }
};
