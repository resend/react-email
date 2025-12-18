import { readStream } from './read-stream.browser';

export function renderToReadableStream(
  node: React.ReactNode,
  reactDomServer: typeof import('react-dom/server'),
) {
  return new Promise<string>((resolve, reject) => {
    return reactDomServer
      .renderToReadableStream(node, {
        onError(error: unknown) {
          reject(error);
        },
        progressiveChunkSize: Number.POSITIVE_INFINITY,
      })
      .then(readStream)
      .then(resolve)
      .catch(reject);
  });
}
