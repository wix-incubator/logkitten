export enum Priority {
  Debug = 10,
  Info = 20,
  Default = 30,
  Error = 50,
  Fault = 60,
}

export type PriorityNames = keyof typeof Priority;
