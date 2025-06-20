import { Entry } from '../types';

export default function createAndroidFilter(minPriority: number = 0) {
  return (entry: Entry): boolean => {
    return entry.priority >= minPriority;
  };
}
