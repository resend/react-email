import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { pathToComponents } from "./get-categories";

export interface Component {
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
  element: React.ReactNode;
  /**
   * This will either be an object containing the proper code variants
   * for the same pattern, or just the code if there are no variants
   * for this pattern. This can happen on patterns that don't use any styles.
   */
  code: Partial<Record<"tailwind" | "inline-styles", string>> | string;
}

const ComponentModule = z.object({
  title: z.string(),
  pattern: z.record(z.string(), z.any()),
});

const getComponentCodeFrom = (fileContent: string) => {
  const componentCodeRegex =
    /export\s+const\s+pattern\s*=\s*\(\s*(?<componentCode>[\s\S]+?)\s*\);/gm;
  const match = componentCodeRegex.exec(fileContent);
  if (match?.groups?.componentCode) {
    return match.groups.componentCode;
  }

  throw new Error("Could not find the source code for the pattern", {
    cause: {
      match,
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
  return patternModule.pattern as React.ReactNode;
};

const getComponentAt = async (dirpath: string): Promise<Component> => {
  const componentName = path.basename(dirpath);

  const variantFilenames = await fs.readdir(dirpath);
  if (variantFilenames.length === 1 && variantFilenames[0] === "index.tsx") {
    const filePath = path.join(dirpath, "index.tsx");
    const fileContent = await fs.readFile(filePath, "utf8");
    const code = getComponentCodeFrom(fileContent);
    return {
      title: componentName,
      element: await getComponentElement(filePath),
      code,
    };
  }

  const codePerVariant: Partial<Record<"tailwind" | "inline-styles", string>> =
    {};

  let element: React.ReactNode;
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
    title: componentName,
    element,
    code: codePerVariant,
  };
};

export const getComponentsIn = async (name: string) => {
  const categoryDirpath = path.join(pathToComponents, name);

  const componentFilenames = await fs.readdir(categoryDirpath);
  const componentFilepaths = componentFilenames.map((filename) =>
    path.join(categoryDirpath, filename),
  );

  return Promise.all(
    componentFilepaths.map((filepath) => getComponentAt(filepath)),
  );
};
