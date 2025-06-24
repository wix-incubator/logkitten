import { Parser, Entry } from '../types';
import { Priority } from './constants';

export default class AndroidParser implements Parser {
  static timeRegex: RegExp = /(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).\d{3}/m;
  static headerRegex: RegExp = /^\s*(\w)\/(.+)\(([\s\d]+)\):/;
  static epochRegex: RegExp = /^(\d+\.\d+)\s+(\d+)\s+(\d+)\s+(\w)\s+(.+?)\s*:\s(.*)$/m;

  #year: number;
  #lastMonth: number | undefined;

  constructor(baseYear?: number) {
    this.#year = baseYear || new Date().getFullYear();
    this.#lastMonth = undefined;
  }

  splitMessages(raw: string): string[] {
    // For epoch format, each log entry is a single line
    return raw.toString().split(/\r?\n/).filter(Boolean);
  }

  parseMessages(messages: string[]): Entry[] {
    return messages
      .map((rawMessage: string): Entry => {
        const match = rawMessage.match(AndroidParser.epochRegex);
        if (!match) {
          throw new Error(
            `Epoch regex was not matched in message: ${rawMessage}`
          );
        }
        const [, epoch, pid, tid, priority, tag, message] = match;
        return {
          platform: 'android',
          ts: Math.floor(parseFloat(epoch) * 1000),
          pid: Number.parseInt(pid, 10),
          threadId: Number.parseInt(tid, 10),
          priority: Priority.fromLetter(priority),
          tag: tag.trim() || 'unknown',
          messages: [message.trim()],
        };
      })
      .reduce((acc: Entry[], entry: Entry) => {
        if (
          acc.length > 0 &&
          acc[acc.length - 1].ts === entry.ts &&
          acc[acc.length - 1].tag === entry.tag &&
          acc[acc.length - 1].pid === entry.pid &&
          acc[acc.length - 1].priority === entry.priority &&
          acc[acc.length - 1].threadId === entry.threadId
        ) {
          acc[acc.length - 1].messages.push(...entry.messages);
          return acc;
        }
        return [...acc, entry];
      }, []);
  }
}
