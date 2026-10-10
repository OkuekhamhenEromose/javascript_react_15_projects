function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p>No tasks yet.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.text} {task.done ? '(done)' : '(pending)'}
        </li>
      ))}
    </ul>
  );
}

export default TaskList;

// 7 errors
