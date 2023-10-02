import fs from 'node:fs';
import path from 'node:path';
import readPackage from 'read-pkg';
import { REACT_EMAIL_ROOT } from './constants';

export const syncPkg = async () => {
  const clientPkg = await readPackage({ cwd: REACT_EMAIL_ROOT });
  const userPkg = await readPackage();
  const pkg = {
    ...clientPkg,
    dependencies: {
      ...clientPkg.dependencies,
      ...userPkg.dependencies,
    },
  };
  await fs.promises.writeFile(
    path.join(REACT_EMAIL_ROOT, 'package.json'),
    JSON.stringify(pkg),
  );
};
