import type { AndroidEntry } from './types';
import { Priority, type PriorityLetter } from './constants';

const TS_DELTA = 1;

export function areEntriesComingFromTheSameSource(
  a: AndroidEntry,
  b: AndroidEntry
): boolean {
  return (
    b.ts - a.ts <= TS_DELTA &&
    a.tag === b.tag &&
    a.pid === b.pid &&
    a.level === b.level &&
    a.tid === b.tid
  );
}

export const PriorityUtils = {
  fromLetter(level: string): number {
    const letterUpper = (level || 'V')[0] as PriorityLetter;
    return Priority[letterUpper] || Priority.V;
  },
};
