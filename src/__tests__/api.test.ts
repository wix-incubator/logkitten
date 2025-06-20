import { EventEmitter } from 'events';
import { logkitten, AndroidPriority } from '../api';
import { runAndroidLoggingProcess } from '../android/adb';
import { runSimulatorLoggingProcess } from '../ios/simulator';
import { Entry } from '../types';
import {
  ANDROID_PARSED_LOG_FIXTURES,
  ANDROID_RAW_LOG_FIXTURES,
} from './__fixtures__/android';
import {
  IOS_PARSED_LOG_FIXTURES,
  IOS_RAW_LOG_FIXTURES,
} from './__fixtures__/ios';

jest.mock('../android/adb.ts', () => ({
  runAndroidLoggingProcess: jest.fn(),
}));

jest.mock('../ios/simulator.ts', () => ({
  runSimulatorLoggingProcess: jest.fn(),
}));

describe('Node API', () => {
  describe('for Android', () => {
    describe('should spawn logcat process and emit entries', () => {
      it('when no filter is used', (done: Function) => {
        let entriesEmitted = 0;
        const loggingEmitter = new EventEmitter();
        (runAndroidLoggingProcess as jest.Mock).mockImplementationOnce(() => ({
          stdout: loggingEmitter,
          stderr: new EventEmitter(),
        }));

        const emitter = logkitten({
          platform: 'android',
          priority: AndroidPriority.INFO,
        });

        emitter.on('entry', (entry: Entry) => {
          switch (entriesEmitted) {
            case 0:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[0]);
              break;
            case 1:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[1]);
              break;
            case 2:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[2]);
              break;
            default:
              throw new Error('should never get here');
          }

          entriesEmitted += 1;
        });

        ANDROID_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(3);
          done();
        });
      });

      it('when tag filter is used', (done: Function) => {
        let entriesEmitted = 0;
        const loggingEmitter = new EventEmitter();
        (runAndroidLoggingProcess as jest.Mock).mockImplementationOnce(() => ({
          stdout: loggingEmitter,
          stderr: new EventEmitter(),
        }));

        const emitter = logkitten({
          platform: 'android',
          priority: AndroidPriority.VERBOSE,
          filter: (entry) =>
            entry.tag === 'wificond' || entry.tag === 'storaged',
        });

        emitter.on('entry', (entry: Entry) => {
          switch (entriesEmitted) {
            case 0:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[0]);
              break;
            case 1:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[2]);
              break;
            case 2:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[3]);
              break;
            default:
              throw new Error('should never get here');
          }

          entriesEmitted += 1;
        });

        ANDROID_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(3);
          done();
        });
      });

      it('when message filter is used', (done: Function) => {
        let entriesEmitted = 0;
        const loggingEmitter = new EventEmitter();
        (runAndroidLoggingProcess as jest.Mock).mockImplementationOnce(() => ({
          stdout: loggingEmitter,
          stderr: new EventEmitter(),
        }));

        const emitter = logkitten({
          platform: 'android',
          priority: AndroidPriority.VERBOSE,
          filter: (entry) => entry.messages.some((msg) => /scan/.test(msg)),
        });

        emitter.on('entry', (entry: Entry) => {
          switch (entriesEmitted) {
            case 0:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[2]);
              break;
            case 1:
              expect(entry).toEqual(ANDROID_PARSED_LOG_FIXTURES[3]);
              break;
            default:
              throw new Error('should never get here');
          }

          entriesEmitted += 1;
        });

        ANDROID_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(2);
          done();
        });
      });
    });
  });

  describe('for iOS', () => {
    describe('should spawn logging process and emit entires', () => {
      it('when no filter is used', (done: Function) => {
        let entriesEmitted = 0;
        const loggingEmitter = new EventEmitter();
        (runSimulatorLoggingProcess as jest.Mock).mockImplementationOnce(
          () => ({
            stdout: loggingEmitter,
            stderr: new EventEmitter(),
          })
        );

        const emitter = logkitten({
          platform: 'ios',
        });

        emitter.on('entry', (entry: Entry) => {
          expect(entry).toEqual(IOS_PARSED_LOG_FIXTURES[entriesEmitted]);
          entriesEmitted += 1;
        });

        IOS_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(6);
          done();
        });
      });

      it('when tag filter is used', (done: Function) => {
        let entriesEmitted = 0;
        const loggingEmitter = new EventEmitter();
        (runSimulatorLoggingProcess as jest.Mock).mockImplementationOnce(
          () => ({
            stdout: loggingEmitter,
            stderr: new EventEmitter(),
          })
        );

        const emitter = logkitten({
          platform: 'ios',
          filter: (entry) => entry.tag === 'testApp1',
        });

        emitter.on('entry', (entry: Entry) => {
          expect(entry).toEqual(IOS_PARSED_LOG_FIXTURES[5]);
          entriesEmitted += 1;
        });

        IOS_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(1);
          done();
        }, 0);
      });

      it('when message filter is used', (done: Function) => {
        let entriesEmitted = 0;
        const loggingEmitter = new EventEmitter();
        (runSimulatorLoggingProcess as jest.Mock).mockImplementationOnce(
          () => ({
            stdout: loggingEmitter,
            stderr: new EventEmitter(),
          })
        );

        const emitter = logkitten({
          platform: 'ios',
          filter: (entry) => entry.messages.some((msg) => /test\s/.test(msg)),
        });

        emitter.on('entry', (entry: Entry) => {
          expect(entry).toEqual(IOS_PARSED_LOG_FIXTURES[2]);
          entriesEmitted += 1;
        });

        IOS_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(1);
          done();
        }, 0);
      });
    });
  });

  it('should emit error when parsing fails', (done: Function) => {
    const loggingEmitter = new EventEmitter();
    (runAndroidLoggingProcess as jest.Mock).mockImplementationOnce(() => ({
      stdout: loggingEmitter,
      stderr: new EventEmitter(),
    }));

    const emitter = logkitten({
      platform: 'android',
    });

    emitter.on('error', (error: Error) => {
      expect(error).toBeDefined();
      done();
    });

    loggingEmitter.emit('data', null);
  });

  it('should throw error when unsupported platform is used', () => {
    expect(() => {
      logkitten({
        platform: 'windows' as any,
      });
    }).toThrow('Platform windows is not supported');
  });
});
