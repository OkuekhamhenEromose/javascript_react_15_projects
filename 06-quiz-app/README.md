# Project 6 — Quiz Application

**Difficulty:** Intermediate
**Concepts:** an application state machine, a RECURRING `setInterval` timer with correct cleanup.

## Folder structure
```
06-quiz-app/
├── QuizApp.jsx        idle -> playing -> finished state machine
├── QuizApp.test.jsx   7 tests, incl. real fake-timer countdown verification
└── quizData.js        Question bank
```

## The state machine

```js
const [status, setStatus] = useState('idle'); // "idle" | "playing" | "finished"
```
One string, not several booleans (`isStarted`, `isFinished`, ...) — this makes
impossible combinations (like being simultaneously "not started" and "showing
a score") structurally unrepresentable.

## Two separate effects, split by CONCERN not minimized in count

```js
// Effect 1: manages the interval itself
useEffect(() => {
  if (status !== 'playing') return;
  const intervalId = setInterval(() => {
    setTimeLeft((prev) => (prev <= 1 ? 0 : prev - 1));
  }, 1000);
  return () => clearInterval(intervalId); // CRITICAL - prevents overlapping timers
}, [status, currentIndex]);

// Effect 2: reacts to timeLeft hitting zero
useEffect(() => {
  if (status === 'playing' && timeLeft === 0) goToNextQuestion();
}, [timeLeft, status]);
```
Resist the instinct to merge these into one effect "to have fewer effects" —
they react to genuinely different things and are easier to reason about split.

## A genuine, unstaged test-infrastructure bug (and the fix)

Two tests originally hung for the FULL 5-second timeout using
`vi.useFakeTimers()` alone. Root cause: `userEvent`'s internal simulated
delays never advance under plain fake timers, deadlocking against explicit
`advanceTimersByTimeAsync` calls that only run AFTER the hung click. **Fix:**
`vi.useFakeTimers({ shouldAdvanceTime: true })` — now the standard, required
configuration anywhere `userEvent` and fake timers are combined in this
course's test suites.

## Senior review notes
- **Would change:** the `// eslint-disable-next-line react-hooks/exhaustive-deps`
  comment is an honest shortcut — a real production fix would wrap
  `goToNextQuestion` in `useCallback` instead of suppressing the lint rule.
