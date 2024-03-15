import fs from "node:fs";
import path from "node:path";
import { parse as parseJavascriptObject } from "json5";
import type { SourceCode } from "@typescript-eslint/utils/ts-eslint";
import type { TSESTree } from "@typescript-eslint/utils";
import esquery from "esquery";
import type { TailwindComponentConfig } from "./setup-tailwind-context";

const getPathOfExistingFile = (...paths: string[]) => {
  for (const pathToFile of paths) {
    const exists = fs.existsSync(pathToFile);
    if (exists) {
      return pathToFile;
    }
  }

  return undefined;
};

/**
 * Tries to find the user defined Tailwind config so that the eslint rules run on the actually
 * generated styles instead of on the ones that Tailwind generates by default.
 *
 * It tries find the Tailwind config through two ways currently:
 * 1. It looks for a `tailwind.config` file that can end with `.ts`, `.js` or `.mjs` and then requires it and tries to get its default export.
 * 2. If it doesn't find a Tailwind config file, it then tries to look for the `config` attribute in the `Tailwind` element as to read it like a JSON.
 * If is unable to do so, it errors.
 */
export function getTailwindConfigFromSourceCode(sourceCode: SourceCode) {
  const pathToExistingConfig = getPathOfExistingFile(
    path.resolve(process.cwd(), "tailwind.config.ts"),
    path.resolve(process.cwd(), "tailwind.config.js"),
    path.resolve(process.cwd(), "tailwind.config.mjs"),
  );

  if (pathToExistingConfig !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const tailwindConfigModule = require(pathToExistingConfig) as unknown;

    if (
      typeof tailwindConfigModule === "object" &&
      tailwindConfigModule !== null &&
      "default" in tailwindConfigModule
    ) {
      return tailwindConfigModule.default as TailwindComponentConfig;
    }

    console.error(
      `Could not read Tailwind config at ${pathToExistingConfig} because it doesn't have a default export in it.`,
    );
    process.exit(-1);
  } else {
    // console.log(sourceCode.ast.body[0].body.body[0]);
    const configAttributeNode = esquery(
      sourceCode.ast,
      'JSXOpeningElement[name.name="Tailwind"] JSXAttribute[name.name="config"] ObjectExpression',
    )[0] as TSESTree.JSXAttribute | undefined;

    if (configAttributeNode === undefined) {
      return {};
    }

    const configSourceCode = sourceCode.getText(configAttributeNode);

    try {
      return parseJavascriptObject<TailwindComponentConfig>(configSourceCode);
    } catch (exception) {
      console.error(exception);
      console.error(
        `Tried reading the config defined directly in the Tailwind component but was unable to, probably because it isn't a valid javascript object by itself.`,
        `Configuration that caused this: ${configSourceCode}`,
      );
      process.exit(-1);
    }
  }
}
