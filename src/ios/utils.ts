import { Priority, PriorityNames } from './constants';

// Helper functions
export const PriorityUtils = {
  fromName(name: string): number {
    const value = Priority[name as PriorityNames];
    return typeof value === 'number' ? value : Priority.Debug;
  },
};
