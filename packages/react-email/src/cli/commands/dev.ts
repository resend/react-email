import fs from 'node:fs';
import path from 'node:path';
import { setupHotreloading, startDevServer } from '../utils/index.js';

interface Args {
  dir: string;
  port: string;
  watch: string[];
}

export const dev = async ({
  dir: emailsDirRelativePath,
  port,
  watch,
}: Args) => {
  try {
    if (!fs.existsSync(emailsDirRelativePath)) {
      console.error(`Missing ${emailsDirRelativePath} folder`);
      process.exit(1);
    }

    const extraWatchPaths: string[] = [];
    for (const watchPath of watch) {
      const absolutePath = path.resolve(process.cwd(), watchPath);
      if (!fs.existsSync(absolutePath)) {
        console.warn(
          `Skipping --watch path "${watchPath}" because it does not exist`,
        );
        continue;
      }
      extraWatchPaths.push(absolutePath);
    }

    const devServer = await startDevServer(
      emailsDirRelativePath,
      emailsDirRelativePath, // defaults to ./emails/static for the static files that are served to the preview
      Number.parseInt(port, 10),
    );

    await setupHotreloading(devServer, emailsDirRelativePath, extraWatchPaths);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
