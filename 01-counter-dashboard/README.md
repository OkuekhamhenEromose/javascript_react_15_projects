# Project 1 — Interactive Counter Dashboard

**Difficulty:** Beginner
**Concepts:** `useState`, derived state, lists of components, lifting state up, `localStorage` persistence.

## Folder structure
```
01-counter-dashboard/
├── Dashboard.jsx              Top-level component - owns ALL state
├── Dashboard.test.jsx         6 integration tests
├── CounterCard.jsx            One counter's display + controls
├── TotalDisplay.jsx           Derived sum across all counters
├── AddCounterForm.jsx         Controlled input for adding a counter
├── useLocalStorageState.js    Reusable persistence hook (useState + useEffect)
├── DashboardBuggy.jsx         INTENTIONAL BUG (see below)
└── DashboardBuggy.test.jsx    Proves the bug
```

## Data model
```js
counters = [{ id, name, count }]   // the ONLY real state
total = counters.reduce((sum, c) => sum + c.count, 0)   // ALWAYS derived, never stored
```

## How it works

`Dashboard.jsx` owns one array of counters. Every update — increment,
decrement, remove, add — is a non-mutating array transformation:

```js
function handleIncrement(id) {
  setCounters(counters.map((c) => (c.id === id ? { ...c, count: c.count + 1 } : c)));
}
```

The `c.id === id ? ... : c` ternary is the whole trick: only the matching
counter gets a new object; every other counter passes through by reference,
completely untouched.

`useLocalStorageState.js` combines `useState`'s **lazy initializer** (a
function passed to `useState` only runs once, on mount — this is why reading
`localStorage` inside it doesn't re-run on every render) with a `useEffect`
that writes to `localStorage` whenever the state changes.

## The intentional bug (`DashboardBuggy.jsx`)

```js
function handleIncrement(id) {
  // BUG: no id check at all - applies to EVERY counter
  setCounters(counters.map((c) => ({ ...c, count: c.count + 1 })));
}
```

**Symptom:** clicking increment on ANY counter increments ALL of them.
**Root cause:** the `.map()` callback transforms every element unconditionally
— the `c.id === id ? ... : c` check was simply omitted.
**Run `DashboardBuggy.test.jsx`** to see it fail exactly this way, then compare
against `Dashboard.jsx`'s correct version line-by-line.

## Senior review notes
- **Good:** state lives in exactly one place; every update is non-mutating.
- **Would change:** `let nextId = 1` (module-level counter) produces duplicate
  IDs across multiple open browser tabs sharing the same `localStorage` —
  use `crypto.randomUUID()` in anything beyond a single-tab demo.
- **Would NOT change:** keeping `total` derived rather than cached in its own
  `useState` — a cached total could silently drift out of sync with the real
  counters if any update path is ever missed.
