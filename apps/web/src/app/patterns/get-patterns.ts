import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";

export interface Pattern {
  title: string;
  code: string;
  component: React.FC;
}

const PatternModule = z.object({
  title: z.string(),
  default: z.function(),
});

// This function should be called when building
// as the patterns page should be SSG'ed, so the sure fire
// way to get the path to the actual `.tsx` patterns is
// by going with the CWD
const pathToPatterns = path.resolve(process.cwd(), "./src/components/patterns");

const getPatternAt = async (filepath: string) => {
  const code = await fs.readFile(filepath, "utf8");
  const relativeFilepath = path.relative(pathToPatterns, filepath);
  const patternModule = PatternModule.parse(
    await import(
      `../../components/patterns/${relativeFilepath.replace(path.extname(relativeFilepath), "")}`
    ),
  );

  return {
    title: patternModule.title,
    code,
    component: patternModule.default as React.FC,
  } satisfies Pattern;
};

export const getPatternsFor = async (
  category: "headers",
): Promise<Pattern[]> => {
  const directoryPath = path.resolve(pathToPatterns, category);
  const patternFilenames = await fs.readdir(directoryPath);
  const patternFilepaths = patternFilenames.map((filename) =>
    path.join(directoryPath, filename),
  );

  return Promise.all(
    patternFilepaths.map((filepath) => getPatternAt(filepath)),
  );
};
