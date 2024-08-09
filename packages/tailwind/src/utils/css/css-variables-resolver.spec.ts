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

  it.only("should work with different values between media queries", () => {
    const css = `:root {
  --width: 100px;
}

@media (max-width: 1000px) {
  :root {
    --width: 200px;
  }
}

.box {
  width: calc(var(--width) * var(--width));
}`;

    const result = processor.process(css);
    expect(result.css).toBe(`.box {
  width: 100px;
}

@media (max-width: 1000px) {
  .box {
    width: calc(200px * 200px);
  }
}`);
  });
});
