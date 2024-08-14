import path from "node:path";
import { promises as fs } from "node:fs";

// This function should be called when building
// as the patterns page should be SSG'ed, so the sure fire
// way to get the path to the actual `.tsx` patterns is
// by going with the CWD
export const pathToPatterns = path.resolve(process.cwd(), "./patterns");

export interface Category {
  name: string;
  componentsCount: number;
}

export const getCategories = async (): Promise<Category[]> => {
  const categoryDirnames = await fs.readdir(pathToPatterns);
  const categoryPromises = categoryDirnames
    .filter(
      (dirname) =>
        !["_components", "static", "tailwind.config.ts"].includes(dirname),
    )
    .map(async (categoryDirname) => {
      const categoryDirpath = path.join(pathToPatterns, categoryDirname);
      const patternFilenames = await fs.readdir(categoryDirpath);

      return {
        name: categoryDirname,
        componentsCount: patternFilenames.length,
      };
    });

  return Promise.all(categoryPromises);
};
