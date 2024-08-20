import { promises as fs } from "node:fs";
import path from "node:path";
import { traverse } from "@babel/core";
import { parse } from "@babel/parser";
import { z } from "zod";
import type { Category, Component } from "../../../components/structure";
import {
  getComponentPathFromSlug,
  pathToComponents,
} from "../../../components/structure";

export type CodeVariant = "tailwind" | "inline-styles";

/**
 * A fuller version of the already defined `Component`.
 */
export interface ImportedComponent {
  slug: string;
  title: string;
  /**
   * Even though there may be multiple variants of code for this one pattern, the code
   * should render to the same thing, therefore we only need one element for them.
   *
   * this can be used as follows:
   *
   * ```tsx
   * <MyElement>{pattern.element}</MyElement>
   * ```
   */
  element: React.ReactElement;
  /**
   * This will either be an object containing the proper code variants
   * for the same pattern, or just the code if there are no variants
   * for this pattern. This can happen on patterns that don't use any styles.
   */
  code: Partial<Record<CodeVariant, string>> | string;
}

const ComponentModule = z.object({
  component: z.record(z.string(), z.any()),
});

const getComponentCodeFrom = (fileContent: string) => {
  const parsedContents = parse(fileContent, {
    sourceType: "unambiguous",
    strictMode: false,
    errorRecovery: true,
    plugins: ["jsx", "typescript", "decorators"],
  });

  let componentCode: string | undefined;
  traverse(parsedContents, {
    VariableDeclarator({ node }) {
      if (
        node.id.type === "Identifier" &&
        node.id.name === "component" &&
        (node.init?.type === "JSXElement" || node.init?.type === "JSXFragment")
      ) {
        const expression = node.init;
        if (expression.start && expression.end) {
          componentCode = fileContent.slice(expression.start, expression.end);
        }
      }
    },
  });

  if (componentCode) {
    // We need to remove the extra spaces that are included because of formatting
    // in the original file for the pattern
    return componentCode
      .split(/\r\n|\r|\n/)
      .map((line) => line.replace(/^\s{2}/, ""))
      .join("\n");
  }

  throw new Error("Could not find the source code for the pattern", {
    cause: {
      parsedContents,
      componentCode,
      fileContent,
    },
  });
};

const getComponentElement = async (filepath: string) => {
  const relativeFilepath = path.relative(pathToComponents, filepath);
  const patternModule = ComponentModule.parse(
    await import(
      `../../../components/${relativeFilepath.replace(
        path.extname(relativeFilepath),
        "",
      )}`
    ),
  );
  return patternModule.component as React.ReactElement;
};

const getImportedComponent = async (
  component: Component,
): Promise<ImportedComponent> => {
  const dirpath = getComponentPathFromSlug(component.slug);

  const variantFilenames = await fs.readdir(dirpath);
  if (variantFilenames.length === 1 && variantFilenames[0] === "index.tsx") {
    const filePath = path.join(dirpath, "index.tsx");
    const fileContent = await fs.readFile(filePath, "utf8");
    const code = getComponentCodeFrom(fileContent);
    return {
      ...component,
      element: await getComponentElement(filePath),
      code,
    };
  }

  const codePerVariant: Partial<Record<"tailwind" | "inline-styles", string>> =
    {};

  let element!: React.ReactElement;
  for await (const [i, variantFilename] of variantFilenames.entries()) {
    const filePath = path.join(dirpath, variantFilename);
    if (i === 0) {
      element = await getComponentElement(filePath);
    }

    const fileContent = await fs.readFile(filePath, "utf8");
    switch (variantFilename) {
      case "tailwind.tsx":
        codePerVariant.tailwind = getComponentCodeFrom(fileContent);
        break;
      case "inline-styles.tsx":
        codePerVariant["inline-styles"] = getComponentCodeFrom(fileContent);
        break;
      default:
        // eslint-disable-next-line no-console
        console.warn(
          `Unknown variant of pattern "${variantFilename}". The current only supported ones are "tailwind" and "inline-styles".`,
        );
    }
  }

  return {
    ...component,
    element,
    code: codePerVariant,
  };
};

export const getImportedComponentsFor = async (
  category: Category,
): Promise<ImportedComponent[]> => {
  return Promise.all(
    category.components.map((component) => getImportedComponent(component)),
  );
};
