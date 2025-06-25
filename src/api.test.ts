import { spawn } from 'child_process';
import { logkittenCustom, Level } from './api';
import { PlatformFactory, Parser } from './types';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const test: PlatformFactory = () => {
  const parse: Parser = (raw, stderr) => {
    if (stderr) return [];

    const entries = String(raw)
      .split(/\r?\n/)
      .filter(Boolean)
      .map((msg, i) => ({
        msg,
        ts: 1000 + i,
        pid: 1,
        tid: 1,
        level: Level.INFO,
      }));

    return entries;
  };

  return {
    name: 'test',
    process: spawn('node', ['-p', `[1,2,3,''].join("\\n")`]),
    parse,
  };
};

describe('logkitten filtering', () => {
  it('filters entries by tag', async () => {
    const emitter = logkittenCustom({
      platform: test,
      filter: (entry) => Number(entry.msg) % 2 === 1,
    });
    const onEntry = jest.fn();
    emitter.on('entry', onEntry);
    await sleep(1000);
    await emitter.close();

    expect(onEntry).toHaveBeenCalledTimes(2);
    expect(onEntry).toHaveBeenCalledWith(expect.objectContaining({ msg: '1' }));
    expect(onEntry).toHaveBeenCalledWith(expect.objectContaining({ msg: '3' }));
  });
});
