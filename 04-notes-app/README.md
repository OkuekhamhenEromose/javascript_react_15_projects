# Project 4 — Notes Application

**Difficulty:** Intermediate
**Concepts:** a reusable custom hook (`useDebouncedValue`), search filtering, CRUD.

## Folder structure
```
04-notes-app/
├── NotesApp.jsx              Top-level - wires search, CRUD, persistence
├── NotesApp.test.jsx         4 integration tests, incl. REAL timer-verified debounce
├── NoteForm.jsx              Create/edit form - syncs via useEffect on editingNote change
├── NoteList.jsx              Sorted (most recent first), filtered display
├── SearchBar.jsx             Uses the debounce hook, reports settled value up
├── useDebouncedValue.js      Reusable hook - formalizes Snippet 29's debounce for React
├── useDebouncedValue.test.jsx Hook tested in ISOLATION with fake timers
└── useLocalStorageState.js   Reused from Project 1
```

## How `useDebouncedValue.js` works

```js
export function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timerId); // <- the entire debounce mechanism
  }, [value, delay]);
  return debouncedValue;
}
```
The cleanup function is React's built-in equivalent of manually calling
`clearTimeout` on every keystroke — React calls it automatically right before
the effect re-runs (i.e., the instant `value` changes again).

## A genuine mistake made (and fixed) while building this

`SearchBar.jsx` originally tried `useState(() => onDebouncedSearchChange(...))`
to notify the parent when the debounced value settled. **This is wrong** —
`useState`'s lazy initializer function runs exactly ONCE, ever, on mount. It
will never fire again when `debouncedQuery` changes later. The fix, present in
the current file, is `useEffect(() => { onDebouncedSearchChange(debouncedQuery); }, [debouncedQuery, ...])`.

## Testing note: chained effects need an extra flush

`NotesApp.test.jsx`'s search test needed an extra `await act(async () => {})`
after advancing fake timers. Why: the debounce's OWN effect settling triggers
`SearchBar`'s SEPARATE effect (watching `debouncedQuery`), which THEN calls
`setSearchQuery` in the parent — two effect "hops," not one. A single timer
advance flushes the first hop; the extra `act()` flushes the second.

## Senior review notes
- **Good:** the debounce logic is completely decoupled from search — reusable
  for anything needing a settled-value pattern.
- **Would NOT change:** using `useEffect`'s cleanup instead of manually
  tracking a ref for the timer ID — it's the idiomatic React equivalent.
