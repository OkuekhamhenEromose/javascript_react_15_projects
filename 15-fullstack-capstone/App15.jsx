import { useState, useEffect } from 'react';
import { useParams, Link, Navigate, BrowserRouter, Routes, Route } from 'react-router-dom';
import { getTaskById } from './taskApi';
import { AuthProvider, useAuth } from './AuthContext';
import { LoginForm } from './AuthComponents';
import TaskListPage from './TaskListPage';

function TaskDetailPage() {
  const { id } = useParams(); // route params - the new routing-specific concept
  const [status, setStatus] = useState('loading');
  const [task, setTask] = useState(null);

  useEffect(() => {
    let ignore = false;
    setStatus('loading');
    getTaskById(id)
      .then((data) => { if (!ignore) { setTask(data); setStatus('success'); } })
      .catch(() => { if (!ignore) setStatus('error'); });
    return () => { ignore = true; };
  }, [id]);

  if (status === 'loading') return <p>Loading task...</p>;
  if (status === 'error') return <p role="alert">Task not found.</p>;

  return (
    <div>
      <Link to="/">Back to list</Link>
      <h1>{task.title}</h1>
      <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
    </div>
  );
}

// Protected route guard - reuses Project 13's AuthContext directly.
function RequireAuth({ children }) {
  const { user, isCheckingAuth } = useAuth();
  if (isCheckingAuth) {
    return <p>Checking session...</p>; // don't redirect prematurely - wait for the real answer
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function LoginPage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/" replace />;
  return <LoginForm />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><TaskListPage /></RequireAuth>} />
      <Route path="/tasks/:id" element={<RequireAuth><TaskDetailPage /></RequireAuth>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
export { TaskDetailPage, RequireAuth, LoginPage, AppRoutes };
