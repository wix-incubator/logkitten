export type Platform = 'ios' | 'android';

export type Entry = {
  /** Timestamp in milliseconds */
  ts: number;
  /** Process ID */
  pid: number;
  /** Priority: 0 - unknown, 1 - debug, 2 - info, 3 - default, 4 - warning, 5 - error, 6 - fault */
  priority: number;
  /** Tag */
  tag?: string;
  /** App ID */
  appId?: string;
  /** Messages */
  messages: string[];
  /** Platform */
  platform: Platform;
  /** Process name */
  processName?: string;
  threadId?: number;
  subsystem?: string;
  category?: string;
};

export interface Parser {
  splitMessages(data: string): string[];
  parseMessages(messages: string[]): Entry[];
}

export type Filter = (entry: Entry) => boolean;
