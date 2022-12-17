import { glob } from 'glob';
import esbuild from 'esbuild';
import { render } from '@react-email/render';
import { unlinkSync, writeFileSync } from 'fs';

/*
  This first builds all the templates using esbuild and then puts the output in the `.js`
  files. Then these `.js` files are imported dynamically and rendered to `.html` files
  using the `render` function.
 */
export const exportTemplates = async (outDir: string, pretty: boolean) => {
  const allTemplates = glob.sync('emails/*.{tsx,jsx}');
  esbuild.buildSync({
    bundle: true,
    entryPoints: allTemplates,
    platform: 'node',
    write: true,
    outdir: outDir,
  });

  const allBuiltTemplates = glob.sync(`${outDir}/*.js`, {
    absolute: true,
  });

  for (const template of allBuiltTemplates) {
    const component = await import(template);
    const rendered = render(component.default(), { pretty });
    const htmlPath = template.replace('.js', '.html');
    writeFileSync(htmlPath, rendered);
    unlinkSync(template);
  }
};
