import tree from 'tree-node-cli';
import { Options } from '@react-email/render';

import { exportEmails } from '../utils/export-emails';
import { getAllEmails } from '../utils/get-all-emails';

/*
  This first builds all the templates using esbuild and then puts the output in the `.js`
  files. Then these `.js` files are imported dynamically and rendered to `.html` files
  using the `render` function.
 */
export const exportTemplates = async (
  outDir: string,
  srcDir: string,
  options: Options,
) => {
  const emails = await getAllEmails(srcDir);
  await exportEmails(emails, outDir, {
    html: options.plainText ? false : true,
    plainText: options.plainText,
    pretty: options.pretty,
  });

  const fileTree = tree(outDir, {
    allFiles: true,
    maxDepth: 4,
  });

  console.log(fileTree);

  process.exit();
};
