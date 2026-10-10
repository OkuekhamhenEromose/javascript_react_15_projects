# Project 3 — Expense Tracker

**Difficulty:** Intermediate
**Concepts:** numeric form validation at the data boundary, `.reduce()`-based totals and category breakdowns.

## Folder structure
```
03-expense-tracker/
├── ExpenseTracker.jsx          Top-level - owns expenses[]
├── ExpenseTracker.test.jsx     6 integration tests
├── ExpenseForm.jsx             Validates BEFORE data enters state
├── ExpenseSummary.jsx          Total + per-category breakdown via reduce
├── ExpenseList.jsx             Renders + deletes expenses
├── ExpenseSummaryBuggy.jsx     INTENTIONAL BUG (see below)
├── ExpenseSummaryBuggy.test.jsx Proves the bug
└── useLocalStorageState.js     Reused from Project 1
```

## Data model
```js
expense = { id, description, amount, category }
```

## How it works

`ExpenseForm.jsx` validates at the exact boundary where a raw string
(everything from a text input IS a string) becomes real data:

```js
const numericAmount = Number(amount);
if (amount.trim() === '' || Number.isNaN(numericAmount)) {
  setError('Amount must be a valid number.');
  return;
}
if (numericAmount <= 0) {
  setError('Amount must be greater than zero.');
  return;
}
```

`ExpenseSummary.jsx` builds BOTH the total and the category breakdown with
`.reduce()` — the total needs `0` as its initial value; the breakdown needs
`{}`:

```js
const byCategory = expenses.reduce((groups, e) => {
  groups[e.category] = (groups[e.category] ?? 0) + e.amount;
  return groups;
}, {});
```

## The intentional bug (`ExpenseSummaryBuggy.jsx`)

```js
const byCategory = expenses.reduce((groups, e) => {
  groups[e.category] = (groups[e.category] ?? 0) + e.amount;
  return groups;
}); // BUG: no {} initial value
```

**Symptom:** the rendered breakdown shows nonsense rows (`id`, `description`,
`amount`, `category`) instead of a clean category list.
**Root cause:** without an initial value, `.reduce()` uses the FIRST EXPENSE
OBJECT ITSELF as the starting accumulator — its own fields get treated as if
they were pre-existing category totals.
**Fix:** add `{}` as the second argument to `.reduce()`.

## Senior review notes
- **Good:** validation happens once, at the form boundary — nothing downstream
  ever has to re-check whether an amount is a valid positive number.
- **Would change:** category list is hardcoded (`CATEGORIES` array in
  `ExpenseForm.jsx`) — a real app would likely let users manage categories.
- **Would NOT change:** deriving total/breakdown on every render rather than
  caching — the dataset size here doesn't warrant `useMemo`.
