import path from "node:path";
import { Bench } from "tinybench";
import { runServerAndFetchPreviewPage } from "./utils/run-server-and-fetch-preview-page";
import { promises as fs } from "node:fs";

const pathToCanaryCliScript = path.resolve(
  __dirname,
  "../",
  "./node_modules/react-email-canary/cli/index.js",
);

const pathToLocalCliScript = path.resolve(
  __dirname,
  "../",
  "./node_modules/react-email/dist/cli/index.js",
);

(async () => {
  const bench = new Bench({
    iterations: 30,
  });

  bench
    .add("local", () => {
      return runServerAndFetchPreviewPage(pathToLocalCliScript);
    })
    .add("2.1.7-canary.2", () => {
      return runServerAndFetchPreviewPage(pathToCanaryCliScript);
    });

  await bench.run();

  console.log(bench.table());

  await fs.writeFile(
    "bench-results-30-iterations.json",
    JSON.stringify(bench.results),
    "utf8",
  );
})();
