import { render } from '@react-email/render';
import { Tailwind as CurrentTailwind } from '@react-email/tailwind';
import { Bench } from 'tinybench';
import EmailWithTailwind from './emails/with-tailwind.js';
import EmailWithoutTailwind from './emails/without-tailwind.js';

// import like this instead of installing from the workspace
// to still be able to test versions that are already published

async function main() {
  const bench = new Bench({ time: 100 });

  bench
    .add('without tailwind', async () => {
      await render(<EmailWithoutTailwind />);
    })
    .add('with current tailwind', async () => {
      await render(<EmailWithTailwind Tailwind={CurrentTailwind} />);
    });

  await bench.run();

  return bench;
}

main()
  .then((bench) => {
    console.table(bench.table());
  })
  .catch(console.error);
