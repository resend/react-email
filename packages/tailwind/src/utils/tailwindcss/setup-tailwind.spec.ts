import { generate } from 'css-tree';
import { setupTailwind } from './setup-tailwind';

test('setupTailwind() and addUtilities()', async () => {
  const { addUtilities, getStyleSheet } = await setupTailwind({});

  addUtilities(['text-red-500', 'sm:bg-blue-300', 'bg-slate-900']);

  expect(generate(getStyleSheet())).toMatchInlineSnapshot(`"/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer theme,base,components,utilities;@layer theme{:root,:host{--color-red-500: oklch(63.7% 0.237 25.331);--color-blue-300: oklch(80.9% 0.105 251.813);--color-slate-900: oklch(20.8% 0.042 265.755)}}@layer utilities{.bg-slate-900{background-color:var(--color-slate-900)}.text-red-500{color:var(--color-red-500)}.sm\\:bg-blue-300{@media (width>=40rem){background-color:var(--color-blue-300)}}}"`);

  addUtilities(['bg-red-100']);

  expect(generate(getStyleSheet())).toMatchInlineSnapshot(`"/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */@layer theme,base,components,utilities;@layer theme{:root,:host{--color-red-100: oklch(93.6% 0.032 17.717);--color-red-500: oklch(63.7% 0.237 25.331);--color-blue-300: oklch(80.9% 0.105 251.813);--color-slate-900: oklch(20.8% 0.042 265.755)}}@layer utilities{.bg-red-100{background-color:var(--color-red-100)}.bg-slate-900{background-color:var(--color-slate-900)}.text-red-500{color:var(--color-red-500)}.sm\\:bg-blue-300{@media (width>=40rem){background-color:var(--color-blue-300)}}}"`);
});
