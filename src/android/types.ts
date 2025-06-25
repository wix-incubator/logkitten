import type { Entry, Filter } from '../types';

// Android-specific log entry
export interface AndroidEntry extends Entry {
  tag: string;
  uid: string;
}

// Android-specific options
export interface AndroidOptions {
  adbPath?: string;
  deviceId?: string;
}

export interface AliasedAndroidOptions extends AndroidOptions {
  platform: 'android';
  filter?: Filter<AndroidEntry>;
}
