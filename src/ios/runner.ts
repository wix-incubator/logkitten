import { ChildProcess, spawn } from 'child_process';
import { CodeError, ERR_IOS_CANNOT_START_SYSLOG } from '../errors';
import { IosOptions } from './types';

export function run({ deviceId = 'booted' }: IosOptions): ChildProcess {
  try {
    return spawn(
      'xcrun',
      [
        'simctl',
        'spawn',
        deviceId,
        'log',
        'stream',
        '--type',
        'log',
        '--level',
        'debug',
        '--style',
        'ndjson',
      ],
      {
        stdio: 'pipe',
      }
    );
  } catch (error) {
    throw new CodeError(ERR_IOS_CANNOT_START_SYSLOG, (error as Error).message);
  }
}
