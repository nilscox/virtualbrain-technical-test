/**
 * Read a stream until it ends, calling `onChunk` with each chunk
 */
export async function readStream<T>(stream: ReadableStream<T>, onChunk: (chunk: T) => void): Promise<void> {
  const reader = stream.getReader();

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      return;
    }

    onChunk(value);
  }
}
