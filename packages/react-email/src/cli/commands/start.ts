import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node:url';
import { createServer } from 'node:http';
import next from 'next';

interface Args {
  port: string;
}

export const start = async ({ port }: Args) => {
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

    try {
      parseInt(port);
    } catch (exception) {
      throw new Error('The port seems to not be a integer', {
        cause: {
          port,
          usersProjectLocation,
          builtPreviewPath,
          env: process.env,
        },
      });
    }

    const portToUse = parseInt(port);

    const app = next({
      dev: false,
      port: portToUse,
      dir: builtPreviewPath,
    });

    const handle = app.getRequestHandler();

    await app.prepare();
    createServer((req, res) => {
      if (!req.url)
        throw new Error(
          "Preview app server not able to determine request's url",
        );
      const parsedUrl = parse(req.url, true);

      void handle(req, res, parsedUrl);
    }).listen(portToUse, () => {
      console.log(`> Ready on http://localhost:${portToUse}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
