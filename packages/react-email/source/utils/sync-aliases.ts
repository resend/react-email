import { REACT_EMAIL_ROOT } from './constants';
import * as fs from 'fs/promises';
import path from 'path';

export const syncAliases = async () => {
  const clientTsConfig = JSON.parse(
    (
      await fs.readFile(path.join(REACT_EMAIL_ROOT, 'tsconfig.json'))
    ).toString(),
  );
  const userTsConfig = JSON.parse(
    (await fs.readFile('tsconfig.json')).toString(),
  );

  let tsConfig = clientTsConfig;
  if (userTsConfig.compilerOptions.paths) {
    tsConfig.compilerOptions.paths = Object.entries<string[]>(
      userTsConfig.compilerOptions.paths,
    ).reduce((prev, [key, paths]) => {
      return {
        ...prev,
        [key]: paths.map(
          // this is required because the aliases are relative to the rootDir
          (p) =>
            path.join(`../`, userTsConfig.compilerOptions.baseUrl ?? '', p),
          //                                 the default baseUrl is just where the tsconfig is located
        ),
      };
    }, {});
  }

  await fs.writeFile(
    path.join(REACT_EMAIL_ROOT, 'tsconfig.json'),
    JSON.stringify(tsConfig),
  );
};
