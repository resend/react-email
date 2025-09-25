import { generate, parse } from 'css-tree';
import { resolveAllCssVariables } from './resolve-all-css-variables';

describe('resolveAllCSSVariables', () => {
  it('ignores @layer (properties) defined for browser compatibility', () => {
    const root =
      parse(`/*! tailwindcss v4.1.12 | MIT License | https://tailwindcss.com */
@layer properties;
@layer theme, base, components, utilities;
@layer theme {
  :root, :host {
    --color-red-500: oklch(63.7% 0.237 25.331);
    --color-blue-400: oklch(70.7% 0.165 254.624);
    --color-blue-600: oklch(54.6% 0.245 262.881);
    --color-gray-200: oklch(92.8% 0.006 264.531);
    --color-black: #000;
    --color-white: #fff;
    --spacing: 0.25rem;
    --text-sm: 0.875rem;
    --text-sm--line-height: calc(1.25 / 0.875);
    --radius-md: 0.375rem;
  }
}
@layer utilities {
  .mt-8 {
    margin-top: calc(var(--spacing) * 8);
  }
  .rounded-md {
    border-radius: var(--radius-md);
  }
  .bg-blue-600 {
    background-color: var(--color-blue-600);
  }
  .bg-red-500 {
    background-color: var(--color-red-500);
  }
  .bg-white {
    background-color: var(--color-white);
  }
  .p-4 {
    padding: calc(var(--spacing) * 4);
  }
  .px-3 {
    padding-inline: calc(var(--spacing) * 3);
  }
  .py-2 {
    padding-block: calc(var(--spacing) * 2);
  }
  .text-sm {
    font-size: var(--text-sm);
    line-height: var(--tw-leading, var(--text-sm--line-height));
  }
  .text-\[14px\] {
    font-size: 14px;
  }
  .leading-\[24px\] {
    --tw-leading: 24px;
    line-height: 24px;
  }
  .text-black {
    color: var(--color-black);
  }
  .text-blue-400 {
    color: var(--color-blue-400);
  }
  .text-blue-600 {
    color: var(--color-blue-600);
  }
  .text-gray-200 {
    color: var(--color-gray-200);
  }
  .no-underline {
    text-decoration-line: none;
  }
}
@property --tw-leading {
  syntax: "*";
  inherits: false;
}
@layer properties {
  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {
    *, ::before, ::after, ::backdrop {
      --tw-leading: initial;
    }
  }
}
`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should work with simple css variables on a :root', () => {
    const root = parse(`:root {
  --width: 100px;
}

.box {
  width: var(--width);
}`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should work for variables across different CSS layers', () => {
    const root = parse(`@layer base {
      :root {
        --width: 100px;
      }
    }

    @layer utilities {
      .box {
        width: var(--width);
      }
    }`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should work with multiple variables in the same declaration', () => {
    const root = parse(`:root {
      --top: 101px;
      --bottom: 102px;
      --right: 103px;
      --left: 104px;
    }

    .box {
      margin: var(--top) var(--right) var(--bottom) var(--left);
    }`);

    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should keep variable usages if it cant find their declaration', () => {
    const root = parse(`.box {
  width: var(--width);
}`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should work with variables set in the same rule', () => {
    const root = parse(`.box {
  --width: 200px;
  width: var(--width);
}

@media (min-width: 1280px) {
  .xl\\:bg-green-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(34 197 94 / var(--tw-bg-opacity))
  }
}
`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should work with a variable set in a layer, and used in another through a media query', () => {
    const root = parse(`@layer theme {
  :root {
    --color-blue-300: blue;
  }
}

@layer utilities {
  .sm\:bg-blue-300 {
    @media (width >= 40rem) {
      background-color: var(--color-blue-300);
    }
  }
}`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('uses fallback values when variable definition is not found', () => {
    const root = parse(`.box {
  width: var(--undefined-width, 150px);
  height: var(--undefined-height, 200px);
  margin: var(--undefined-margin, 10px 20px);
}`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should handle nested var() functions in fallbacks', () => {
    const root = parse(`:root {
  --fallback-width: 300px;
}

.box {
  width: var(--undefined-width, var(--fallback-width));
  height: var(--undefined-height, var(--also-undefined, 250px));
}`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  it('should handle deeply nested var() functions with complex parentheses', () => {
    const root = parse(`:root {
  --primary: blue;
  --secondary: red;
  --fallback: green;
  --size: 20px;
}

.box {
  color: var(--primary, var(--secondary, var(--fallback)));
  width: var(--size, calc(100px + var(--size, 20px)));
  border: var(--border-width, var(--border-style, var(--border-color, 1px solid black)));
  --r: 100;
  --b: 10;
  background: var(--bg-color, rgb(var(--r, 255), var(--g, 0), var(--b, 0)));
}`);
    resolveAllCssVariables(root);
    expect(generate(root)).toMatchSnapshot();
  });

  // this behavior is not supported anymore, since it doesn't seem like tailwindcss actually generates any CSS that uses the pattern of defining css variables from inside media queries
  //
  // it.only('should work with different values between media queries', () => {
  //   const root = parse(`:root {
  //     --width: 100px;
  //   }
  //
  //   @media (max-width: 1000px) {
  //     :root {
  //       --width: 200px;
  //     }
  //   }
  //
  //   .box {
  //     width: var(--width);
  //   }`);
  //   expect(
  //     generate(resolveAllCSSVariables(root)),
  //   ).toBe(`@media (max-width: 1000px) {
  //     .box {
  //       width: 200px;
  //     }
  //   }
  //
  //   .box {
  //     width: 100px;
  //   }`);
  // });
});
