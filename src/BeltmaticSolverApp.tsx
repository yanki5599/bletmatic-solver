import  { useMemo, useState } from "react";
import type { JSX } from "react";

type Solution = {
  value: number;
  expr: string;
  numberUses: number;
  ops: number;
};

type Operation = {
  symbol: string;
  fn: (a: number, b: number) => number | null;
};

export default function BeltmaticSolverApp(): JSX.Element {
  const [target, setTarget] = useState("147");
  const [numbersInput, setNumbersInput] = useState("1,2,3,4,5");

  const [allowAdd, setAllowAdd] = useState(true);
  const [allowSub, setAllowSub] = useState(true);
  const [allowMul, setAllowMul] = useState(true);
  const [allowDiv, setAllowDiv] = useState(false);

  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [searching, setSearching] = useState(false);

  const numbers = useMemo(() => {
    return numbersInput
      .split(/[,\s]+/)
      .map((n) => Number(n.trim()))
      .filter((n) => !Number.isNaN(n) && n > 0);
  }, [numbersInput]);

  // UI ops (for checkboxes only)
  const uiOps = [
    { label: "+ Addition", checked: allowAdd, setter: setAllowAdd },
    { label: "- Subtraction", checked: allowSub, setter: setAllowSub },
    { label: "* Multiplication", checked: allowMul, setter: setAllowMul },
    { label: "/ Division", checked: allowDiv, setter: setAllowDiv },
  ];

  // Solver ops (REAL logic)
  const solverOps = useMemo<Operation[]>(() => {
    const ops: Operation[] = [];

    if (allowAdd) ops.push({ symbol: "+", fn: (a, b) => a + b });
    if (allowSub) ops.push({ symbol: "-", fn: (a, b) => a - b });
    if (allowMul) ops.push({ symbol: "*", fn: (a, b) => a * b });

    if (allowDiv) {
      ops.push({
        symbol: "/",
        fn: (a, b) => {
          if (b === 0) return null;
          const r = a / b;
          return Number.isInteger(r) ? r : null;
        },
      });
    }

    return ops;
  }, [allowAdd, allowSub, allowMul, allowDiv]);

function solve() {
  const goal = Number(target);

  if (Number.isNaN(goal) || numbers.length === 0 || solverOps.length === 0) {
    return;
  }

  setSearching(true);

  setTimeout(() => {
    const MAX_ABS = Math.max(goal * 3, 500);
    const MAX_STATES = 20000;
    const MAX_SOLUTIONS = 20;

    type Node = {
      value: number;
      ops: number;
      prev?: Node;
      opSymbol?: string;
      right?: number;
    };

    // BEST cost per value (critical pruning)
    const best = new Map<number, number>();

    const solutions: Solution[] = [];

    // "priority queue" (we avoid constant full sorting)
    let queue: Node[] = numbers.map((n) => ({
      value: n,
      ops: 0,
    }));

    function push(node: Node) {
      if (Math.abs(node.value) > MAX_ABS) return;

      const prevBest = best.get(node.value);

      if (prevBest !== undefined && prevBest <= node.ops) return;

      best.set(node.value, node.ops);
      queue.push(node);
    }

    function buildExpr(node: Node): string {
      if (!node.prev) return String(node.value);

      return `(${buildExpr(node.prev)} ${node.opSymbol} ${node.right})`;
    }

    let iterations = 0;

    while (
      queue.length &&
      solutions.length < MAX_SOLUTIONS &&
      iterations < 20000
    ) {
      iterations++;

      // instead of full sort every time → partial selection
      let bestIndex = 0;
      for (let i = 1; i < queue.length; i++) {
        if (queue[i].ops < queue[bestIndex].ops) {
          bestIndex = i;
        }
      }

      const current = queue.splice(bestIndex, 1)[0];
      const { value, ops } = current;

      if (value === goal) {
        solutions.push({
          value,
          expr: buildExpr(current),
          numberUses: 0,
          ops,
        });
        continue;
      }

      for (const nextNumber of numbers) {
        for (const op of solverOps) {
          const r = op.fn(value, nextNumber);

          if (r == null || !Number.isFinite(r)) continue;
          if (Math.abs(r) > MAX_ABS) continue;

          // commutative pruning
          if ((op.symbol === "+" || op.symbol === "*") && value > nextNumber) {
            continue;
          } 

          push({
            value: r,
            ops: ops + 1,
            prev: current,
            opSymbol: op.symbol,
            right: nextNumber,
          });
        }
      }

      if (queue.length > MAX_STATES) {
        queue.length = MAX_STATES;
      }
    }

    solutions.sort((a, b) => a.ops - b.ops);

    setSolutions(solutions);
    setSearching(false);
  }, 10);
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[32px] shadow-2xl p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Beltmatic Solver
              </h1>

              <p className="text-gray-300 mt-3 text-lg">
                Find the shortest and cleanest way to reach a target number.
              </p>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-2xl px-5 py-3 text-sm text-gray-300">
              Unlimited reuse of numbers & ops
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* CONTROLS */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[32px] shadow-2xl p-7 space-y-6">

            <div>
              <label className="block text-sm font-semibold mb-3 text-cyan-300">
                Target Number
              </label>

              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 text-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 text-cyan-300">
                Available Numbers
              </label>

              <textarea
                value={numbersInput}
                onChange={(e) => setNumbersInput(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-2xl p-4 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
                placeholder="1,2,3,4,5"
              />
            </div>

            {/* OPS */}
            <div>
              <div className="text-sm font-semibold mb-4 text-cyan-300">
                Allowed Ops
              </div>

              <div className="grid grid-cols-2 gap-3">
                {uiOps.map((op) => (
                  <label
                    key={op.label}
                    className="flex items-center gap-3 bg-black/20 border border-white/10 hover:border-cyan-400/40 rounded-2xl p-4 cursor-pointer transition"
                  >
                    <input
                      type="checkbox"
                      checked={op.checked}
                      onChange={(e) => op.setter(e.target.checked)}
                    />
                    <span>{op.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={solve}
              className="w-full rounded-2xl p-4 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] transition"
            >
              {searching ? "Searching..." : "Find Best Solutions"}
            </button>
          </div>

          {/* SOLUTIONS */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-[32px] shadow-2xl p-7">
            <h2 className="text-3xl font-black mb-6">Solutions</h2>

            {solutions.length === 0 ? (
              <div className="border border-dashed border-white/20 rounded-3xl p-12 text-center text-gray-400">
                No solutions yet
              </div>
            ) : (
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <div
                    key={`${solution.expr}-${index}`}
                    className="bg-black/20 border border-white/10 rounded-3xl p-5"
                  >
                    <div className="font-mono text-cyan-200 break-all">
                      {solution.expr}
                    </div>

                    <div className="flex gap-2 mt-3 flex-wrap text-sm">
                      <div>Uses: {solution.numberUses}</div>
                      <div>Ops: {solution.ops}</div>
                      <div>= {solution.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}