import postcss from "postcss";
import postcssCssVaraibles from "postcss-css-variables";
import processTailwindFeatures from "tailwindcss/src/processTailwindFeatures.js";
import resolveConfig from "tailwindcss/src/public/resolve-config.js";
import type { Config as TailwindConfig } from "tailwindcss";
import type { RequiredConfig } from "tailwindcss/types/config";


declare global {
  var __OXIDE__: undefined;
}

global.__OXIDE__ = undefined;
// to avoid __OXIDE__ undefined errors
// this may cause problems later down the line when upadting tailwind 
// since tailwind might migrate to using oxide for their transformations

export function getCSSForMarkup(markup: string, config: Omit<TailwindConfig, 'content'> | undefined) {
  const corePlugins = (config?.corePlugins as {}) || {};

  const tailwindConfig = resolveConfig({
    ...config,
    corePlugins: {
      preflight: false,
      ...corePlugins,
    }
  } as unknown as RequiredConfig);

  const tailwindcssPlugin = processTailwindFeatures(
    ({ createContext }) => () => createContext(tailwindConfig, [{ content: markup }])
  );
  const processor = postcss([
    tailwindcssPlugin, 
    postcssCssVaraibles(),
  ]);
  const result = processor
    .process(
      String.raw`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      { from: undefined } // no need to use from since the `content` context is sent into tailwind
    );
  return result.css;
};
