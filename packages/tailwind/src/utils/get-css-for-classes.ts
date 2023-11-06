/// <reference path="../tailwind.d.ts" />
import postcss from "postcss";
import postcssVariables from "postcss-css-variables";
import processTailwindFeatures from "tailwindcss/src/processTailwindFeatures.js";
import resolveConfig from "tailwindcss/src/public/resolve-config.js";

import type { Config as TailwindConfig } from "tailwindcss";
import { RequiredConfig } from "tailwindcss/types/config";
import { createContext } from "tailwindcss/src/lib/setupContextUtils.js";
import { contextMap } from "tailwindcss/src/lib/sharedState.js";

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

  const tailwindcssPlugin: postcss.AcceptedPlugin = (root, result) => {
    processTailwindFeatures(() => () => { 
      const context = createContext(tailwindConfig, [{ content: markup }], root);

      return context;
    })(root, result);
  }
  const result = postcss([tailwindcssPlugin, postcssVariables()])
    .process(
      String.raw`
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
      `,
      { from: 'fake' } // no need to use from since the `content` context is sent into tailwind
    );
  return result.css;
};
