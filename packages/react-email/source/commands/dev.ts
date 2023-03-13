import { downloadClient, REACT_EMAIL_ROOT } from '../utils';
import fs from 'fs';
import shell from 'shelljs';
import { runServer } from '../utils/run-server';

interface Args {
  dir: string;
  port: string;
}

export const dev = async ({ dir, port }: Args) => {
  try {
    if (fs.existsSync(REACT_EMAIL_ROOT)) {
      await runServer(dir, port);
      return;
    }

    await downloadClient();

    await runServer(dir, port);
  } catch (error) {
    console.log(error);
    shell.exit(1);
  }
};
