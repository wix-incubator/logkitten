export enum Priority {
  V = 10,
  D = 20,
  I = 30,
  W = 40,
  E = 50,
  F = 60,
  S = 70,
}

export type PriorityLetter = keyof typeof Priority;
