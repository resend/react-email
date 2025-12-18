import { Writable } from 'node:stream';
import type { PipeableStream } from 'react-dom/server.browser';

export const readStream = async (stream: PipeableStream) => {
  let result = '';
  // Create a single TextDecoder instance to handle streaming properly
  // This fixes issues with multi-byte characters (e.g., CJK characters) being split across chunks
  const decoder = new TextDecoder('utf-8');

  const writable = new Writable({
    write(
      chunk: BufferSource,
      _encoding: BufferEncoding,
      callback: (error?: Error | null) => void,
    ) {
      // Use stream: true to handle multi-byte characters split across chunks
      result += decoder.decode(chunk, { stream: true });

      callback();
    },
    final(callback: (error?: Error | null) => void) {
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

  return result;
};
