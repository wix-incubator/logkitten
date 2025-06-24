import { EventEmitter } from 'events';
import { LogkittenEmitter } from '../emitter';

class FakeLoggingProcess extends EventEmitter {
  public kill = jest.fn();
  public stdin = new EventEmitter();
  public stdout = new EventEmitter();
  public stderr = new EventEmitter();
}

describe('LogkittenEmitter', () => {
  describe('.close()', () => {
    it('removes listeners, kills process, emits "close" and resolves', async () => {
      const proc = new FakeLoggingProcess();
      // Spy on removeAllListeners after EventEmitter prototype
      const removeAllSpy = jest.spyOn(proc, 'removeAllListeners');
      const emitter = new LogkittenEmitter(proc as any);
      const onClose = jest.fn();

      emitter.on('close', onClose);
      await expect(emitter.close()).resolves.toBeUndefined();

      expect(proc.kill).toHaveBeenCalledTimes(1);
      expect(removeAllSpy).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('supports callback style and passes no error', (done) => {
      const proc = new FakeLoggingProcess();
      const emitter = new LogkittenEmitter(proc as any);

      emitter.close((err) => {
        expect(err).toBeUndefined();
        expect(proc.kill).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('is idempotent (second call returns same promise and does not kill again)', async () => {
      const proc = new FakeLoggingProcess();
      const emitter = new LogkittenEmitter(proc as any);

      const promise1 = emitter.close();
      const promise2 = emitter.close();

      expect(promise1).toBe(promise2);
      await promise1;
      expect(proc.kill).toHaveBeenCalledTimes(1);
    });
  });
});
