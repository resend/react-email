import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Bench } from 'tinybench';
import { runServer } from './utils/run-server';

const pathToCanaryCliScript = path.resolve(
  import.meta.dirname,
  '../',
  './node_modules/react-email-2.1.7-canary.2/cli/index.js',
);

const pathToLocalCliScript = path.resolve(
  import.meta.dirname,
  '../',
  './node_modules/react-email/dist/cli/index.js',
);

const bench = new Bench({
  iterations: 30,
});

bench
  .add('startup on local', async () => {
    try {
      const server = await runServer(pathToLocalCliScript);
      await fetch(`${server.url}/preview/magic-links/notion-magic-link`);
      if (!server.subprocess.kill()) {
        throw new Error('could not close sub process for preview server');
      }
    } catch (err) {
      console.error('Error starting local server:', err);
    }
  })
  .add('startup on 2.1.7-canary.2', async () => {
    const server = await runServer(pathToCanaryCliScript);
    await fetch(`${server.url}/preview/magic-links/notion-magic-link`);
    if (!server.subprocess.kill()) {
      throw new Error('could not close sub process for preview server');
    }
  });

await bench.run();

await fs.writeFile(
  'startup-bench-results-30-iterations.json',
  JSON.stringify(bench.results),
  'utf8',
);
