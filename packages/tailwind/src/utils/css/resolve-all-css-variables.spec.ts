import { parse } from 'postcss';
import { resolveAllCSSVariables } from './resolve-all-css-variables';

describe('resolveAllCSSVariables', () => {
  it('should work with simple css variables on a :root', () => {
    const root = parse(`:root {
  --width: 100px;
}

.box {
  width: var(--width);
}`);

    expect(resolveAllCSSVariables(root).toString()).toBe(`.box {
  width: 100px;
}`);
  });

  it('should keep variable usages if it cant find their declaration', () => {
    const root = parse(`.box {
  width: var(--width);
}`);

    expect(resolveAllCSSVariables(root).toString()).toBe(`.box {
  width: var(--width);
}`);
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
    expect(resolveAllCSSVariables(root).toString()).toBe(`.box {
  width: 200px;
}

@media (min-width: 1280px) {
  .xl\\:bg-green-500 {
    background-color: rgb(34 197 94 / 1)
  }
}
`);
  });

  it('should work with different values between media queries', () => {
    const root = parse(`:root {
  --width: 100px;
}

@media (max-width: 1000px) {
  :root {
    --width: 200px;
  }
}

.box {
  width: var(--width);
}`);
    expect(
      resolveAllCSSVariables(root).toString(),
    ).toBe(`@media (max-width: 1000px) {
  .box {
    width: 200px;
  }
}

.box {
  width: 100px;
}`);
  });
});
