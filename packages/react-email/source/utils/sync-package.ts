import fs from 'node:fs';
import path from 'node:path';
import readPackage from 'read-pkg';
import { PREVIEW_CLIENT_DIR } from './constants';

export const syncPkg = async () => {
  const clientPkg = await readPackage({ cwd: PREVIEW_CLIENT_DIR });
  const userPkg = await readPackage();
  const pkg = {
    ...clientPkg,
    dependencies: {
      ...clientPkg.dependencies,
      ...userPkg.dependencies,
    },
  };
  await fs.promises.writeFile(
    path.join(PREVIEW_CLIENT_DIR, 'package.json'),
    JSON.stringify(pkg),
  );
};
