import next from "next";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { parse } from "node:url";

const convertToAbsolutePath = (dir: string): string => {
  return path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
};

export const dev = async ({ dir, port }: { dir: string; port: string }) => {
  try {
    if (!fs.existsSync(dir)) {
      throw new Error(`Missing ${dir} folder.`);
    }

    const emailsDir = convertToAbsolutePath(dir);
    console.log(emailsDir);
    const app = next({
      dev: true,
      hostname: "localhost",
      port: parseInt(port, 10),
    });

    const nextHandle = app.getRequestHandler();
    await app.prepare();

    http
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      .createServer(async (req, res) => {
        if (!req.url) {
          res.end(404);
          return;
        }

        const parsedUrl = parse(req.url, true);

        res.setHeader(
          "Cache-Control",
          "no-cache, max-age=0, must-revalidate, no-store",
        );
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "-1");

        try {
          await nextHandle(req, res, parsedUrl);
        } catch (error) {
          console.error("caught error", error);
          res.writeHead(500);
          res.end(JSON.stringify(error));
          return;
        }
      })
      .on("error", (error: NodeJS.ErrnoException) => {
        if (error.code === "EADDRINUSE") {
          console.error(
            `port ${port} is taken, is react-email already running?`,
          );
          process.exit(1);
        } else {
          console.error("preview server error:", JSON.stringify(error));
        }
      })
      .listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
      });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
