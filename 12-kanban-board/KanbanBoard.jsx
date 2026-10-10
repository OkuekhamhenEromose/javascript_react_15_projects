import { useState } from 'react';

const INITIAL_TASKS = {
  1: { id: 1, title: 'Design mockups' },
  2: { id: 2, title: 'Set up project repo' },
  3: { id: 3, title: 'Write API docs' },
};

const INITIAL_COLUMNS = [
  { id: 'todo', title: 'To Do', taskIds: [1, 3] },
  { id: 'doing', title: 'In Progress', taskIds: [2] },
  { id: 'done', title: 'Done', taskIds: [] },
];

let nextTaskId = 4;

function KanbanBoard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS); // normalized: { [id]: task }
  const [columns, setColumns] = useState(INITIAL_COLUMNS); // ordered, holds taskIds only

  function handleAddTask(columnId, title) {
    const newTask = { id: nextTaskId++, title };
    setTasks({ ...tasks, [newTask.id]: newTask }); // add to the flat lookup
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, taskIds: [...col.taskIds, newTask.id] } : col
      )
    );
  }

  function handleMoveTask(taskId, fromColumnId, toColumnId) {
    if (fromColumnId === toColumnId) return;
    setColumns(
      columns.map((col) => {
        if (col.id === fromColumnId) {
          return { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) };
        }
        if (col.id === toColumnId) {
          return { ...col, taskIds: [...col.taskIds, taskId] };
        }
        return col;
      })
    );
  }

  function handleDeleteTask(taskId, columnId) {
    setColumns(
      columns.map((col) =>
        col.id === columnId ? { ...col, taskIds: col.taskIds.filter((id) => id !== taskId) } : col
      )
    );
    const { [taskId]: removed, ...remainingTasks } = tasks; // remove from the lookup too
    setTasks(remainingTasks);
  }

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {columns.map((column) => (
        <div key={column.id} data-testid={`column-${column.id}`}>
          <h2>{column.title}</h2>
          <AddTaskForm onAdd={(title) => handleAddTask(column.id, title)} />
          <ul>
            {column.taskIds.map((taskId) => {
              const task = tasks[taskId];
              return (
                <li key={taskId}>
                  {task.title}
                  <select
                    aria-label={`Move ${task.title}`}
                    value={column.id}
                    onChange={(e) => handleMoveTask(taskId, column.id, e.target.value)}
                  >
                    {columns.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDeleteTask(taskId, column.id)}>Delete</button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AddTaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  function handleSubmit(event) {
    event.preventDefault();
    if (title.trim() === '') return;
    onAdd(title.trim());
    setTitle('');
  }
  return (
    <form onSubmit={handleSubmit} noValidate>
      <input aria-label="New task title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

export default KanbanBoard;
