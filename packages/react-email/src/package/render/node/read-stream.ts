import { Writable } from 'node:stream';
import {
  PipeableStream,
  ReactDOMServerReadableStream,
} from 'react-dom/server.browser';

const decoder = new TextDecoder('utf-8');

export const readStream = async (
  stream: PipeableStream | ReactDOMServerReadableStream,
) => {
  let result = '';

  if ('pipeTo' in stream) {
    // means it's a readable stream
    const writableStream = new WritableStream({
      write(chunk: BufferSource) {
        result += decoder.decode(chunk);
      },
    });
    await stream.pipeTo(writableStream);
  } else {
    const writable = new Writable({
      write(chunk: BufferSource, _encoding, callback) {
        result += decoder.decode(chunk);

        callback();
      },
    });
    stream.pipe(writable);

    await new Promise<void>((resolve, reject) => {
      writable.on('error', reject);
      writable.on('close', () => {
        resolve();
      });
    });
  }

  return result;
};
