import { Writable } from 'node:stream';
import type {
  PipeableStream,
  ReactDOMServerReadableStream,
} from 'react-dom/server.browser';

export const readStream = async (
  stream: PipeableStream | ReactDOMServerReadableStream,
) => {
  let result = '';
  // Create a single TextDecoder instance to handle streaming properly
  // This fixes issues with multi-byte characters (e.g., CJK) being split across chunks
  const decoder = new TextDecoder('utf-8');

  if ('pipeTo' in stream) {
    // means it's a readable stream
    const writableStream = new WritableStream({
      write(chunk: BufferSource) {
        // Use stream: true to handle multi-byte characters split across chunks
        result += decoder.decode(chunk, { stream: true });
      },
      close() {
        // Flush any remaining bytes
        result += decoder.decode();
      },
    });
    await stream.pipeTo(writableStream);
  } else {
    const writable = new Writable({
      write(chunk: BufferSource, _encoding, callback) {
        // Use stream: true to handle multi-byte characters split across chunks
        result += decoder.decode(chunk, { stream: true });

        callback();
      },
      final(callback) {
        // Flush any remaining bytes
        result += decoder.decode();
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
