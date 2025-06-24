export enum Priority {
  UNKNOWN = 0,
  DEBUG = 1,
  INFO = 2,
  DEFAULT = 3,
  ERROR = 5,
  FAULT = 6,
}

export type PriorityNames = keyof typeof Priority;

// Helper functions
export const PriorityUtils = {
  fromName(name: string): number {
    const value = Priority[name?.toUpperCase() as PriorityNames];
    return typeof value === 'number' ? value : Priority.UNKNOWN;
  },
  toName(code: number): PriorityNames {
    const name = Priority[code] as PriorityNames;
    return name || 'UNKNOWN';
  },
};
