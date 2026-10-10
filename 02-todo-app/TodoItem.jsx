import { useState } from 'react';

function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false); // per-item, UI-only, NOT persisted
  const [draftText, setDraftText] = useState(todo.text);

  function handleSaveEdit(event) {
    event.preventDefault();
    const trimmed = draftText.trim();
    if (trimmed === '') return; // guard - don't allow saving a blank todo
    onEdit(todo.id, trimmed);
    setIsEditing(false);
  }

  function handleCancelEdit() {
    setDraftText(todo.text); // discard unsaved changes
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li>
        <form onSubmit={handleSaveEdit} noValidate>
          <input
            aria-label={`Edit ${todo.text}`}
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            autoFocus
          />
          <button type="submit">Save</button>
          <button type="button" onClick={handleCancelEdit}>Cancel</button>
        </form>
      </li>
    );
  }

  return (
    <li>
      <input
        type="checkbox"
        aria-label={`Mark ${todo.text} as done`}
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.text}
      </span>
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
}

export default TodoItem;

// 30 errors
