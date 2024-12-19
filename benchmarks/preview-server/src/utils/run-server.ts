import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import path from 'node:path';

const decoder = new TextDecoder();

export interface Server {
  subprocess: ChildProcessWithoutNullStreams;
  url: string;
}

export function runServer(pathToCliScript: string) {
  return new Promise<Server>((resolve, reject) => {
    const node = spawn('node', [pathToCliScript, 'dev'], {
      cwd: path.resolve(__dirname, '../../../../apps/demo'),
    });

    node.stdout.on('data', (data) => {
      const content = decoder.decode(data);
      if (content.includes('Running preview at')) {
        const url = /http:\/\/localhost:[\d]+/.exec(content)?.[0];
        if (url) {
          resolve({
            subprocess: node,
            url,
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
