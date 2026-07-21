import { generate, parse, type Rule, type StyleSheet } from 'css-tree';
import { setupTailwind } from '../tailwindcss/setup-tailwind.js';
import { extractRulesPerClass } from './extract-rules-per-class.js';

describe('extractRulesPerClass()', async () => {
  function convertToComparable(
    map: Map<string, Rule[]>,
  ): Record<string, string[]> {
    return Object.fromEntries(
      map
        .entries()
        .map(([k, rules]) => [k, rules.map((rule) => generate(rule))]),
    );
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
        "bg-red-500": [
          ".bg-red-500{background-color:var(--color-red-500)}",
        ],
        "text-center": [
          ".text-center{text-align:center}",
        ],
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot('{}');
  });

  it('keeps every rule when a class is defined more than once', async () => {
    const tailwind = await setupTailwind({
      config: {
        plugins: [
          {
            handler: (api) => {
              api.addComponents({
                '.box': { '@apply rounded-lg bg-white p-4': {} },
              });
              api.addComponents({
                '.box': { '@apply bg-red-500': {} },
              });
            },
          },
        ],
      },
    });
    const classes = ['box'];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();
    const { inlinable } = extractRulesPerClass(stylesheet, classes);

    expect(convertToComparable(inlinable)).toMatchInlineSnapshot(`
      {
        "box": [
          ".box{border-radius:var(--radius-lg);background-color:var(--color-white);padding:calc(var(--spacing)*4)}",
          ".box{background-color:var(--color-red-500)}",
        ],
      }
    `);
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
        "lg:w-1/2": [
          ".lg\\:w-1\\/2{@media (width>=64rem){width:calc(1/2*100%)}}",
        ],
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
        "bg-red-500": [
          ".bg-red-500{background-color:var(--color-red-500)}",
        ],
        "text-center": [
          ".text-center{text-align:center}",
        ],
        "w-full": [
          ".w-full{width:100%}",
        ],
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "lg:w-1/2": [
          ".lg\\:w-1\\/2{@media (width>=64rem){width:calc(1/2*100%)}}",
        ],
      }
    `);
  });

  it('splits mixed rules (base + media) into inlinable base and non-inlinable media', async () => {
    const tailwind = await setupTailwind({
      config: {
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
      },
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
        "text-body": [
          ".text-body{color:green}",
        ],
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "text-body": [
          ".text-body{@media (width>=40rem){color:darkgreen}}",
        ],
      }
    `);
  });

  it('treats rules with pseudo-selectors as fully non-inlinable', async () => {
    const tailwind = await setupTailwind({
      config: {
        plugins: [
          {
            handler: (api) => {
              api.addUtilities({
                '.btn:hover': {
                  color: 'red',
                },
              });
            },
          },
        ],
      },
    });
    const classes = ['btn'];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();
    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    expect(convertToComparable(inlinable)).toMatchInlineSnapshot('{}');
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "btn": [
          ".btn{&:hover{color:red}}",
        ],
      }
    `);
  });

  // Wrapped shape emitted by Tailwind >=4.3.3.
  // See https://github.com/resend/react-email/issues/3662
  it('treats @media-wrapped rules (Tailwind >=4.3.3) as non-inlinable', () => {
    const classes = [
      'bg-white',
      'text-black',
      'dark:bg-black',
      'dark:text-white',
    ];
    const stylesheet = parse(`
@layer utilities {
  .bg-white { background-color: rgb(255, 255, 255); }
  .text-black { color: rgb(0, 0, 0); }
  @media (prefers-color-scheme: dark) {
    .dark\\:bg-black { background-color: rgb(0, 0, 0); }
    .dark\\:text-white { color: rgb(255, 255, 255); }
  }
}
`) as StyleSheet;

    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    expect(convertToComparable(inlinable)).toMatchInlineSnapshot(`
      {
        "bg-white": [
          ".bg-white{background-color:rgb(255,255,255)}",
        ],
        "text-black": [
          ".text-black{color:rgb(0,0,0)}",
        ],
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "dark:bg-black": [
          ".dark\\:bg-black{@media (prefers-color-scheme:dark){background-color:rgb(0,0,0)}}",
        ],
        "dark:text-white": [
          ".dark\\:text-white{@media (prefers-color-scheme:dark){color:rgb(255,255,255)}}",
        ],
      }
    `);
  });

  // Nested shape emitted by Tailwind <=4.3.2; must classify identically.
  // See https://github.com/resend/react-email/issues/3662
  it('treats @media-nested rules (Tailwind <=4.3.2) as non-inlinable', () => {
    const classes = [
      'bg-white',
      'text-black',
      'dark:bg-black',
      'dark:text-white',
    ];
    const stylesheet = parse(`
@layer utilities {
  .bg-white { background-color: rgb(255, 255, 255); }
  .text-black { color: rgb(0, 0, 0); }
  .dark\\:bg-black { @media (prefers-color-scheme: dark) { background-color: rgb(0, 0, 0); } }
  .dark\\:text-white { @media (prefers-color-scheme: dark) { color: rgb(255, 255, 255); } }
}
`) as StyleSheet;

    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    expect(convertToComparable(inlinable)).toMatchInlineSnapshot(`
      {
        "bg-white": [
          ".bg-white{background-color:rgb(255,255,255)}",
        ],
        "text-black": [
          ".text-black{color:rgb(0,0,0)}",
        ],
      }
    `);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "dark:bg-black": [
          ".dark\\:bg-black{@media (prefers-color-scheme:dark){background-color:rgb(0,0,0)}}",
        ],
        "dark:text-white": [
          ".dark\\:text-white{@media (prefers-color-scheme:dark){color:rgb(255,255,255)}}",
        ],
      }
    `);
  });

  it('does not emit a bare nested rule for group/peer marker classes', async () => {
    const tailwind = await setupTailwind({});
    const classes = ['group', 'group-hover:underline'];
    tailwind.addUtilities(classes);

    const stylesheet = tailwind.getStyleSheet();
    const { inlinable, nonInlinable } = extractRulesPerClass(
      stylesheet,
      classes,
    );

    // Only the real utility is keyed; the `group` marker must not produce a
    // duplicate, parentless `&:is(...)` rule.
    expect(Object.keys(convertToComparable(inlinable))).toEqual([]);
    expect(convertToComparable(nonInlinable)).toMatchInlineSnapshot(`
      {
        "group-hover:underline": [
          ".group-hover\\:underline{&:is(:where(.group):hover *){@media (hover:hover){text-decoration-line:underline}}}",
        ],
      }
    `);
  });
});
