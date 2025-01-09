import fs from 'node:fs/promises';
import path from 'node:path';

export async function adjustPackageIndex() {
  const distFiles = await fs.readdir(path.resolve(process.cwd(), 'dist'));
  const indexFiles = distFiles.filter((file) => file.startsWith('index'));

  for await (const file of indexFiles) {
    const extension = path.extname(file);

    if (extension === '.js' || extension === '.mjs') {
      const pathToFile = path.resolve(process.cwd(), 'dist', file);
      const originalContents = await fs.readFile(pathToFile, 'utf8');

      await fs.writeFile(
        pathToFile,
        originalContents.replaceAll(
          /"(?<componentPath>\.\/[^"]+)"/g,
          (value, componentPath: string) => {
            if (componentPath.startsWith('./render')) {
              const newComponentPath = componentPath
                .replace('/browser', '.browser')
                .replace('/node', '.node');
              return value.replace(
                componentPath,
                `${newComponentPath}${extension}`,
              );
            }
            return value.replace(componentPath, `${componentPath}${extension}`);
          },
        ),
        'utf8',
      );
    }
  }
}
