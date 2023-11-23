import fs from 'node:fs';
import path from 'node:path';
import readPackage from 'read-pkg';
import { CURRENT_PATH, PREVIEW_CLIENT_DIR } from './constants';

import { findWorkspaceDir } from '@pnpm/find-workspace-dir';
import { findWorkspacePackages } from '@pnpm/workspace.find-packages';

const mapUserWorkspaceDependencies = async (userDependencies: Record<string, string>) => {
  const resultingDependencies = { ...userDependencies };

  const projectRunningPreviewWorkspaceDirectory = await findWorkspaceDir(CURRENT_PATH);
  if (!projectRunningPreviewWorkspaceDirectory) {
    throw new Error(`Sync PKG error: Could not find workspace directory using @pnpm/find-workspace-dir for the CWD of this command call (i.e. "${CURRENT_PATH}")`);
  }
  console.log(projectRunningPreviewWorkspaceDirectory);

  const worksapceDependencies = await findWorkspacePackages(projectRunningPreviewWorkspaceDirectory);

  for (const dependencyProject of worksapceDependencies) {
    if (dependencyProject.manifest.name && dependencyProject.manifest.name in resultingDependencies) {
      resultingDependencies[dependencyProject.manifest.name] = `file:${dependencyProject.dir}`;
    }
  }

  const remainingWorkspaceDependencies = Object.keys(resultingDependencies)
    .filter(key => resultingDependencies[key]?.startsWith('workspace'));
  if (remainingWorkspaceDependencies.length > 0) {
    throw new Error(`Sync PKG error: could not resolve specific paths to map workspace dependencies into for dependencies:\n${remainingWorkspaceDependencies.map(dep => `- ${dep}`).join('\n')}`);
  }

  return resultingDependencies;
};

export const NON_NEGOTIABLE_PREVIEW_CLIENT_DEPENDENCIES = ['next', 'react'];

export const syncPkg = async () => {
  const clientPkg = await readPackage({ cwd: PREVIEW_CLIENT_DIR });
  const userPkg = await readPackage();

  const dependencies = {
    ...clientPkg.dependencies,
    ...await mapUserWorkspaceDependencies(userPkg.dependencies ?? {})
  };

  if (clientPkg.dependencies) {
    for (const dep of NON_NEGOTIABLE_PREVIEW_CLIENT_DEPENDENCIES) {
      if (typeof clientPkg.dependencies[dep] !== 'undefined') {
        dependencies[dep] = clientPkg.dependencies[dep]!;
      }
    }
  } else {
    throw new Error('Sync PKG Error: an unexpected error has happenned, this is mostly a safe guard than an actual error, but the dependencies on the preview client seems to not be defined, please create an issue on this');
  }

  const pkg = {
    ...clientPkg,
    dependencies,
  };
  await fs.promises.writeFile(
    path.join(PREVIEW_CLIENT_DIR, 'package.json'),
    JSON.stringify(pkg),
  );
};
