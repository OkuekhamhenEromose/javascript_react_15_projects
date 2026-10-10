import { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (trimmed === "") return; // guard clause - don't add blank todos
    onAddTodo(trimmed);
    setText("");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="todo-text">New todo</label>
      <input id="todo-text" value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Add</button>
    </form>
  );
}

export default TodoForm;

// 85%
