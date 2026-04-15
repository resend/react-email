import { spawn } from 'node:child_process';
import path from 'node:path';

const decoder = new TextDecoder();

export function runServerAndFetchPreviewPage(pathToCliScript: string) {
  return new Promise<void>((resolve, reject) => {
    const node = spawn('node', [pathToCliScript, 'dev'], {
      cwd: path.resolve(__dirname, '../../../../apps/demo'),
    });

    node.stdout.on('data', (data) => {
      const content = decoder.decode(data);
      if (content.includes('Running preview at')) {
        const url = /http:\/\/localhost:[\d]+/.exec(content)?.[0];
        if (url) {
          fetch(`${url}/preview/magic-links/notion-magic-link`)
            .then(async () => {
              node.kill();
              resolve();
            })
            .catch(() => {
              node.kill();
              reject();
            });
        } else {
          node.kill();
          reject(
            new Error(
              'URL was non existant in the same line, maybe we changed the way this is displayed?',
              {
                cause: { content, pathToCliScript },
              },
            ),
          );
        }
      }
    });
  });
}
