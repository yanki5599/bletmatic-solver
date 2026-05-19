# 🧮 Beltmatic Solver

A React + TypeScript puzzle solver that finds mathematical expressions to reach a target number using a given set of numbers and operations.

The project explores multiple search strategies and expression-generation techniques, from simple BFS to experimental full expression tree generation.

---

## 🚀 Features

- Find expressions that evaluate to a target number
- Supports:
  - Addition (+)
  - Subtraction (-)
  - Multiplication (*)
  - Division (/ integer-only mode)
- Multiple solving algorithms
- Cached results (no recomputation for identical inputs)
- Beautiful UI with Tailwind CSS
- Full expression output with parentheses

---

## 🧠 Algorithms

### 1. BFS (Breadth-First Search)
- Expands states level by level
- Fast and simple
- Does not guarantee optimal expressions

**Best for:**
- Small inputs
- Fast approximate solutions

---

### 2. Dijkstra (Cost-Based Search)
- Prioritizes fewer operations
- Uses pruning to avoid worse states
- Produces better structured linear solutions

**Best for:**
- More optimal solutions
- Balanced performance + correctness

---

### 3. TREE Algorithm ⚠️ Experimental
- Generates full expression combinations like:
  - `(a + b) * (c + d)`
- Combines ANY two expressions
- Produces full parenthesized structures

⚠️ **Status: Experimental**

Known issues:
- Can become slow with larger inputs
- High memory usage due to combinatorial explosion
- Requires further pruning optimizations
- May generate duplicate structures

**Best for:**
- Exploring full expression space
- Maximum creativity / combinations

---

### 4. DFS (if added in future) ⚠️ Not recommended
- Deep recursive exploration
- Not optimized in this project
- Can be inefficient for larger inputs

---

## ⚡ Performance Notes

- Small inputs (≤ 30): instant results
- Medium inputs (~100): depends on algorithm
- TREE mode: can become slow quickly

A caching system prevents recomputation of identical problems.

---

## 💾 Cache System

Results are cached based on:

- Target number
- Input numbers
- Selected operations
- Algorithm type

This ensures repeated runs are instant.

---

## 📁 Project Structure
beltmatic-solver/
│
├── public/
│   └── index.html
│
├── src/
│   │
│   ├── main.tsx
│   ├── index.css
│   ├── BeltmaticSolverApp.tsx
│   │
│   ├── components/
│   │   └── SolverUI.tsx          # (optional split for UI later)
│   │
│   ├── solver/
│   │   ├── types.ts             # shared TypeScript types
│   │   ├── cache.ts             # caching system
│   │   ├── algorithms.ts        # BFS / Dijkstra / TREE
│   │   ├── solve.ts             # optional orchestration layer (can be merged)
│   │
│   └── assets/                  # optional images/icons
│
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── README.md


---

## 🛠 Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS

---

## 🔮 Future Improvements

Planned upgrades:

- 🧠 Optimized TREE engine (pruning + memoization)
- ⚡ Web Worker execution (non-blocking UI)
- 📊 Expression tree visualization
- 🎮 Game-like Beltmatic mode
- 🚀 Hybrid solver (Dijkstra + TREE optimization)

---

## ⚠️ Important Notes

Some algorithms (especially TREE-based generation) are experimental and may:

- Run slower on large inputs
- Produce duplicate or redundant expressions
- Require further optimization for production use

They are included for research and experimentation purposes.

---

## 📄 License

MIT (or your chosen license)

---

## ✨ Summary

This project is a hybrid between:

- Mathematical expression solver
- Graph search engine
- Expression tree generator

Built for experimentation, optimization, and puzzle-solving exploration.  
