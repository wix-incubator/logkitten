import { EventEmitter } from 'events';

/**
 * LogkittenEmitter extends EventEmitter and provides an async .close([cb]) method
 * to programmatically stop the logging process and clean up resources.
 */
export class LogkittenEmitter extends EventEmitter {
  private loggingProcess: any;
  private _closePromise?: Promise<void>;

  constructor(loggingProcess: any) {
    super();
    this.loggingProcess = loggingProcess;
  }

  /**
   * Closes the logging process and emits 'close'.
   * Supports both callback and Promise API.
   */
  close(cb?: (err?: Error) => void): Promise<void> | void {
    if (this._closePromise) {
      // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then, promise/no-callback-in-promise
      if (cb) this._closePromise.then(() => cb(), cb);
      return this._closePromise;
    }

    this._closePromise = new Promise((resolve, reject) => {
      try {
        this.loggingProcess.removeAllListeners();
        this.loggingProcess.stdin?.removeAllListeners();
        this.loggingProcess.stdout?.removeAllListeners();
        this.loggingProcess.stderr?.removeAllListeners();
        this.loggingProcess.kill();

        this.emit('close');
        if (cb) cb();
        resolve();
      } catch (err) {
        if (cb) cb(err as Error);
        reject(err);
      }
    });

    return this._closePromise;
  }
}
