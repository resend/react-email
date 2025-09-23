import { generate } from 'css-tree';
import { setupTailwind } from '../tailwindcss/setup-tailwind';
import { sanitizeNonInlinableRules } from './sanitize-non-inlinable-rules';

describe('sanitizeNonInlinableRules()', () => {
  it('should handle rules that can be inlined', async () => {
    const tailwind = await setupTailwind({});
    tailwind.addUtilities(['bg-gray-900', 'text-red-300', 'text-lg']);
    const stylesheet = tailwind.getStyleSheet();

    sanitizeNonInlinableRules(stylesheet);
    expect(generate(stylesheet)).toMatchSnapshot();
  });

  it('should css nesting in hover pseudo styles', async () => {
    const tailwind = await setupTailwind({});
    tailwind.addUtilities([
      'hover:text-sky-600',
      'sm:focus:outline-none',
      'md:hover:bg-gray-100',
      'lg:focus:underline',
    ]);

    const stylesheet = tailwind.getStyleSheet();

    sanitizeNonInlinableRules(stylesheet);
    expect(generate(stylesheet)).toMatchSnapshot();
  });

  it('should work with basic media query rules', async () => {
    const tailwind = await setupTailwind({});
    tailwind.addUtilities([
      'sm:mx-auto',
      'sm:max-w-lg',
      'sm:rounded-lg',
      'md:px-10',
      'md:py-12',
    ]);
    const stylesheet = tailwind.getStyleSheet();

    sanitizeNonInlinableRules(stylesheet);

    expect(generate(stylesheet)).toMatchSnapshot();
  });
});
