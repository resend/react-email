import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

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
  default: z.function()
});

// This function should be called when building
// as the patterns page should be SSG'ed, so the sure fire
// way to get the path to the actual `.tsx` patterns is
// by going with the CWD
const pathToPatterns = path.resolve(process.cwd(), "./patterns");

const getPatternAt = async (filepath: string) => {
  const codeRegex =
    /(?<=export const (?<componentName>[^=\s]+) = \(\) => {)[\s\S]*?{\/\* start pattern code \*\/}(?<patternCode>[\s\S]+?){\/\* end pattern code \*\/}/gm;

  const file = await fs.readFile(filepath, "utf8");

  const codePerVariant: Pattern["codePerVariant"] = {};
  let match: RegExpMatchArray | null = null;
  while ((match = codeRegex.exec(file)) !== null) {
    const variant = match.groups?.componentName;
    const code = match.groups?.patternCode;
    if (variant !== undefined && code !== undefined) {
      codePerVariant[variant] = code;
    } else {
      throw new Error(
        "Could not find the source code for the pattern. It needs a starting /* start pattern code */ and an ending /* end pattern code */ for the regex to properly match it.",
        {
          cause: {
            filepath,
            code,
            variant,
            match,
          },
        },
      );
    }
  }

  const relativeFilepath = path.relative(pathToPatterns, filepath);
  const patternModule = PatternModule.parse(
    await import(
      `../../../patterns/${relativeFilepath.replace(path.extname(relativeFilepath), "")}`
    ),
  );

  return {
    title: patternModule.title,
    component: patternModule.default as React.FC,
    codePerVariant
  } satisfies Pattern;
};

const getPatternsIn = async (categoryDirpath: string) => {
  const patternFilenames = await fs.readdir(categoryDirpath);
  const patternFilepaths = patternFilenames.map((filename) =>
    path.join(categoryDirpath, filename),
  );

  return Promise.all(
    patternFilepaths.map((filepath) => getPatternAt(filepath)),
  );
};

export const getPatterns = async () => {
  const patterns: Record<string, Pattern[]> = {};

  const categoryDirnames = await fs.readdir(pathToPatterns);
  for await (const categoryDirname of categoryDirnames) {
    if (
      categoryDirname === "_components" ||
      categoryDirname === "static" ||
      categoryDirname === "tailwind.config.ts"
    )
      continue;

    const categoryDirpath = path.join(pathToPatterns, categoryDirname);
    patterns[categoryDirname] = await getPatternsIn(categoryDirpath);
  }

  return patterns;
};
