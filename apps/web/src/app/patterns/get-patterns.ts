import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

export interface Pattern {
  title: string;
  tailwind: {
    code: string;
    component: React.FC;
  };
  inlineStyles: {
    code: string;
    component: React.FC;
  }
}

const PatternModule = z.object({
  title: z.string(),
  Tailwind: z.function(),
  InlineStyles: z.function()
});

// This function should be called when building
// as the patterns page should be SSG'ed, so the sure fire
// way to get the path to the actual `.tsx` patterns is
// by going with the CWD
const pathToPatterns = path.resolve(process.cwd(), "./patterns");

const getPatternAt = async (filepath: string) => {
  const inlineStylesCodeRegex =
    /(?<=export const InlineStyles = \(\) => {)[\s\S]*?(?<patternCode>{\/\* start pattern code \*\/}(?<patternCode>[\s\S]+?){\/\* end pattern code \*\/})/gm;
  const tailwindCodeRegex =
    /(?<=export const Tailwind = \(\) => {)[\s\S]*?(?<patternCode>{\/\* start pattern code \*\/}(?<patternCode>[\s\S]+?){\/\* end pattern code \*\/})/gm;

  const file = await fs.readFile(filepath, "utf8");

  const inlineStylesCode = inlineStylesCodeRegex
    .exec(file)
    ?.groups?.patternCode?.trim();
  const tailwindCode = tailwindCodeRegex
    .exec(file)
    ?.groups?.patternCode?.trim();
  if (tailwindCode === undefined || inlineStylesCode === undefined) {
    throw new Error(
      "Could not find the source code for the pattern. It needs a starting /* start pattern code */ and an ending /* end pattern code */ for the regex to properly match it.",
      {
        cause: {
          filepath,
          tailwindCode,
          inlineStylesCode
        },
      },
    );
  }

  const relativeFilepath = path.relative(pathToPatterns, filepath);
  const patternModule = PatternModule.parse(
    await import(
      `../../../patterns/${relativeFilepath.replace(path.extname(relativeFilepath), "")}`
    ),
  );

  return {
    title: patternModule.title,
    tailwind: {
      code: tailwindCode,
      component: patternModule.Tailwind as React.FC
    },
    inlineStyles: {
      code: inlineStylesCode,
      component: patternModule.InlineStyles as React.FC
    }
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
