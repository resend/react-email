import { readStream } from './read-stream.browser';

describe('readStream() for the browser', () => {
  it('handles multi-byte characters with ReadableStream', async () => {
    const japaneseText = 'バクラクのメールテンプレートでスケジュール確認';
    const buffer = Buffer.from(japaneseText, 'utf-8');

    // Split at a position that breaks a character
    const splitPosition = buffer.indexOf(Buffer.from('スケジュール')) + 2;
    const chunk1 = buffer.subarray(0, splitPosition);
    const chunk2 = buffer.subarray(splitPosition);

    // Mock a ReactDOMServerReadableStream
    const chunks = [chunk1, chunk2];

    const mockReadableStream = {
      pipeTo: async (writable: WritableStream) => {
        const writer = writable.getWriter();

        for (const chunk of chunks) {
          await writer.write(chunk);
        }

        await writer.close();
      },
    };

    const result = await readStream(mockReadableStream as any);

    expect(result).toBe(japaneseText);
    expect(result).not.toContain('\0');
    expect(result).toContain('スケジュール');
  });
});
