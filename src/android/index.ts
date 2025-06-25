import type { PlatformFactory } from '../types';
import type { AndroidEntry, AndroidOptions } from './types';
import { run } from './runner';
import { AndroidParser } from './parser';

export const create: PlatformFactory<AndroidEntry, AndroidOptions> = (
  options
) => {
  return {
    name: 'android',
    process: run(options),
    parse: AndroidParser.create(),
  };
};

export type { AndroidOptions, AndroidEntry } from './types';
