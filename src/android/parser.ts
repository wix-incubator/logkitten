import { Parser } from '../types';
import { LineBuffer } from '../utils';
import { AndroidEntry } from './types';
import { areEntriesComingFromTheSameSource, PriorityUtils } from './utils';

export class AndroidParser {
  private _buffer = new LineBuffer();
  // In fact, this is: [] | [AndroidEntry]
  private _pendingEntry: AndroidEntry[] = [];

  private static readonly logcatRegex: RegExp =
    //   epoch        uid     pid     tid     level   tag     message
    /^\s*(\d+\.\d+)\s+(\S+)\s+(\d+)\s+(\d+)\s+(\w)\s+(.+?)\s*:\s*(.*)$/m;

  static create(): Parser<AndroidEntry> {
    const parser = new AndroidParser();
    return parser.parse.bind(parser);
  }

  parse(raw: string | Buffer, stderr: boolean): AndroidEntry[] {
    if (stderr) {
      return [];
    }

    const str = typeof raw === 'string' ? raw : raw.toString('utf-8');
    const lines = this._buffer.processChunk(str);
    return this._parseMessages(lines);
  }

  private _parseMessages(messages: string[]): AndroidEntry[] {
    const newEntries = messages.map(
      (rawMessage: string): AndroidEntry | null => {
        const match = rawMessage.match(AndroidParser.logcatRegex);
        if (match) {
          const [, epoch, uid, pid, tid, level, tag, message] = match;

          return {
            ts: Math.floor(parseFloat(epoch) * 1000),
            pid: Number.parseInt(pid, 10),
            tid: Number.parseInt(tid, 10),
            level: PriorityUtils.fromLetter(level),
            tag: tag.trim() || 'unknown',
            msg: message.trim(),
            uid,
          };
        }

        return null;
      }
    );

    const result = newEntries.reduce((acc, entry) => {
      if (!entry) {
        return acc;
      }

      const last = acc.at(-1);
      if (last && areEntriesComingFromTheSameSource(last, entry)) {
        last.msg += '\n' + entry.msg;
        return acc;
      }

      acc.push(entry);

      return acc;
    }, this._pendingEntry);

    this._pendingEntry = result.splice(-1);
    return result;
  }
}
