import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { pathToComponents } from "./get-categories";

export interface Component {
  title: string;
  component: React.FC;
  /*
    These variants are encoded through the component's name. So a component
    named `Tailwind`, and with the proper syntax, will come in here.
    
    The "None" variant is meant for when there is no variant, so there should be no
    select to change variants.
  */
  codePerVariant: Partial<Record<"Tailwind" | "InlineStyles" | "None", string>>;
}

const ComponentModule = z.object({
  title: z.string(),
  default: z.function(),
});

const getComponentAt = async (filepath: string): Promise<Component> => {
  // This regex matches React components, extracting their name and their JSX code
  const codeRegex =
    /export const (?<componentName>[^=\s]+)\s*=\s*\(\)\s*=>\s*{[\n\r\s]*return\s*\((?<componentCode>[\s\S]+?)\s*\);?/gm;

  const file = await fs.readFile(filepath, "utf8");

  const codePerVariant: Component["codePerVariant"] = {};
  let match: RegExpMatchArray | null = codeRegex.exec(file);

  while (match !== null) {
    const variant = match.groups?.componentName;
    const code = match.groups?.componentCode;

    if (variant !== undefined && code !== undefined) {
      codePerVariant[variant] = code;
    } else {
      throw new Error("Could not find the source code for the component", {
        cause: {
          filepath,
          code,
          variant,
          match,
        },
      });
    }

    match = codeRegex.exec(file);
  }

  const relativeFilepath = path.relative(pathToComponents, filepath);
  const componentModule = ComponentModule.parse(
    await import(
      `../../../patterns/${relativeFilepath.replace(
        path.extname(relativeFilepath),
        "",
      )}`
    ),
  );

  return {
    title: componentModule.title,
    component: componentModule.default as React.FC,
    codePerVariant,
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
