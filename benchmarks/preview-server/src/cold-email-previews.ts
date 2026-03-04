import { promises as fs } from 'node:fs';
import path from 'node:path';
import { Bench } from 'tinybench';
import { runServer } from './utils/run-server';

const pathToLocalCliScript = path.resolve(
  __dirname,
  '../',
  './node_modules/react-email/dist/cli/index.js',
);

(async () => {
  const bench = new Bench({
    iterations: 30,
  });

  bench.add('coldemail previews', async () => {
    const server = await runServer(pathToLocalCliScript);
    try {
      await fetch(`${server.url}/preview/magic-links/notion-magic-link`);
    } finally {
      server.subprocess.kill();
    }
  });

  await bench.run();

  await fs.writeFile(
    'bench-results-30-iterations.json',
    JSON.stringify(bench.results),
    'utf8',
  );
})();
