# Project 2 — Todo Application

**Difficulty:** Beginner-Intermediate
**Concepts:** full CRUD, in-place editing, derived filtering, `localStorage`.

## Folder structure
```
02-todo-app/
├── TodoApp.jsx             Top-level - owns todos[] and filter state
├── TodoApp.test.jsx        7 integration tests
├── TodoForm.jsx            Controlled input for new todos
├── TodoItem.jsx            Per-item: toggle, delete, EDIT-IN-PLACE
├── TodoFilter.jsx          all / active / completed buttons
├── TodoList.jsx            Derives the filtered view
├── TodoItemBuggy.jsx       INTENTIONAL BUG (see below)
├── TodoItemBuggy.test.jsx  Proves the bug
└── useLocalStorageState.js Reused from Project 1
```

## Data model
```js
todo = { id, text, completed }
filter = "all" | "active" | "completed"   // UI-only, NOT persisted - always starts on "all"
```

## How it works

`TodoList.jsx`'s `getFilteredTodos(todos, filter)` is a **plain function**,
not a hook — the filtered array is recalculated on every render from the two
real pieces of state (`todos`, `filter`). Nothing filtered is ever stored.

`TodoItem.jsx` introduces genuinely new state: whether THIS item is being
edited (`isEditing`) is per-item, UI-only state that is deliberately never
persisted — reloading the page should never reopen an edit box:

```js
const [isEditing, setIsEditing] = useState(false); // per-item, UI-only, NOT persisted
```

## The intentional bug (`TodoItemBuggy.jsx`)

```js
const [draftText, setDraftText] = useState(''); // BUG: doesn't initialize from todo.text
function startEditing() {
  setIsEditing(true);
  // BUG: forgot to reset draftText to todo.text here before showing the edit box
}
```

**Symptom:** clicking "Edit" opens a completely BLANK input instead of one
pre-filled with the todo's current text.
**Root cause:** `draftText` is initialized once, to `''`, on mount — and
nothing re-syncs it to `todo.text` at the moment editing actually begins.
**Fix (see `TodoItem.jsx`):** initialize `useState(todo.text)`, AND explicitly
re-sync in `startEditing`, since a component can be edited more than once
in its lifetime.

## Senior review notes
- **Good:** editing state (`isEditing`, `draftText`) is scoped exactly as
  local as it needs to be — no global "which todo is being edited" state.
- **Would change:** add a max-length guard on todo text for real-world use.
- **Would NOT change:** filtering being fully derived rather than cached.
