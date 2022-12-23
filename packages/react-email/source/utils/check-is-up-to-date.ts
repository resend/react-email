import { root } from '../_preview/root';
import { REACT_EMAIL_ROOT } from './constants';
import path from 'path';
import fs from 'fs';

export const checkPackageIsUpToDate = async (): Promise<boolean> => {
  try {
    const reactEmailPkg = await fs.promises.readFile(
      path.join(REACT_EMAIL_ROOT, 'package.json'),
      { encoding: 'utf8' },
    );
    const isUpToDate =
      JSON.parse(reactEmailPkg).version === getPreviewPkg().version;
    return isUpToDate;
  } catch (error) {
    throw new Error('Error checking if app is up-to-date');
  }
};

export const getPreviewPkg = () => {
  const [previewPkg] = root.filter((pkg) => pkg.title === 'package.json');
  return JSON.parse(previewPkg?.content || '');
};
