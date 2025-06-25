/* Common */
import { LogkittenEmitter } from './emitter';
import { Emitter, Entry, Options } from './types';

import {
  create as android,
  type AndroidEntry,
  type AndroidOptions,
} from './android';
import { create as ios, type IosEntry, type IosOptions } from './ios';
import { AliasedIosOptions } from './ios/types';
import { AliasedAndroidOptions } from './android/types';

const alwaysTrue = () => true;

export { Level } from './constants';

export function logkittenCustom<E extends Entry, O>(
  options: O & Options<E>
): Emitter<E> {
  const driver = options.platform(options);
  const userFilter = options.filter || alwaysTrue;
  const platformFilter = driver.filter || alwaysTrue;

  const loggingProcess = driver.process;
  const emitter = new LogkittenEmitter(loggingProcess);

  function handleData(raw: string | Buffer, stderr: boolean) {
    let entries: E[] | undefined;

    try {
      entries = driver.parse(raw, stderr);
    } catch (error) {
      emitter.emit('error', error);
    }

    if (entries) {
      for (const entry of entries) {
        if (platformFilter(entry) && userFilter(entry)) {
          emitter.emit('entry', entry);
        }
      }
    }
  }

  function handleError(error: Error) {
    emitter.emit('error', error);
    emitter.close();
  }

  loggingProcess.on('error', handleError);
  loggingProcess.stdout?.on('error', handleError);
  loggingProcess.stderr?.on('error', handleError);
  loggingProcess.stderr?.on('data', (data) => handleData(data, true));
  loggingProcess.stdout?.on('data', (data) => handleData(data, false));

  return emitter;
}

export function logkitten(
  options: AliasedAndroidOptions
): Emitter<AndroidEntry>;
// eslint-disable-next-line no-redeclare
export function logkitten(options: AliasedIosOptions): Emitter<IosEntry>;
// eslint-disable-next-line no-redeclare
export function logkitten(
  options: AliasedAndroidOptions | AliasedIosOptions
): Emitter<AndroidEntry | IosEntry> {
  const { platform } = options;

  if (platform === 'android') {
    return logkittenAndroid(options);
  } else if (platform === 'ios') {
    return logkittenIOS(options);
  } else {
    throw new Error(`Platform ${platform} is not supported`);
  }
}

export function logkittenIOS(options: Omit<AliasedIosOptions, 'platform'>) {
  return logkittenCustom<IosEntry, IosOptions>({
    ...options,
    platform: ios,
  });
}

export function logkittenAndroid(
  options: Omit<AliasedAndroidOptions, 'platform'>
) {
  return logkittenCustom<AndroidEntry, AndroidOptions>({
    ...options,
    platform: android,
  });
}
