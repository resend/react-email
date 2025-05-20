import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const SYMBOLS = {
  BRANCH: '├── ',
  EMPTY: '',
  INDENT: '    ',
  LAST_BRANCH: '└── ',
  VERTICAL: '│   ',
};

const getTreeLines = async (
  dirPath: string,
  depth: number,
  currentDepth = 0,
) => {
  const base = process.cwd();
  const dirFullpath = path.resolve(base, dirPath);
  const dirname = path.basename(dirFullpath);
  let lines = [dirname];

  const dirStat = await fs.stat(dirFullpath);
  if (dirStat.isDirectory() && currentDepth < depth) {
    const childDirents = await fs.readdir(dirFullpath, { withFileTypes: true });

    childDirents.sort((a, b) => {
      // orders directories before files
      if (a.isDirectory() && b.isFile()) {
        return -1;
      }

      if (a.isFile() && b.isDirectory()) {
        return 1;
      }

      // orders by name because they are the same type
      // either directory & directory
      // or file & file
      return b.name > a.name ? -1 : 1;
    });

    for (let i = 0; i < childDirents.length; i++) {
      const dirent = childDirents[i]!;
      const isLast = i === childDirents.length - 1;

      const branchingSymbol = isLast ? SYMBOLS.LAST_BRANCH : SYMBOLS.BRANCH;
      const verticalSymbol = isLast ? SYMBOLS.INDENT : SYMBOLS.VERTICAL;

      if (dirent.isFile()) {
        lines.push(`${branchingSymbol}${dirent.name}`);
      } else {
        const pathToDirectory = path.join(dirFullpath, dirent.name);
        const treeLinesForSubDirectory = await getTreeLines(
          pathToDirectory,
          depth,
          currentDepth + 1,
        );
        lines = lines.concat(
          treeLinesForSubDirectory.map((line, index) =>
            index === 0
              ? `${branchingSymbol}${line}`
              : `${verticalSymbol}${line}`,
          ),
        );
      }
    }
  }

  return lines;
};

export const tree = async (dirPath: string, depth: number) => {
  const lines = await getTreeLines(dirPath, depth);
  return lines.join(os.EOL);
};
