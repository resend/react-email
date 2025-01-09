import {
  PipeableStream,
  ReactDOMServerReadableStream,
} from 'react-dom/server.browser';

const decoder = new TextDecoder('utf-8');

export const readStream = async (
  stream: PipeableStream | ReactDOMServerReadableStream,
) => {
  const chunks: Uint8Array[] = [];

  if ('pipeTo' in stream) {
    // means it's a readable stream
    const writableStream = new WritableStream({
      write(chunk: Uint8Array) {
        chunks.push(chunk);
      },
    });
    await stream.pipeTo(writableStream);
  } else {
    throw new Error(
      'For some reason, the Node version of `react-dom/server` has been imported instead of the browser one.',
      {
        cause: {
          stream,
        },
      },
    );
  }

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
