import postcss from "postcss";
import tailwindcss from "tailwindcss";
import postcssCssVariables from "postcss-css-variables";

import type { TailwindConfig } from "../tailwind";

declare global {
  var __OXIDE__: undefined;
}

global.__OXIDE__ = undefined;
// to avoid __OXIDE__ undefined errors
// this may cause problems later down the line when upadting tailwind
// since tailwind might migrate to using oxide for their transformations

export function getCSSForMarkup(
  markup: string,
  config: TailwindConfig | undefined,
) {
  const corePlugins = (config?.corePlugins as {}) || {};

  const tailwindConfig = {
    ...config,
    corePlugins: {
      preflight: false,
      ...corePlugins,
    },
  };

  const processor = postcss([
    tailwindcss({
      ...tailwindConfig,
      content: [{ raw: markup, extension: "html" }],
    }),
    postcssCssVariables(),
  ]);
  const result = processor.process(
    String.raw`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
    { from: undefined }, // no need to use from since the `content` context is sent into tailwind
  );
  return result.css;
}
