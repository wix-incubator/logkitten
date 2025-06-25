import type { ChildProcess } from 'child_process';
import type { EventEmitter } from 'events';

// Core log entry interface
export interface Entry {
  /** Message content */
  msg: string;
  /** Timestamp in milliseconds */
  ts: number;
  /** Process ID */
  pid: number;
  /** Thread ID */
  tid: number;
  /** Priority/log level */
  level: number;
}

export type Runner<O> = (options: O) => ChildProcess;

export type Parser<E extends Entry = Entry> = (
  message: string | Buffer,
  stderr: boolean
) => E[];

export type Filter<E extends Entry = Entry> = (entry: E) => boolean;

export interface PlatformDriver<E extends Entry = Entry> {
  name: string;
  process: ChildProcess;
  parse: Parser<E>;
  filter?: Filter<E>;
}

export type PlatformFactory<
  E extends Entry = Entry,
  O extends Record<string, any> = any
> = (options: O) => PlatformDriver<E>;

// Base options interface
export interface Options<E extends Entry = Entry> {
  platform: PlatformFactory<E>;
  filter?: Filter<E>;
}

export interface Emitter<E extends Entry = Entry> extends EventEmitter {
  // Specific overloads for our known events
  on(event: 'entry', listener: (entry: E) => void): this;
  on(event: 'error', listener: (error: Error) => void): this;
  on(event: 'close', listener: () => void): this;
  // Generic overload for any other events (compatible with EventEmitter)
  on(event: string | symbol, listener: (...args: any[]) => void): this;

  emit(event: 'entry', entry: E): boolean;
  emit(event: 'error', error: Error): boolean;
  emit(event: 'close'): boolean;
  // Generic overload for any other events (compatible with EventEmitter)
  emit(event: string | symbol, ...args: any[]): boolean;

  close(cb?: (err?: Error) => void): Promise<void>;
}
