import { generate } from 'css-tree';
import { setupTailwind } from './setup-tailwind';

test('setupTailwind() and addUtilities()', async () => {
  const { addUtilities, getStyleSheet } = await setupTailwind({});

  addUtilities(['text-red-500', 'sm:bg-blue-300', 'bg-slate-900']);

  expect(generate(getStyleSheet())).toMatchSnapshot();

  addUtilities(['bg-red-100']);

  expect(generate(getStyleSheet())).toMatchSnapshot();
});
