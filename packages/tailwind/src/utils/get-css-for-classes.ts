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

export const getCSSForMarkup = (markup: string, config: Omit<TailwindConfig, 'content'> | undefined) => {
  const corePlugins = (config?.corePlugins as {}) || {};
  process.env.DEBUG = 'true baby';

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
