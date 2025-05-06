export async function* loadStream<T>(stream: ReadableStream<T>) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
