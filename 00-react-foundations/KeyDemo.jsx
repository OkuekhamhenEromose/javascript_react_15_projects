import { useState } from 'react';

function TaskItemWithNote({ label }) {
  const [note, setNote] = useState('');
  return (
    <li>
      {label}:{' '}
      <input
        aria-label={`note-for-${label}`}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </li>
  );
}

// BAD: using array index as the key
export function TaskListIndexKey({ tasks }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <TaskItemWithNote key={index} label={task} />
      ))}
    </ul>
  );
}

// GOOD: using a stable, unique id as the key
export function TaskListStableKey({ tasks }) {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItemWithNote key={task} label={task} />
      ))}
    </ul>
  );
}
