import type { Entry, Filter } from '../types';

// iOS-specific log entry
export interface IosEntry extends Entry {
  category: string;
  formatString: string;
  processImagePath: string;
  subsystem: string;
  userID: number;
}

// iOS-specific options
export interface IosOptions {
  deviceId?: string;
}

export interface AliasedIosOptions extends IosOptions {
  platform: 'ios';
  filter?: Filter<IosEntry>;
}

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
