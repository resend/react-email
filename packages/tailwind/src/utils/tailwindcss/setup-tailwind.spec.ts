import { generate } from 'css-tree';
import { setupTailwind } from './setup-tailwind';

test("setupTailwind() and generateCssFrom()", async () => {
  const { aggregateIntoCss } = await setupTailwind({});

  expect(
    generate(
      aggregateIntoCss(['text-red-500', 'sm:bg-blue-300', 'bg-slate-900']),
    ),
  ).toMatchSnapshot();

  expect(
    generate(
      aggregateIntoCss(['bg-red-100']),
    ),
  ).toMatchSnapshot();
});
