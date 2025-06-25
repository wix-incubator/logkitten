import { EventEmitter } from 'events';
import type { ChildProcess } from 'child_process';
import type { Entry, Emitter } from './types';

/**
 * LogkittenEmitter extends EventEmitter and provides an async .close([cb]) method
 * to programmatically stop the logging process and clean up resources.
 */
export class LogkittenEmitter<E extends Entry = Entry>
  extends EventEmitter
  implements Emitter<E>
{
  private _closePromise?: Promise<void>;
  private _loggingProcess: ChildProcess;

  constructor(loggingProcess: ChildProcess) {
    super();

    this._loggingProcess = loggingProcess;
  }

  /**
   * Closes the logging process and emits 'close'.
   * Supports both callback and Promise API.
   */
  close(cb?: (err?: Error) => void): Promise<void> {
    if (this._closePromise) {
      // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then, promise/no-callback-in-promise
      if (cb) this._closePromise.then(() => cb(), cb);
      return this._closePromise;
    }

    this._closePromise = new Promise((resolve, reject) => {
      const onExit = () => {
        this.emit('close');
        if (cb) cb();
        resolve();
      };

      try {
        this._loggingProcess.removeAllListeners();
        this._loggingProcess.stdin?.removeAllListeners();
        this._loggingProcess.stdout?.removeAllListeners();
        this._loggingProcess.stderr?.removeAllListeners();

        if (
          this._loggingProcess.exitCode !== null ||
          this._loggingProcess.killed
        ) {
          onExit();
        } else {
          this._loggingProcess.on('exit', onExit);
          this._loggingProcess.kill();
        }
      } catch (err) {
        if (cb) cb(err as Error);
        reject(err);
      }
    });

    return this._closePromise;
  }
}
