import { writeFileSync } from 'node:fs';
import { render } from '@react-email/render';
import { Tailwind as LocalTailwind } from '@react-email/tailwind';
import { Tailwind as VersionSeventeenTailwind } from 'tailwind-0.0.17';
import { Bench } from 'tinybench';
import EmailWithTailwind from './emails/with-tailwind.js';

const bench = new Bench({
  iterations: 100,
});

bench
  .add('local', async () => {
    await render(<EmailWithTailwind Tailwind={LocalTailwind} />);
  })
  .add('0.0.17', async () => {
    // Doing as any here because of the React types mismatch between versions, but things should be fine
    await render(
      <EmailWithTailwind Tailwind={VersionSeventeenTailwind as any} />,
    );
  });

await bench.run();

writeFileSync(
  'bench-results-100-iterations.json',
  JSON.stringify(bench.results),
  'utf-8',
);
console.table(bench.table());
