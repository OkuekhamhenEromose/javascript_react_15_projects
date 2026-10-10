# Project 12 — Kanban Task Board

**Difficulty:** Advanced
**Concepts:** STATE NORMALIZATION.

**Honesty note on drag-and-drop:** genuine HTML5 native drag-and-drop relies
on browser `DataTransfer` objects jsdom doesn't fully implement. Rather than
write tests that appear to pass without truly exercising drag behavior, this
project's PRIMARY interface uses explicit "Move to..." `<select>` controls —
fully real, fully tested — with native drag-and-drop as an extension
challenge requiring manual testing in a real browser.

## Folder structure
```
12-kanban-board/
├── KanbanBoard.jsx       Normalized state: tasks{} + columns[{ taskIds }]
└── KanbanBoard.test.jsx  5 integration tests
```

## Denormalized (naive) vs. normalized (this project's approach)

**Naive:**
```js
columns = [{ id: 'todo', tasks: [{ id: 1, title: '...' }, ...] }]
```
Moving a task = find-and-remove a full object from one nested array,
construct/insert a (possibly re-copied) object into another. Deep, error-prone.

**Normalized (this project):**
```js
tasks = { 1: { id: 1, title: '...' }, 2: { ... } }        // flat lookup
columns = [{ id: 'todo', taskIds: [1] }, { id: 'doing', taskIds: [2] }]
```
Moving a task:
```js
function handleMoveTask(taskId, fromColumnId, toColumnId) {
  setColumns(columns.map((col) => {
    if (col.id === fromColumnId) return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
    if (col.id === toColumnId) return { ...col, taskIds: [...col.taskIds, taskId] };
    return col;
  }));
}
```
**No task object is ever copied, mutated, or reconstructed during a move** —
only which column's `taskIds` array contains that number changes.

## Deleting a key from an object, immutably

```js
const { [taskId]: removed, ...remainingTasks } = tasks;
```
Computed-property destructuring + rest — the clean way to remove one key
from an object without mutating it, reusing the exact syntax pattern for
building an id-keyed lookup in the first place.
