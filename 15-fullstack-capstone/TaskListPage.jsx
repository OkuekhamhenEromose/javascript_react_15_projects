import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDebouncedValue } from './useDebouncedValue';
import { getTasks, patchTask } from './taskApi';

function TaskListPage() {
  const [rawSearch, setRawSearch] = useState('');
  const debouncedSearch = useDebouncedValue(rawSearch, 300);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('loading');
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [saveError, setSaveError] = useState('');

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    getTasks(debouncedSearch, page)
      .then((result) => {
        if (ignore) return;
        setTasks(result.tasks);
        setTotalPages(result.totalPages);
        setStatus('success');
      })
      .catch(() => { if (!ignore) setStatus('error'); });
    return () => { ignore = true; };
  }, [debouncedSearch, page]);

  async function handleToggleComplete(task) {
    setSaveError('');
    const previousTasks = tasks; // snapshot for rollback

    // OPTIMISTIC UPDATE: update the UI immediately, before the server confirms anything.
    // This makes the app FEEL instant, at the cost of needing a rollback plan if it fails.
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));

    try {
      await patchTask(task.id, { completed: !task.completed });
      // success - the optimistic update was correct, nothing more to do
    } catch (error) {
      // ROLLBACK: the server rejected the change - restore the exact previous state
      setTasks(previousTasks);
      setSaveError(`Could not update "${task.title}": ${error.message}`);
    }
  }

  return (
    <div>
      <h1>Tasks</h1>
      <label htmlFor="task-search">Search tasks</label>
      <input id="task-search" value={rawSearch} onChange={(e) => setRawSearch(e.target.value)} />

      {saveError && <p role="alert">{saveError}</p>}
      {status === 'loading' && <p>Loading...</p>}
      {status === 'error' && <p role="alert">Could not load tasks.</p>}
      {status === 'success' && (
        <>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  aria-label={`Mark ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                />
                <Link to={`/tasks/${task.id}`}>{task.title}</Link>
              </li>
            ))}
          </ul>
          {tasks.length === 0 && <p>No tasks found.</p>}
          <div>
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
            <span data-testid="page-indicator"> Page {page} of {totalPages} </span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskListPage;
