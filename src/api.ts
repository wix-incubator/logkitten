/* Common */
import { EventEmitter } from 'events';
import { Entry, Platform } from './types';

/* Android */
import createAndroidFilter from './android/AndroidFilter';
import AndroidParser from './android/AndroidParser';
import { runAndroidLoggingProcess } from './android/adb';
export { Priority as AndroidPriority } from './android/constants';

/* iOS */
import IosParser from './ios/IosParser';
import createIosFilter from './ios/IosFilter';
import { runSimulatorLoggingProcess } from './ios/simulator';
import { CodeError, ERR_IOS_NO_SIMULATORS_BOOTED } from './errors';
export { Priority as IosPriority } from './ios/constants';

/* Exports */
export { Entry } from './types';

export type LogkittyOptions = {
  platform: Platform;
  adbPath?: string;
  priority?: number;
  filter?: (entry: Entry) => boolean;
};

export function logkitten(options: LogkittyOptions): EventEmitter {
  const { platform, adbPath, priority, filter: userFilter } = options;
  const emitter = new EventEmitter();

  if (
    !['ios', 'android'].some(
      (availablePlatform) => availablePlatform === platform
    )
  ) {
    throw new Error(`Platform ${platform} is not supported`);
  }

  const parser = platform === 'android' ? new AndroidParser() : new IosParser();
  const baseFilter =
    platform === 'android'
      ? createAndroidFilter(priority)
      : createIosFilter(priority);

  const loggingProcess =
    platform === 'android'
      ? runAndroidLoggingProcess(adbPath)
      : runSimulatorLoggingProcess();

  process.on('exit', () => {
    loggingProcess.kill();
    emitter.emit('exit');
  });

  loggingProcess.stderr?.on('data', (errorData: string | Buffer) => {
    if (platform === 'ios') {
      const msg = errorData.toString();

      if (msg.includes('getpwuid_r did not find a match for uid')) {
        return;
      }

      if (msg.includes('No devices are booted.')) {
        emitter.emit(
          'error',
          new CodeError(
            ERR_IOS_NO_SIMULATORS_BOOTED,
            'No simulators are booted.'
          )
        );
        return;
      }
    }

    emitter.emit('error', new Error(errorData.toString()));
  });

  loggingProcess.stdout?.on('data', (raw: string | Buffer) => {
    let entryToLog: Entry | undefined;
    try {
      const messages = parser.splitMessages(raw.toString());
      const entries = parser.parseMessages(messages);
      entries.forEach((entry: Entry) => {
        // Apply base priority filter and optional user filter
        if (baseFilter(entry) && (!userFilter || userFilter(entry))) {
          entryToLog = entry;
        }
      });
    } catch (error) {
      emitter.emit('error', error);
    }

    if (entryToLog) {
      emitter.emit('entry', entryToLog);
    }
  });

  loggingProcess.stdout?.on('error', (error: Error) => {
    emitter.emit('error', error);
    emitter.emit('exit');
  });

  return emitter;
}
