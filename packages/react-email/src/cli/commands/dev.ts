import fs from 'node:fs';
import { setupHotreloading, startDevServer } from '../utils';

interface Args {
  dir: string;
  port: string;
}

export const dev = async ({ dir: emailsDirRelativePath, port }: Args) => {
  try {
    if (!fs.existsSync(emailsDirRelativePath)) {
      console.error(`Missing ${emailsDirRelativePath} folder`);
      process.exit(1);
    }

    const devServer = await startDevServer(
      emailsDirRelativePath,
      emailsDirRelativePath, // defaults to ./emails/static for the static files that are served to the preview
      Number.parseInt(port),
    );

    await setupHotreloading(devServer, emailsDirRelativePath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
