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

    expect(convertToComparable(inlinable)).toMatchInlineSnapshot(`
      {
        "bg-red-500": ".bg-red-500{background-color:var(--color-red-500)}",
        "text-center": ".text-center{text-align:center}",
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot('{}');
  });

  it('handles non-inlinable utilities', async () => {
    const tailwind = await setupTailwind({});
    const classes = ['lg:w-1/2'];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();

    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    expect(convertToComparable(inlinable)).toMatchInlineSnapshot('{}');
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "lg:w-1/2": ".lg\\:w-1\\/2{@media (width>=64rem){width:calc(1/2*100%)}}",
      }
    `);
  });

  it('handles a mix of inlinable and non-inlinable utilities', async () => {
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
    expect(convertToComparable(inlinable)).toMatchInlineSnapshot(`
      {
        "bg-red-500": ".bg-red-500{background-color:var(--color-red-500)}",
        "text-center": ".text-center{text-align:center}",
        "w-full": ".w-full{width:100%}",
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "lg:w-1/2": ".lg\\:w-1\\/2{@media (width>=64rem){width:calc(1/2*100%)}}",
      }
    `);
  });

  it('splits mixed rules (base + media) into inlinable base and non-inlinable media', async () => {
    const tailwind = await setupTailwind({
      plugins: [
        {
          handler: (api) => {
            api.addUtilities({
              '.text-body': {
                '@apply text-[green] sm:text-[darkgreen]': {},
              },
            });
          },
        },
      ],
    });
    const classes = ['text-body'];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();
    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    expect(convertToComparable(inlinable)).toMatchInlineSnapshot(`
      {
        "text-body": ".text-body{color:green}",
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "text-body": ".text-body{@media (width>=40rem){color:darkgreen}}",
      }
    `);
  });
});
