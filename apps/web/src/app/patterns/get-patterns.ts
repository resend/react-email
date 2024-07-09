import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

export interface Pattern {
  title: string;
  code: string;
  /**
   * @example
   * This should be used directly the same you would use
   * the children prop.
   *
   * ```jsx
   * <div>{pattern.element}</div>
   * ```
   */
  element: React.ReactNode;
}

const PatternModule = z.object({
  title: z.string(),
  default: z.record(z.string(), z.any()),
});

// This function should be called when building
// as the patterns page should be SSG'ed, so the sure fire
// way to get the path to the actual `.tsx` patterns is
// by going with the CWD
const pathToPatterns = path.resolve(process.cwd(), "./testing-emails/patterns");

const getPatternAt = async (filepath: string) => {
  const patternCodeRegex =
    /\/\* start pattern code \*\/(?<patternCode>[\s\S]+?)\/\* end pattern code \*\//gm;
  const code = patternCodeRegex.exec(await fs.readFile(filepath, "utf8"))
    ?.groups?.patternCode?.trim();
  if (code === undefined) {
    throw new Error('Could not find the source code for the pattern. It needs a starting /* start pattern code */ and an ending /* end pattern code */ for the regex to properly match it.', {
      cause: {
        filepath,
      }
    });
  }

  const relativeFilepath = path.relative(pathToPatterns, filepath);
  const patternModule = PatternModule.parse(
    await import(
      `../../../testing-emails/patterns/${relativeFilepath.replace(path.extname(relativeFilepath), "")}`
    ),
  );

  return {
    title: patternModule.title,
    code,
    element: patternModule.default as React.ReactNode,
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
    const categoryDirpath = path.join(pathToPatterns, categoryDirname);
    patterns[categoryDirname] = await getPatternsIn(categoryDirpath);
  }

  return patterns;
};
