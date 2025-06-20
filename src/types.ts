import { Dayjs } from 'dayjs';

export type Platform = 'ios' | 'android';

export type Entry = {
  date: Dayjs;
  pid: number;
  priority: number;
  tag?: string;
  appId?: string;
  messages: string[];
  platform: Platform;
};

export interface Parser {
  splitMessages(data: string): string[];
  parseMessages(messages: string[]): Entry[];
}

export type Filter = (entry: Entry) => boolean;
