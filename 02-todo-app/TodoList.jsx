import TodoItem from './TodoItem';

function getFilteredTodos(todos, filter) {
  if (filter === 'active') return todos.filter((t) => !t.completed);
  if (filter === 'completed') return todos.filter((t) => t.completed);
  return todos; // "all"
}

function TodoList({ todos, filter, onToggle, onDelete, onEdit }) {
  const filteredTodos = getFilteredTodos(todos, filter);

  if (filteredTodos.length === 0) {
    return <p>No {filter === 'all' ? '' : filter} todos to show.</p>;
  }

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}

export default TodoList;

// 15 errors
