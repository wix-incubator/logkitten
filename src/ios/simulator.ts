import { ChildProcess, spawn } from 'child_process';
import { CodeError, ERR_IOS_CANNOT_START_SYSLOG } from '../errors';

export function runSimulatorLoggingProcess(deviceId?: string): ChildProcess {
  const targetDevice = deviceId || 'booted';

  try {
    return spawn(
      'xcrun',
      [
        'simctl',
        'spawn',
        targetDevice,
        'log',
        'stream',
        '--type',
        'log',
        '--level',
        'debug',
      ],
      {
        stdio: 'pipe',
      }
    );
  } catch (error) {
    throw new CodeError(ERR_IOS_CANNOT_START_SYSLOG, (error as Error).message);
  }
}
