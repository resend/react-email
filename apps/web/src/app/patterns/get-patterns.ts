import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import { pathToPatterns } from "./get-categories";

export interface Pattern {
  title: string;
  component: React.FC;
  /*
    These variants are encoded through the pattern component's name. So a component
    named `Tailwind`, and with the proper syntax, will come in here.
    
    The "None" Variant is meant for when there is no variant, so there should be no
    select to change variants.
  */
  codePerVariant: Partial<Record<"Tailwind" | "InlineStyles" | "None", string>>;
}

const PatternModule = z.object({
  title: z.string(),
  default: z.function(),
});

const getPatternAt = async (filepath: string) => {
  // This regex matches React components, getting their name and their JSX code
  const codeRegex =
    /export const (?<componentName>[^=\s]+)\s*=\s*\(\)\s*=>\s*{[\n\r\s]*return\s*\((?<patternCode>[\s\S]+?)\s*\);?/gm;

  const file = await fs.readFile(filepath, "utf8");

  const codePerVariant: Pattern["codePerVariant"] = {};
  let match: RegExpMatchArray | null = codeRegex.exec(file);

  while (match !== null) {
    const variant = match.groups?.componentName;
    const code = match.groups?.patternCode;

    if (variant !== undefined && code !== undefined) {
      codePerVariant[variant] = code;
    } else {
      throw new Error("Could not find the source code for the pattern", {
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

  const relativeFilepath = path.relative(pathToPatterns, filepath);
  const patternModule = PatternModule.parse(
    await import(
      `../../../patterns/${relativeFilepath.replace(
        path.extname(relativeFilepath),
        "",
      )}`
    ),
  );

  return {
    title: patternModule.title,
    component: patternModule.default as React.FC,
    codePerVariant,
  } satisfies Pattern;
};

export const getPatternsIn = async (name: string) => {
  const categoryDirpath = path.join(pathToPatterns, name);

  const patternFilenames = await fs.readdir(categoryDirpath);
  const patternFilepaths = patternFilenames.map((filename) =>
    path.join(categoryDirpath, filename),
  );

  return Promise.all(
    patternFilepaths.map((filepath) => getPatternAt(filepath)),
  );
};

