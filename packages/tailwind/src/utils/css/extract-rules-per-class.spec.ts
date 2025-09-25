import { generate, type Rule } from 'css-tree';
import { setupTailwind } from '../tailwindcss/setup-tailwind';
import { extractRulesPerClass } from './extract-rules-per-class';

describe('extractRulesPerClass()', async () => {
  function convertToComparable(map: Map<string, Rule>): Record<string, string> {
    return Object.fromEntries(map.entries().map(([k, v]) => [k, generate(v)]));
  }

  it('works with just inlinable utilities', async () => {
    const tailwind = await setupTailwind({});
    const classes = ['text-center', 'bg-red-500'];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();

    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    expect(convertToComparable(inlinable)).toMatchSnapshot();
    expect(convertToComparable(nonInlinable)).toMatchSnapshot();
  });

  it('should work with non-inlinable utilities', async () => {
    const tailwind = await setupTailwind({});
    const classes = ['lg:w-1/2'];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();

    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    expect(convertToComparable(inlinable)).toMatchSnapshot();
    expect(convertToComparable(nonInlinable)).toMatchSnapshot();
  });

  it('should work with a mix of inlinable and non-inlinable utilities', async () => {
    const tailwind = await setupTailwind({});
    const classes = [
      'text-center',
      'bg-red-500',
      'some-other-class', // should be ignored
      'w-full',
      'lg:w-1/2',
    ];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();
    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );
    expect(convertToComparable(inlinable)).toMatchSnapshot();
    expect(convertToComparable(nonInlinable)).toMatchSnapshot();
  });
});
