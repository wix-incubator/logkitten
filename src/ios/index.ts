import type { PlatformFactory } from '../types';
import type { IosEntry, IosOptions } from './types';
import { run } from './runner';
import { IosParser } from './parser';

export const create: PlatformFactory<IosEntry, IosOptions> = (options) => ({
  name: 'ios',
  process: run(options),
  parse: IosParser.create(),
});

export { IosOptions, IosEntry } from './types';
