import { LineBuffer } from '../utils';
import { Parser } from '../types';
import type { IosEntry, RawEntryIOS } from './types';
import { PriorityUtils } from './utils';

const IGNORED_STDERR_PATTERN = /\bgetpwuid_r\b/;

export class IosParser {
  private _buffer = new LineBuffer();

  constructor() {
    this.parse = this.parse.bind(this);
  }

  static create(): Parser<IosEntry> {
    const parser = new IosParser();
    return parser.parse.bind(parser);
  }

  parse(raw: string | Buffer, stderr: boolean): IosEntry[] {
    const str = typeof raw === 'string' ? raw : raw.toString('utf-8');
    const lines = this._buffer.processChunk(str);
    return lines.flatMap((line) => this._parseLine(line, stderr));
  }

  private _parseLine(line: string, stderr: boolean): IosEntry[] {
    if (stderr) {
      return this._parseStderr(line);
    }

    let rawEntry: RawEntryIOS;
    try {
      rawEntry = JSON.parse(line);
    } catch {
      return [];
    }

    const entry: IosEntry = {
      msg: rawEntry.eventMessage || '',
      ts: Date.parse(rawEntry.timestamp),
      pid: rawEntry.processID,
      tid: rawEntry.threadID,
      level: PriorityUtils.fromName(rawEntry.messageType),
      // Platform specific fields
      category: rawEntry.category || '',
      formatString: rawEntry.formatString || '',
      processImagePath: rawEntry.processImagePath || '',
      subsystem: rawEntry.subsystem || '',
      userID: rawEntry.userID,
    };

    return [entry];
  }

  private _parseStderr(line: string): IosEntry[] {
    if (line.includes('No devices are booted.')) {
      throw new Error('No simulators are booted.');
    }

    if (IGNORED_STDERR_PATTERN.test(line)) {
      return [];
    }

    throw new Error(line);
  }
}
