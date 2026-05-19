import type { Solution, Algorithm } from "./types";

const cache = new Map<string, Solution[]>();

export function makeKey(
  target: number,
  numbers: number[],
  ops: string[],
  algo: Algorithm
) {
  return `${target}|${numbers.join(",")}|${ops.join("")}|${algo}`;
}

export function getCache(key: string) {
  return cache.get(key);
}

export function setCache(key: string, value: Solution[]) {
  cache.set(key, value);
}