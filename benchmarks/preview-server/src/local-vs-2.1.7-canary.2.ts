import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Bench } from 'tinybench';
import { runServer } from './utils/run-server';

const pathToCanaryCliScript = path.resolve(
  __dirname,
  '../',
  './node_modules/react-email-2.1.7-canary.2/cli/index.js',
);

const pathToLocalCliScript = path.resolve(
  __dirname,
  '../',
  './node_modules/react-email/dist/cli/index.js',
);

(async () => {
  const bench = new Bench({
    iterations: 30,
  });

  const localServer = await runServer(pathToLocalCliScript);
  const canaryServer = await runServer(pathToCanaryCliScript);
  bench
    .add('local', async () => {
      await fetch(`${localServer.url}/preview/magic-links/notion-magic-link`);
    })
    .add('2.1.7-canary.2', async () => {
      await fetch(`${canaryServer.url}/preview/magic-links/notion-magic-link`);
    });

  await fetch(`${localServer.url}/preview/magic-links/notion-magic-link`);
  await fetch(`${canaryServer.url}/preview/magic-links/notion-magic-link`);

  await bench.run();

  localServer.subprocess.kill();
  canaryServer.subprocess.kill();

  await fs.writeFile(
    'bench-results-30-iterations.json',
    JSON.stringify(bench.results),
    'utf8',
  );
})();
