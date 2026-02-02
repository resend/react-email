import path from 'node:path';
import url from 'node:url';
import { createJiti } from 'jiti';
import { addDevDependency } from 'nypm';
import prompts from 'prompts';
import { packageJson } from './packageJson.js';

const ensurePreviewServerInstalled = async (
  message: string,
): Promise<never> => {
  const response = await prompts({
    type: 'confirm',
    name: 'installPreviewServer',
    message,
    initial: true,
  });
  if (response.installPreviewServer) {
    console.log('Installing "@react-email/preview-server"');
    await addDevDependency(
      `@react-email/preview-server@${packageJson.version}`,
    );
    process.exit(0);
  } else {
    process.exit(0);
  }
};

export const getPreviewServerLocation = async () => {
  const usersProject = createJiti(process.cwd());
  let previewServerLocation!: string;
  try {
    previewServerLocation = path.dirname(
      url.fileURLToPath(usersProject.esmResolve('@react-email/preview-server')),
    );
  } catch (_exception) {
    await ensurePreviewServerInstalled(
      'To run the preview server, the package "@react-email/preview-server" must be installed. Would you like to install it?',
    );
  }
  const { version } = await usersProject.import<{
    version: string;
  }>('@react-email/preview-server');
  if (version !== packageJson.version) {
    await ensurePreviewServerInstalled(
      `To run the preview server, the version of "@react-email/preview-server" must match the version of "react-email" (${packageJson.version}). Would you like to install it?`,
    );
  }

  return previewServerLocation;
};
