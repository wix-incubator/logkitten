export class Chunker {
  private chunks: string[];

  constructor(input: string, chunkCount: number = 3) {
    this.chunks = Chunker.splitIntoChunks(input, chunkCount);
  }

  static splitIntoChunks(input: string, chunkCount: number): string[] {
    if (chunkCount <= 1) return [input];
    const chunkSize = Math.ceil(input.length / chunkCount);
    const chunks: string[] = [];
    for (let i = 0; i < input.length; i += chunkSize) {
      chunks.push(input.slice(i, i + chunkSize));
    }
    return chunks;
  }

  getChunks(): string[] {
    return this.chunks;
  }
}
