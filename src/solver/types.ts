export type Solution = {
  value: number;
  expr: string;
  numberUses: number;
  ops: number;
  algorithm: string;
};

export type Operation = {
  symbol: string;
  fn: (a: number, b: number) => number | null;
};

export type Algorithm = "BFS" | "DIJKSTRA" | "BEAM";

export type Node = {
  value: number;
  ops: number;
  prev?: Node;
  opSymbol?: string;
  right?: number;
};