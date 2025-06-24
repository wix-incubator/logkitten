import { Parser, Entry } from '../types';
import { PriorityUtils } from './constants';

export interface RawEntryIOS {
  timezoneName: string;
  messageType: string;
  eventType: string;
  source: any;
  formatString: string;
  userID: number;
  activityIdentifier: number;
  subsystem: string;
  category: string;
  threadID: number;
  senderImageUUID: string;
  backtrace: RawEntryIOS$Backtrace;
  bootUUID: string;
  processImagePath: string;
  senderImagePath: string;
  timestamp: string;
  machTimestamp: number;
  eventMessage: string;
  processImageUUID: string;
  traceID: number;
  processID: number;
  senderProgramCounter: number;
  parentActivityIdentifier: number;
}

export interface RawEntryIOS$Backtrace {
  frames: RawEntryIOS$Frame[];
}

export interface RawEntryIOS$Frame {
  imageOffset: number;
  imageUUID: string;
}

export default class IosParser implements Parser {
  splitMessages(raw: string): string[] {
    // Each line is a JSON object
    return raw.split(/\r?\n/).filter(Boolean);
  }

  parseMessages(messages: string[]): Entry[] {
    const entries: Entry[] = [];

    for (const line of messages) {
      let rawEntry: RawEntryIOS;
      try {
        rawEntry = JSON.parse(line);
      } catch (e) {
        continue;
      }

      const entry = {
        platform: 'ios' as import('../types').Platform,
        ts: Date.parse(rawEntry.timestamp),
        pid: rawEntry.processID,
        priority: PriorityUtils.fromName(rawEntry.messageType),
        tag: rawEntry.subsystem || undefined,
        messages: [rawEntry.eventMessage],
        processName: rawEntry.processImagePath
          ? rawEntry.processImagePath.split('/').pop() || undefined
          : undefined,
        threadId: rawEntry.threadID,
        subsystem: rawEntry.subsystem,
        category: rawEntry.category,
      };

      entries.push(entry);
    }

    return entries;
  }
}
