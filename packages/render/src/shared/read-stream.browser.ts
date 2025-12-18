import type { ReactDOMServerReadableStream } from 'react-dom/server.browser';

export const readStream = async (stream: ReactDOMServerReadableStream) => {
  let result = '';
  // Create a single TextDecoder instance to handle streaming properly
  // This fixes issues with multi-byte characters (e.g., CJK) being split across chunks
  const decoder = new TextDecoder('utf-8');

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

  return result;
};
