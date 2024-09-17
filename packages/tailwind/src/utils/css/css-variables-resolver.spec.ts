import postcss from "postcss";
import { cssVariablesResolver } from "./css-variables-resolver";

describe("cssVariablesResolver", () => {
  const processor = postcss([cssVariablesResolver()]);

  it("should work with simple css variables on a :root", () => {
    const css = `:root {
  --width: 100px;
}

.box {
  width: var(--width);
}`;

    expect(processor.process(css).css).toBe(`.box {
  width: 100px;
}`);
  });

  it("should keep variable usages if it cant find their declaration", () => {
    const result = processor.process(`.box {
  width: var(--width);
}`);

    expect(result.css).toBe(`.box {
  width: var(--width);
}`);
  });

  it("should work with variables set in the same rule", () => {
    const result = processor.process(`.box {
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
    expect(result.css).toBe(`.box {
  width: 200px;
}

@media (min-width: 1280px) {
  .xl\\:bg-green-500 {
    background-color: rgb(34 197 94 / 1)
  }
}
`);
  });

  it("should work with different values between media queries", () => {
    const css = `:root {
  --width: 100px;
}

@media (max-width: 1000px) {
  :root {
    --width: 200px;
  }
}

.box {
  width: var(--width);
}`;

    const result = processor.process(css);
    expect(result.css).toBe(`@media (max-width: 1000px) {
  .box {
    width: 200px;
  }
}

.box {
  width: 100px;
}`);
  });
});
