import type { Node, Solution, Operation } from "./types";

function buildExpr(node: Node): string {
  if (!node.prev) return String(node.value);
  return `(${buildExpr(node.prev)} ${node.opSymbol} ${node.right})`;
}

/* ---------------- BFS ---------------- */
export function bfsSolve(
  numbers: number[],
  ops: Operation[],
  goal: number,
  maxAbs: number,
  maxSolutions: number
): Solution[] {
  const queue: Node[] = numbers.map((n) => ({
    value: n,
    ops: 0,
  }));

  const found: Solution[] = [];
  const visited = new Set<string>();

  while (queue.length && found.length < maxSolutions) {
    const current = queue.shift()!;
    if (current.value === goal) {
      found.push({
        value: current.value,
        expr: buildExpr(current),
        numberUses: 0,
        ops: current.ops,
        algorithm: "BFS",
      });
      continue;
    }

    for (const n of numbers) {
      for (const op of ops) {
        const r = op.fn(current.value, n);
        if (r == null || !Number.isFinite(r)) continue;
        if (Math.abs(r) > maxAbs) continue;

        const key = `${r}|${current.ops + 1}`;
        if (visited.has(key)) continue;
        visited.add(key);

        queue.push({
          value: r,
          ops: current.ops + 1,
          prev: current,
          opSymbol: op.symbol,
          right: n,
        });
      }
    }
  }

  return found;
}

/* ---------------- DIJKSTRA ---------------- */
export function dijkstraSolve(
  numbers: number[],
  ops: Operation[],
  goal: number,
  maxAbs: number,
  maxSolutions: number
): Solution[] {
  const best = new Map<number, number>();
  let queue: Node[] = numbers.map((n) => ({ value: n, ops: 0 }));

  const found: Solution[] = [];

  function push(node: Node) {
    if (Math.abs(node.value) > maxAbs) return;
    const prev = best.get(node.value);
    if (prev !== undefined && prev <= node.ops) return;
    best.set(node.value, node.ops);
    queue.push(node);
  }

  let iter = 0;

  while (queue.length && found.length < maxSolutions && iter++ < 20000) {
    queue.sort((a, b) => a.ops - b.ops);
    const cur = queue.shift()!;

    if (cur.value === goal) {
      found.push({
        value: cur.value,
        expr: buildExpr(cur),
        numberUses: 0,
        ops: cur.ops,
        algorithm: "DIJKSTRA",
      });
      continue;
    }

    for (const n of numbers) {
      for (const op of ops) {
        const r = op.fn(cur.value, n);
        if (r == null || !Number.isFinite(r)) continue;
        if (Math.abs(r) > maxAbs) continue;

        push({
          value: r,
          ops: cur.ops + 1,
          prev: cur,
          opSymbol: op.symbol,
          right: n,
        });
      }
    }
  }

  return found;
}

/* ---------------- TREE COMBINE (EXPERIMENTAL) ---------------- */

export function treeCombineSolve(
  numbers: number[],
  ops: Operation[],
  goal: number,
  maxAbs: number,
  maxSolutions: number
): Solution[] {

  type State = Node;

  let states: State[] = numbers.map(n => ({
    value: n,
    ops: 0
  }));

  const found: Solution[] = [];

  const best = new Map<string, number>();

  function key(v: number, ops: number) {
    return `${v}|${ops}`;
  }

  function push(s: State) {
    if (Math.abs(s.value) > maxAbs) return;

    const k = key(s.value, s.ops);
    const prev = best.get(k);
    if (prev !== undefined && prev <= s.ops) return;

    best.set(k, s.ops);
    states.push(s);
  }

  for (let depth = 0; depth < 5; depth++) {

    const next: State[] = [];

    for (let i = 0; i < states.length; i++) {
      for (let j = 0; j < states.length; j++) {

        const A = states[i];
        const B = states[j];

        for (const op of ops) {

          const fn = op.fn(A.value, B.value);
          if (fn == null || !Number.isFinite(fn)) continue;

          if (Math.abs(fn) > maxAbs) continue;

          const expr = {
            value: fn,
            ops: Math.max(A.ops, B.ops) + 1,
            prev: A,
            opSymbol: op.symbol,
            right: B.value
          };

          push(expr);

          if (fn === goal) {
            found.push({
              value: fn,
              expr: buildExpr(expr),
              numberUses: 0,
              ops: expr.ops,
              algorithm: "TREE"
            });
          }

          next.push(expr);
        }
      }
    }

    states = next;

    if (found.length >= maxSolutions) break;
  }

  return found;
}