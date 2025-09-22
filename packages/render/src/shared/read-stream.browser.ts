import type { ReactDOMServerReadableStream } from 'react-dom/server.browser';

const decoder = new TextDecoder('utf-8');

export const readStream = async (stream: ReactDOMServerReadableStream) => {
  const chunks: Uint8Array[] = [];

  const writableStream = new WritableStream({
    write(chunk: Uint8Array) {
      chunks.push(chunk);
    },
    abort(reason) {
      throw new Error('Stream aborted', {
        cause: {
          reason,
        },
      });
    },
  });
  await stream.pipeTo(writableStream);

  let length = 0;
  chunks.forEach((item) => {
    length += item.length;
  });
  const mergedChunks = new Uint8Array(length);
  let offset = 0;
  chunks.forEach((item) => {
    mergedChunks.set(item, offset);
    offset += item.length;
  });

  return decoder.decode(mergedChunks);
};
