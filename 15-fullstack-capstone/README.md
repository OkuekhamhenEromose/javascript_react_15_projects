# Project 15 — Mini Full-Stack Frontend (Capstone)

**Difficulty:** Advanced
**Concepts:** everything in this course combined - routing, protected routes, a documented API contract, and OPTIMISTIC UI UPDATES WITH ROLLBACK.

**Mock API disclosure:** no real backend is available. `taskApi.js` implements
the documented contract below as a clearly labeled mock.

## API Contract
```
GET    /tasks?search=&page=       -> { tasks: Task[], page, totalPages }
GET    /tasks/:id                 -> Task
PATCH  /tasks/:id  { completed }  -> Task (updated)

Task = { id: number, title: string, completed: boolean }
```

## Folder structure
```
15-fullstack-capstone/
├── App15.jsx          Routes, RequireAuth guard, TaskDetailPage
├── App15.test.jsx     5 tests: routing, route params, optimistic update, rollback
├── TaskListPage.jsx   Search + pagination + the optimistic toggle
├── taskApi.js         Mock API - has a resetTasksForTesting() export (see below)
├── useDebouncedValue.js  Reused from Project 4
├── AuthContext.jsx    Reused from Project 13
└── AuthComponents.jsx Reused from Project 13
```

## Optimistic updates with rollback — the new capstone concept

```js
async function handleToggleComplete(task) {
  const previousTasks = tasks; // snapshot for rollback

  // OPTIMISTIC: update the UI IMMEDIATELY, before the server confirms anything
  setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));

  try {
    await patchTask(task.id, { completed: !task.completed });
  } catch (error) {
    setTasks(previousTasks); // ROLLBACK to the exact previous state
    setSaveError(`Could not update "${task.title}": ${error.message}`);
  }
}
```
Proven BOTH ways in `App15.test.jsx`: the checkbox is checked SYNCHRONOUSLY,
before the mock's 150ms delay even elapses; and when the mock is configured
to reject the save, the checkbox correctly reverts and an error appears.

## Three genuine bugs found and fixed while building this — all documented in code

**1. Premature-redirect race condition.** `AuthProvider`'s very FIRST render
has `user === null` (the session-restore effect hasn't run yet) — `RequireAuth`
was redirecting to `/login` before the real check ever happened, losing the
originally-requested URL. **Fixed** with an `isCheckingAuth` flag in
`AuthContext.jsx` — `RequireAuth` now shows "Checking session..." and waits.

**2. Module-level mock-state pollution across tests.** `taskApi.js`'s `TASKS`
array is module-level mutable state (ES modules are cached and only
initialized once — the exact mechanism from this course's module-system
lessons). One test's genuine mutation silently leaked into a later test's
assumptions. **Fixed** with an explicit `resetTasksForTesting()` export,
called in every test's `beforeEach`.

**3. Un-awaited pending async operations bleeding across test boundaries.**
A test verifying only the OPTIMISTIC (immediate) update ended before its
own underlying 150ms mock request resolved — that leftover pending request
fired DURING the next test, incorrectly consuming a shared
`forceNextPatchToFail` flag meant for the new test's own request. **Fixed**
by explicitly waiting for the first test's request to fully settle.

Read `taskApi.js` and `App15.test.jsx` directly — both have comments at the
exact lines these fixes live, explaining why each is there.
