import { useState } from 'react';
import { useAuth } from './AuthContext';

export function LoginForm() {
  const { login, status, errorMessage } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    login(username, password);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label htmlFor="login-username">Username</label>
      <input id="login-username" value={username} onChange={(e) => setUsername(e.target.value)} />

      <label htmlFor="login-password">Password</label>
      <input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      {status === 'error' && <p role="alert">{errorMessage}</p>}
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}

export function ProtectedContent({ children }) {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Please log in to view this content.</p>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Log out</button>
      {children}
    </div>
  );
}

export function AuthApp() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Account</h1>
      {!user && <LoginForm />}
      <ProtectedContent>
        <p data-testid="secret-content">This is protected dashboard content.</p>
      </ProtectedContent>
    </div>
  );
}
