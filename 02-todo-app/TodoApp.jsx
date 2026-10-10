import { useState } from 'react';
import { useLocalStorageState } from './useLocalStorageState';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';

let nextId = 1;

function TodoApp() {
  const [todos, setTodos] = useLocalStorageState('todos', []);
  const [filter, setFilter] = useState('all'); // UI-only, NOT persisted - always starts on "all"

  function handleAddTodo(text) {
    setTodos([...todos, { id: nextId++, text, completed: false }]);
  }

  function handleToggle(id) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function handleDelete(id) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function handleEdit(id, newText) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  }

  const remainingCount = todos.filter((t) => !t.completed).length;

  return (
    <div>
      <h1>Todo App</h1>
      <TodoForm onAddTodo={handleAddTodo} />
      <TodoFilter currentFilter={filter} onFilterChange={setFilter} />
      <p data-testid="remaining-count">{remainingCount} item(s) left</p>
      <TodoList
        todos={todos}
        filter={filter}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default TodoApp;

// 17 errors
