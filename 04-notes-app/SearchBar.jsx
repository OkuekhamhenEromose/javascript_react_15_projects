import { useState, useEffect } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

function SearchBar({ onDebouncedSearchChange }) {
  const [rawQuery, setRawQuery] = useState('');
  const debouncedQuery = useDebouncedValue(rawQuery, 300);

  // Runs whenever debouncedQuery actually changes (not on every keystroke of rawQuery) -
  // this is THE standard React pattern for "sync a value outward when it settles."
  useEffect(() => {
    onDebouncedSearchChange(debouncedQuery);
  }, [debouncedQuery, onDebouncedSearchChange]);

  return (
    <input
      aria-label="Search notes"
      value={rawQuery}
      onChange={(e) => setRawQuery(e.target.value)}
      placeholder="Search notes..."
    />
  );
}

export default SearchBar;

// 8 errors
