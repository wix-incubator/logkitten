import { spawn } from 'child_process';
import { LogkittenEmitter } from './emitter';

// Helper to spawn a long-running Node process
function spawnSomething() {
  // This process will stay alive for 10 seconds unless killed
  return spawn(process.execPath, ['-e', 'setTimeout(()=>{}, 10000)']);
}

describe('LogkittenEmitter (real process)', () => {
  describe('.close()', () => {
    it('should await the promise', async () => {
      const demo = spawnSomething();
      const emitter = new LogkittenEmitter(demo);
      const onClose = jest.fn();
      emitter.on('close', onClose);
      await emitter.close();
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should fire a callback', (done) => {
      const demo = spawnSomething();
      const emitter = new LogkittenEmitter(demo);
      emitter.close((err) => {
        expect(err).toBeUndefined();
        done();
      });
    });

    it('should be idempotent', async () => {
      const demo = spawnSomething();
      const emitter = new LogkittenEmitter(demo);
      const promise = emitter.close();
      expect(emitter.close()).toBe(promise);
      await promise;
    });

    it('should handle closing after short-lived process exits', async () => {
      // This process prints 0 and exits immediately
      const demo = spawn(process.execPath, ['-p', '0']);
      const emitter = new LogkittenEmitter(demo);
      // Wait for 500ms to ensure process has exited
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Now try to close the emitter
      const onClose = jest.fn();
      emitter.on('close', onClose);
      await emitter.close();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
