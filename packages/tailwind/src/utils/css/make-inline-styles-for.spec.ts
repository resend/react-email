import { generateRootForClasses } from '../tailwindcss/generate-root-for-classes';
import { makeInlineStylesFor } from './make-inline-styles-for';

test('makeInlineStylesFor()', async () => {
  const className =
    'bg-red-500 sm:bg-blue-300 w-full md:max-w-[400px] my-custom-class';
  const tailwindStyles = await generateRootForClasses(className.split(' '), {});

  expect(makeInlineStylesFor(className, tailwindStyles)).toEqual({
    styles: { backgroundColor: 'rgb(239 68 68 / 1)', width: '100%' },
    residualClassName: 'sm:bg-blue-300 md:max-w-[400px] my-custom-class',
  });
});
