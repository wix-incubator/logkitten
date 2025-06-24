import { EventEmitter } from 'events';
import { logkitten, AndroidPriority } from '../api';
import { runAndroidLoggingProcess } from '../android/adb';
import { runSimulatorLoggingProcess } from '../ios/simulator';
import { Entry } from '../types';
import { ANDROID_RAW_LOG_FIXTURES } from './__fixtures__/android';
import { IOS_RAW_LOG_FIXTURES } from './__fixtures__/ios';

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
          expect(entry).toMatchSnapshot();
          entriesEmitted += 1;
        });

        ANDROID_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(4);
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
          expect(entry).toMatchSnapshot();
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
          expect(entry).toMatchSnapshot();
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

      it('should pass deviceId to Android logging process', () => {
        const loggingEmitter = new EventEmitter();
        (runAndroidLoggingProcess as jest.Mock).mockImplementationOnce(() => ({
          stdout: loggingEmitter,
          stderr: new EventEmitter(),
        }));

        logkitten({
          platform: 'android',
          deviceId: 'emulator-5554',
          priority: AndroidPriority.DEBUG,
        });

        expect(runAndroidLoggingProcess).toHaveBeenCalledWith(
          undefined,
          'emulator-5554'
        );
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
          expect(entry).toMatchSnapshot();
          entriesEmitted += 1;
        });

        IOS_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(4);
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
          filter: (entry) => entry.tag === 'com.apple.network',
        });

        emitter.on('entry', (entry: Entry) => {
          expect(entry).toMatchSnapshot();
          if (entriesEmitted === 1) {
            expect(entry).toMatchSnapshot();
          }
          entriesEmitted += 1;
        });

        IOS_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          expect(entriesEmitted).toBe(3);
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
          filter: (entry) =>
            entry.messages.some((msg) => /Socket SO_ERROR/.test(msg)),
        });

        emitter.on('entry', (entry: Entry) => {
          try {
            expect(entry).toMatchSnapshot();
            entriesEmitted += 1;
          } catch (error) {
            console.error('Test failed for entry:', entry, error);
            done(error);
          }
        });

        IOS_RAW_LOG_FIXTURES.forEach((data: string) => {
          loggingEmitter.emit('data', data);
        });

        setTimeout(() => {
          try {
            expect(entriesEmitted).toBe(1);
            done();
          } catch (error) {
            done(error);
          }
        }, 100);
      });

      it('should pass deviceId to iOS logging process', () => {
        const loggingEmitter = new EventEmitter();
        (runSimulatorLoggingProcess as jest.Mock).mockImplementationOnce(
          () => ({
            stdout: loggingEmitter,
            stderr: new EventEmitter(),
          })
        );

        logkitten({
          platform: 'ios',
          deviceId: 'A1B2C3D4-E5F6-7890-ABCD-EF1234567890',
        });

        expect(runSimulatorLoggingProcess).toHaveBeenCalledWith(
          'A1B2C3D4-E5F6-7890-ABCD-EF1234567890'
        );
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
