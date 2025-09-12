import { type CssNode, generate, List, type StyleSheet } from 'css-tree';
import { generateRootForClasses } from '../tailwindcss/generate-root-for-classes';
import { sanitizeNonInlinableClasses } from './sanitize-non-inlinable-classes';

describe('sanitizeNonInlinableClasses()', async () => {
  it('should handle rules that can be inlined', async () => {
    const stylesheet = await generateRootForClasses(
      ['bg-gray-900 text-red-300 text-lg'],
      {},
    );

    const { nonInlinableClasses, sanitizedRules } =
      sanitizeNonInlinableClasses(stylesheet);
    expect(
      generate({
        type: 'StyleSheet',
        children: new List<CssNode>().fromArray(sanitizedRules),
      } satisfies StyleSheet),
    ).toMatchSnapshot();
    expect(nonInlinableClasses).toMatchSnapshot();
  });

  it('should css nesting in hover pseudo styles', async () => {
    const stylesheet = await generateRootForClasses(
      [
        'hover:text-sky-600',
        'sm:focus:outline-none',
        'md:hover:bg-gray-100',
        'lg:focus:underline',
      ],
      {},
    );

    const { nonInlinableClasses, sanitizedRules } =
      sanitizeNonInlinableClasses(stylesheet);
    expect(
      generate({
        type: 'StyleSheet',
        children: new List<CssNode>().fromArray(sanitizedRules),
      } satisfies StyleSheet),
    ).toMatchSnapshot();
    expect(nonInlinableClasses).toMatchSnapshot();
  });

  it('shuold work with basic media query rules', async () => {
    const stylesheet = await generateRootForClasses(
      ['sm:mx-auto', 'sm:max-w-lg', 'sm:rounded-lg', 'md:px-10', 'md:py-12'],
      {},
    );

    const { nonInlinableClasses, sanitizedRules } =
      sanitizeNonInlinableClasses(stylesheet);
    expect(
      generate({
        type: 'StyleSheet',
        children: new List<CssNode>().fromArray(sanitizedRules),
      } satisfies StyleSheet),
    ).toMatchSnapshot();
    expect(nonInlinableClasses).toEqual([
      'sm:mx-auto',
      'sm:max-w-lg',
      'sm:rounded-lg',
      'md:px-10',
      'md:py-12',
    ]);
  });
});
