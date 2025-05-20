import path from 'node:path';
import url from 'node:url';
import { createJiti } from 'jiti';
import { addDevDependency } from 'nypm';
import prompts from 'prompts';

export const getPreviewServerLocation = async () => {
  const usersProject = createJiti(process.cwd());
  let previewServerLocation!: string;
  try {
    previewServerLocation = path.dirname(
      url.parse(usersProject.esmResolve('@react-email/preview-server'), true)
        .path!,
    );
  } catch (exception) {
    const response = await prompts({
      type: 'confirm',
      name: 'installPreviewServer',
      message:
        'To run the preview server, the pacakge "@react-email/preview-server" must be installed. Would you like to install it?',
      initial: true,
    });
    if (response.installPreviewServer) {
      console.log('Installing "@react-email/preview-server"');
      await addDevDependency('@react-email/preview-server');
      process.exit(0);
    } else {
      process.exit(0);
    }
  }
  return previewServerLocation;
};
