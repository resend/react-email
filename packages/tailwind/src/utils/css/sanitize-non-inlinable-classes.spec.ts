import { type CssNode, generate, List, parse, type StyleSheet } from 'css-tree';
import { sanitizeNonInlinableClasses } from './sanitize-non-inlinable-classes';

test('sanitizeNonInlinableClasses()', async () => {
  const stylesheet = parse(`
@layer theme, base, components, utilities;
@layer utilities {
  .bg-gray-900 {
    background-color: oklch(21% 0.034 264.665);
  }
  .hover\\:text-sky-600 {
    &:hover {
      @media (hover: hover) {
        color: oklch(58.8% 0.158 241.966);
      }
    }
  }
  .sm\\:mx-auto {
    @media (width >= 40rem) {
      margin-inline: auto;
    }
  }
  .sm\\:max-w-lg {
    @media (width >= 40rem) {
      max-width: 32rem;
    }
  }
  .sm\\:rounded-lg {
    @media (width >= 40rem) {
      border-radius: 0.5rem;
    }
  }
  .sm\\:focus\\:outline-none {
    @media (width >= 40rem) {
      &:focus {
        --tw-outline-style: none;
        outline-style: none;
      }
    }
  }
  .md\\:px-10 {
    @media (width >= 48rem) {
      padding-inline: calc(0.25rem * 10);
    }
  }
  .md\\:py-12 {
    @media (width >= 48rem) {
      padding-block: calc(0.25rem * 12);
    }
  }
  .md\\:hover\\:bg-gray-100 {
    @media (width >= 48rem) {
      &:hover {
        @media (hover: hover) {
          background-color: oklch(96.7% 0.003 264.542);
        }
      }
    }
  }
  .lg\\:focus\\:underline {
    @media (width >= 64rem) {
      &:focus {
        text-decoration-line: underline;
      }
    }
  }
} `);

  const { nonInlinableClasses, sanitizedRules } =
    sanitizeNonInlinableClasses(stylesheet);
  expect(
    generate({
      type: 'StyleSheet',
      children: new List<CssNode>().fromArray(sanitizedRules),
    } satisfies StyleSheet),
  ).toMatchSnapshot();
  expect(nonInlinableClasses).toEqual([
    'hover:text-sky-600',
    'sm:mx-auto',
    'sm:max-w-lg',
    'sm:rounded-lg',
    'sm:focus:outline-none',
    'md:px-10',
    'md:py-12',
    'md:hover:bg-gray-100',
    'lg:focus:underline',
  ]);
});
