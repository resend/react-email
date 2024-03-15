import fs from "node:fs";
import path from "node:path";
import jiti from 'jiti';
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

const runConfigFile = jiti(__filename, {
  interopDefault: true
})

/**
 * Tries to find the user defined Tailwind config so that the eslint rules run on the actually
 * generated styles instead of on the ones that Tailwind generates by default.
 *
 * It tries find the Tailwind config through two ways currently:
 * 1. It looks for a `tailwind.config` file that can end with `.ts`, `.js` or `.mjs` and then requires it and tries to get its default export.
 * 2. If it doesn't find a Tailwind config file, it then tries to look for the `config` attribute in the `Tailwind` element as to read it like a JSON.
 * If is unable to do so, it errors.
 */
export function getTailwindConfigFromSourceCode(sourceCode: SourceCode, filename: string) {
  const tailwindConfigIdentifier = esquery(
    sourceCode.ast,
    /*
      Will find the node in the AST similar to the following:

      function Component() {
        return <Tailwind config={tailwindConfig}></Tailwind>;
      }

      If the user is to add something like an `as` to the end, this will not match it, meaning
      the eslint plugin will fail to resolve their config properly.
    */
    'JSXOpeningElement[name.name="Tailwind"] JSXAttribute[name.name="config"] JSXExpressionContainer > Identifier'
  )[0] as TSESTree.Identifier | undefined;

  if (tailwindConfigIdentifier !== undefined) {
    const tailwindConfigIdentifierName = tailwindConfigIdentifier.name;
    const tailwindConfigImport = esquery(
      sourceCode.ast,
      /*
        Will find the import that contains the identifier used in the config of the Tailwind component found above.
        So something like:
  
        import tailwindConfig from 'tailwind.config';
  
        function Component() {
          return <Tailwind config={tailwindConfig}></Tailwind>;
        }
  
        Will be found and then parsed to find whether or not the file actually exists and
        then import it either with `jiti` or with `require`.
      */
      `ImportDeclaration:has([specifiers] Identifier[name="${tailwindConfigIdentifierName}"])`
    )[0] as TSESTree.ImportDeclaration | undefined;
    if (tailwindConfigImport !== undefined) {
      const relativePath = tailwindConfigImport.source.value;
      let tailwindConfigPath: string | undefined = path.resolve(path.dirname(filename), relativePath);
      tailwindConfigPath = getPathOfExistingFile(
        `${tailwindConfigPath}.ts`,
        `${tailwindConfigPath}.js`,
        `${tailwindConfigPath}.mjs`,
        `${tailwindConfigPath}.cjs`,
      );

      if (tailwindConfigPath === undefined) {
        console.error(
          `Could not find Tailwind config by inferring it's extension type (tried .ts, .js, .mjs and .cjs).`,
          path.resolve(path.dirname(filename), relativePath)
        );
        process.exit(-1);
      }

      const tailwindConfigModule = tailwindConfigPath.endsWith('.ts')
        ? runConfigFile(tailwindConfigPath) as unknown
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        : require(tailwindConfigPath) as unknown;

      if (
        typeof tailwindConfigModule === "object" &&
        tailwindConfigModule !== null &&
        "default" in tailwindConfigModule
      ) {
        return tailwindConfigModule.default as TailwindComponentConfig;
      }

      console.error(
        `Could not read Tailwind config at ${tailwindConfigPath} because it doesn't have a default export in it.`,
      );
      process.exit(-1);
    }
  }

  const configObjectExpression = esquery(
    sourceCode.ast,
    'JSXOpeningElement[name.name="Tailwind"] JSXAttribute[name.name="config"] ObjectExpression',
  )[0] as TSESTree.JSXAttribute | undefined;

  if (configObjectExpression === undefined) {
    return {};
  }

  const configSourceCode = sourceCode.getText(configObjectExpression);

  try {
    return parseJavascriptObject<TailwindComponentConfig>(configSourceCode);
  } catch (exception) {
    console.warn(exception);
    console.warn(
      `Tried reading the config defined directly in the Tailwind component but was unable to, probably because it isn't a valid javascript object by itself.`,
      `Configuration that caused this: ${configSourceCode}. Falling back to the default Tailwind configuration.`,
    );

    return {};
  }
}
