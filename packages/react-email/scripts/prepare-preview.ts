import fs from 'fs';
import path from 'path';

const preparePreview = async () => {
  Promise.all([
    prepareRoot(),
    prepareComponents(),
    prepareStyles(),
    prepareUtils(),
    preparePages(),
  ]);
};

const prepareRoot = async () => {
  try {
    const rootFiles = await fs.promises.readdir(path.join('preview'));
    const files = rootFiles
      .filter(
        (file) => !['.next', 'yarn.lock', 'src', 'node_modules'].includes(file),
      )
      .map(async (rootFile) => {
        return {
          title: rootFile,
          content: await fs.promises.readFile(path.join('preview', rootFile), {
            encoding: 'utf-8',
          }),
        };
      });

    const componentFiles = await Promise.all(files);
    const data = `export const root = ${JSON.stringify(componentFiles)}`;

    await fs.promises.writeFile(
      path.join('source', '_preview', 'root.ts'),
      data,
    );
  } catch (error) {
    console.error({ error });
  }
};

const prepareComponents = async () => {
  try {
    const components = await fs.promises.readdir(
      path.join('preview', 'src', 'components'),
    );

    const files = components.map(async (component) => {
      return {
        title: component,
        content: await fs.promises.readFile(
          path.join('preview', 'src', 'components', component),
          { encoding: 'utf-8' },
        ),
      };
    });

    const componentFiles = await Promise.all(files);
    const data = `export const components = ${JSON.stringify(componentFiles)}`;

    await fs.promises.writeFile(
      path.join('source', '_preview', 'components.ts'),
      data,
    );
  } catch (error) {
    console.error({ error });
  }
};

const prepareStyles = async () => {
  try {
    const styles = await fs.promises.readdir(
      path.join('preview', 'src', 'styles'),
    );

    const files = styles.map(async (style) => {
      return {
        title: style,
        content: await fs.promises.readFile(
          path.join('preview', 'src', 'styles', style),
          { encoding: 'utf-8' },
        ),
      };
    });

    const styleFiles = await Promise.all(files);
    const data = `export const styles = ${JSON.stringify(styleFiles)}`;

    await fs.promises.writeFile(
      path.join('source', '_preview', 'styles.ts'),
      data,
    );
  } catch (error) {
    console.error({ error });
  }
};

const prepareUtils = async () => {
  try {
    const utils = await fs.promises.readdir(
      path.join('preview', 'src', 'utils'),
    );

    const files = utils.map(async (util) => {
      return {
        title: util,
        content: await fs.promises.readFile(
          path.join('preview', 'src', 'utils', util),
          { encoding: 'utf-8' },
        ),
      };
    });

    const utilFiles = await Promise.all(files);
    const data = `export const utils = ${JSON.stringify(utilFiles)}`;

    await fs.promises.writeFile(
      path.join('source', '_preview', 'utils.ts'),
      data,
    );
  } catch (error) {
    console.error({ error });
  }
};

const preparePages = async () => {
  try {
    const pages = await fs.promises.readdir(
      path.join('preview', 'src', 'pages'),
    );

    const pageFiles = pages.map(async (page) => {
      const isDirectory =
        fs.existsSync(page) && fs.lstatSync(page).isDirectory();

      if (isDirectory) {
        const pFiles = await fs.promises.readdir(
          path.join('preview', 'src', 'pages', page),
        );

        const files = pFiles.map(async (file) => {
          return {
            dir: page,
            title: file,
            content: await fs.promises.readFile(
              path.join('preview', 'src', 'pages', page, file),
              { encoding: 'utf-8' },
            ),
          };
        });

        const [f] = await Promise.all(files);

        return f;
      }

      return {
        title: page,
        content: await fs.promises.readFile(
          path.join('preview', 'src', 'pages', page),
          { encoding: 'utf-8' },
        ),
      };
    });

    const allPages = await Promise.all(pageFiles);
    const data = `export const pages = ${JSON.stringify(allPages)}`;

    await fs.promises.writeFile(
      path.join('source', '_preview', 'pages.ts'),
      data,
    );
  } catch (error) {
    console.error({ error });
  }
};

preparePreview();
