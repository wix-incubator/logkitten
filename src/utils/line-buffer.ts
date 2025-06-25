/**
 * LineBuffer handles streaming data that may arrive in chunks that split mid-line.
 * It buffers incomplete lines until a newline is received.
 */
export class LineBuffer {
  private buffer: string = '';

  /**
   * Process a chunk of data and return complete lines
   * @param chunk - The incoming data chunk
   * @returns Array of complete lines
   */
  processChunk(chunk: string | Buffer): string[] {
    const data = chunk.toString();
    this.buffer += data;

    const lines = this.buffer.split(/\r?\n/);

    // Keep the last line in buffer (might be incomplete)
    this.buffer = lines.pop() || '';

    // Return complete lines, filtering out empty ones
    return lines.filter(Boolean);
  }

  /**
   * Get any remaining buffered content (call when stream ends)
   * @returns The remaining buffered content or empty string
   */
  flush(): string {
    const remaining = this.buffer;
    this.buffer = '';
    return remaining;
  }

  /**
   * Clear the buffer
   */
  clear(): void {
    this.buffer = '';
  }
}
