import { glob } from 'glob';
import esbuild from 'esbuild';
import { render } from '@react-email/render';
import { unlinkSync, writeFileSync } from 'fs';

const outDir = 'out';

/*
  This first builds all the templates using esbuild and then puts the output in the `.js`
  files. Then these `.js` files are imported dynamically and rendered to `.html` files
  using the `render` function.
 */
export const build = async () => {
  const allTemplates = glob.sync('emails/*.tsx');
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
    const path = template.replace('.js', '');
    const component = await import(path);
    const rendered = render(component.default(), { pretty: true });
    writeFileSync(`${path}.html`, rendered);
    unlinkSync(template);
  }
};
