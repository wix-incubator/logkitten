import { Parser, Entry } from '../types';
import { Priority } from './constants';

export default class AndroidParser implements Parser {
  static timeRegex: RegExp = /(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2}).\d{3}/m;
  static headerRegex: RegExp = /^\s*(\w)\/(.+)\(([\s\d]+)\):/;

  #year: number;
  #lastMonth: number | undefined;

  constructor(baseYear?: number) {
    this.#year = baseYear || new Date().getFullYear();
    this.#lastMonth = undefined;
  }

  splitMessages(raw: string): string[] {
    const messages: string[] = [];
    let data = raw.toString();
    let match = data.match(AndroidParser.timeRegex);
    while (match) {
      const timeHeader = match[0];
      data = data.slice((match.index || 0) + timeHeader.length);
      const nextMatch = data.match(AndroidParser.timeRegex);
      const body = nextMatch ? data.slice(0, nextMatch.index) : data;
      messages.push(`${timeHeader} ${body}`);
      match = nextMatch;
    }
    return messages;
  }

  parseMessages(messages: string[]): Entry[] {
    return messages
      .map((rawMessage: string): Entry => {
        const timeMatch = rawMessage.match(AndroidParser.timeRegex);
        if (!timeMatch) {
          throw new Error(
            `Time regex was not matched in message: ${rawMessage}`
          );
        }

        const headerMatch = rawMessage
          .slice(timeMatch[0].length)
          .match(AndroidParser.headerRegex) || ['', 'U', 'unknown', '-1'];

        const [, priority, tag, pid] = headerMatch;

        const month = parseInt(timeMatch[1], 10) - 1;
        const day = parseInt(timeMatch[2], 10);
        const hour = parseInt(timeMatch[3], 10);
        const minute = parseInt(timeMatch[4], 10);
        const second = parseInt(timeMatch[5], 10);

        if (this.#lastMonth !== undefined && month < this.#lastMonth) {
          this.#year++;
        }
        this.#lastMonth = month;

        const date = Date.UTC(this.#year, month, day, hour, minute, second, 0);

        return {
          platform: 'android',
          ts: date,
          pid: parseInt(pid.trim(), 10) || 0,
          priority: Priority.fromLetter(priority),
          tag: tag.trim() || 'unknown',
          messages: [
            rawMessage
              .slice(timeMatch[0].length + headerMatch[0].length)
              .trim(),
          ],
        };
      })
      .reduce((acc: Entry[], entry: Entry) => {
        if (
          acc.length > 0 &&
          acc[acc.length - 1].ts === entry.ts &&
          acc[acc.length - 1].tag === entry.tag &&
          acc[acc.length - 1].pid === entry.pid &&
          acc[acc.length - 1].priority === entry.priority
        ) {
          acc[acc.length - 1].messages.push(...entry.messages);
          return acc;
        }

        return [...acc, entry];
      }, []);
  }
}
