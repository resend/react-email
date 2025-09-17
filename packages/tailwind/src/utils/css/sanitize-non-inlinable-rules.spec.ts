import { generate } from 'css-tree';
import { setupTailwind } from '../tailwindcss/setup-tailwind';
import { sanitizeNonInlinableRules } from './sanitize-non-inlinable-rules';

describe('sanitizeNonInlinableRules()', () => {
  it('should handle rules that can be inlined', async () => {
    const tailwind = await setupTailwind({});
    const stylesheet = tailwind.aggregateIntoCss([
      'bg-gray-900',
      'text-red-300',
      'text-lg',
    ]);

    sanitizeNonInlinableRules(stylesheet);
    expect(generate(stylesheet)).toMatchSnapshot();
  });

  it('should css nesting in hover pseudo styles', async () => {
    const tailwind = await setupTailwind({});
    const stylesheet = tailwind.aggregateIntoCss([
      'hover:text-sky-600',
      'sm:focus:outline-none',
      'md:hover:bg-gray-100',
      'lg:focus:underline',
    ]);

    sanitizeNonInlinableRules(stylesheet);
    expect(generate(stylesheet)).toMatchSnapshot();
  });

  it('shuold work with basic media query rules', async () => {
    const tailwind = await setupTailwind({});
    const stylesheet = tailwind.aggregateIntoCss([
      'sm:mx-auto',
      'sm:max-w-lg',
      'sm:rounded-lg',
      'md:px-10',
      'md:py-12',
    ]);

    sanitizeNonInlinableRules(stylesheet);

    expect(generate(stylesheet)).toMatchSnapshot();
  });
});
