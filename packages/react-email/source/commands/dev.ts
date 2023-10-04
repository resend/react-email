import { exists } from 'fs-extra';

import { setupServer } from '../utils/run-server';

interface Args {
  dir: string;
  port: string;
}

export const dev = async ({ dir, port }: Args) => {
  try {
    if (!(await exists(dir))) {
      throw new Error(`Missing ${dir} folder`);
    }

    await setupServer(dir, port);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
