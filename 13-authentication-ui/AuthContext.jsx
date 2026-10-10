import { createContext, useContext, useState, useEffect } from 'react';
import { mockLogin } from './mockAuthApi';

const AuthContext = createContext(null);

// SECURITY NOTE: storing a token in localStorage means ANY JavaScript running
// on this page - including a malicious script injected via an XSS vulnerability
// elsewhere in the app - can read it. Real production apps typically prefer an
// httpOnly cookie (set by the SERVER, invisible to JavaScript entirely) for
// exactly this reason. localStorage is used here only because this is a
// client-only educational demo with no real server to set a cookie from.
const TOKEN_STORAGE_KEY = 'mock_auth_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // true until the initial session check completes
  const [status, setStatus] = useState('idle'); // idle | loading | error
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (storedToken) {
      setUser({ name: 'Restored Session' });
    }
    setIsCheckingAuth(false); // the check is complete, one way or the other
  }, []);

  async function login(username, password) {
    setStatus('loading');
    setErrorMessage('');
    try {
      const result = await mockLogin(username, password);
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      setUser({ name: result.name });
      setStatus('idle');
    } catch (error) {
      setErrorMessage(error.message);
      setStatus('error');
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }

  const value = { user, status, errorMessage, login, logout, isCheckingAuth };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
