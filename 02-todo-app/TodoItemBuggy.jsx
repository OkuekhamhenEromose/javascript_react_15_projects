import { useState } from 'react';

// INTENTIONAL BUG: draftText is initialized ONCE from the initial todo.text,
// but if the SAME component instance gets reused for a different todo (via key reuse
// or prop changes without remounting), the draft can go stale. Simplified here to show
// the more common real version of this bug: forgetting to sync draftText when editing starts.
function TodoItemBuggy({ todo, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(''); // BUG: doesn't initialize from todo.text

  function startEditing() {
    setIsEditing(true);
    // BUG: forgot to reset draftText to todo.text here before showing the edit box
  }

  function handleSave(event) {
    event.preventDefault();
    onEdit(todo.id, draftText);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <li>
        <form onSubmit={handleSave}>
          <input aria-label={`Edit ${todo.text}`} value={draftText} onChange={(e) => setDraftText(e.target.value)} />
          <button type="submit">Save</button>
        </form>
      </li>
    );
  }

  return (
    <li>
      {todo.text}
      <button onClick={startEditing}>Edit</button>
    </li>
  );
}

export default TodoItemBuggy;
