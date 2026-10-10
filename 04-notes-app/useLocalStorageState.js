import { useState, useEffect } from 'react';

// Reusable pattern: state that automatically persists to localStorage.
// Directly combines Snippet 28's JSON.stringify/parse discipline with React's useEffect.
export function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    const stored = localStorage.getItem(key);
    if (stored === null) return initialValue;
    try {
      return JSON.parse(stored);
    } catch {
      // corrupted data (Snippet 28's exact lesson) - fall back safely, never crash
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
