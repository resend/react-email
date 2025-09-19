import { generate } from 'css-tree';
import { setupTailwind } from './setup-tailwind';

test('setupTailwind() and addUtilities()', async () => {
  const { addUtilities } = await setupTailwind({});

  expect(
    generate(addUtilities(['text-red-500', 'sm:bg-blue-300', 'bg-slate-900'])),
  ).toMatchSnapshot();

  expect(generate(addUtilities(['bg-red-100']))).toMatchSnapshot();
});
