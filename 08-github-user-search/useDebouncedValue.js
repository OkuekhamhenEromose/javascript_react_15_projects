import { useState, useEffect } from 'react';

// Reusable pattern: returns a version of `value` that only updates after
// `delay` ms of no further changes - directly formalizing Snippet 29's debounce()
// as a piece of React state instead of a raw closure-based function wrapper.
export function useDebouncedValue(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup function - runs before the NEXT effect, or on unmount.
    // This is the React-idiomatic equivalent of Snippet 29's clearTimeout(timerId) -
    // without it, every keystroke would leave an orphaned timer running.
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}
