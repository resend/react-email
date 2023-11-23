import fs from 'node:fs';
import shell from 'shelljs';
import { downloadClient, PREVIEW_CLIENT_DIR } from '../utils';
import { setupServer } from '../utils/run-server';

interface BuildPreviewArgs {
  dir: string;
}

export const buildPreview = async ({ dir }: BuildPreviewArgs) => {
  try {
    if (fs.existsSync(PREVIEW_CLIENT_DIR)) {
      await setupServer('build', dir, '');
      return;
    }

    await downloadClient();

    await setupServer('build', dir, '');
  } catch (error) {
    console.log(error);
    shell.exit(1);
  }
};

interface StartPreviewArgs {
  port: string;
}

export const startPreview = async ({ port }: StartPreviewArgs) => {
  try {
    if (fs.existsSync(PREVIEW_CLIENT_DIR)) {
      await setupServer('start', '', port);
      return;
    }

    await downloadClient();

    await setupServer('start', '', port);
  } catch (error) {
    console.log(error);
    shell.exit(1);
  }
};
