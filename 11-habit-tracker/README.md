# Project 11 — Habit Tracker

**Difficulty:** Intermediate-Advanced
**Concepts:** real date-handling, and MOCKING SYSTEM TIME for deterministic tests.

## Folder structure
```
11-habit-tracker/
├── HabitTracker.jsx       Component - uses the pure functions below
├── HabitTracker.test.jsx  4 integration tests, all under mocked "today"
├── habitStats.js          PURE, React-free streak calculation functions
├── habitStats.test.js     7 unit tests, fully deterministic via vi.setSystemTime
└── useLocalStorageState.js Reused from Project 1
```

## Why streak logic is built as PURE functions, separate from the component

```js
export function calculateCurrentStreak(completedDates, todayStr = getTodayString()) {
  const completedSet = new Set(completedDates);
  let streak = 0;
  let checkDate = todayStr;
  while (completedSet.has(checkDate)) {
    streak++;
    checkDate = subtractDays(checkDate, 1);
  }
  return streak;
}
```
No React, no DOM, no component — just data in, data out. This makes genuinely
tricky edge cases (a mid-history gap, duplicate dates, an empty history)
trivially testable in isolation.

## Mocking system time — a technique used nowhere else in this course

```js
beforeEach(() => {
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z')); // fixed, deterministic "today"
});
```
Without this, a test asserting "streak is 3" would silently break the day
after it was written, or behave differently depending on what day the suite
happens to run. Every `new Date()` call anywhere in the code under test
returns this frozen time instead of the real clock.

## A real design decision worth noting

Dates are stored as plain `"YYYY-MM-DD"` strings, not `Date` objects or
timestamps — trivially comparable (`===`), sortable, and free of the
serialization/timezone headaches `Date` objects carry through
`JSON.stringify`/`localStorage` round trips. All date math uses UTC-explicit
methods (`getUTCDate`/`setUTCDate`) to avoid timezone-dependent day-shifting
bugs entirely.
