import { useState, useCallback, memo } from 'react';

// Render-count instrumentation, same measurement methodology as Project 5's
// useMemo proof (filterComputeCount) - the only reliable way to verify
// whether a re-render actually happened, since the visible output is
// identical in all three cases.
export const renderCounts = { plain: 0, memoNoCallback: 0, memoWithCallback: 0 };
export function resetRenderCounts() {
  renderCounts.plain = 0;
  renderCounts.memoNoCallback = 0;
  renderCounts.memoWithCallback = 0;
}

// CASE 1: no optimization at all.
function ItemPlain({ label, onSelect }) {
  renderCounts.plain++;
  return <li><button onClick={() => onSelect(label)}>{label}</button></li>;
}

// CASE 2 & 3 share the same memoized component - the difference is entirely
// in WHAT KIND OF FUNCTION the parent passes as onSelect.
const ItemMemoized = memo(function ItemMemoized({ label, onSelect, countingKey }) {
  renderCounts[countingKey]++;
  return <li><button onClick={() => onSelect(label)}>{label}</button></li>;
});

export function PerformanceDemo() {
  const [count, setCount] = useState(0); // unrelated state - triggers a PARENT re-render only
  const [selected, setSelected] = useState(null);

  // CASE 2 - BUG-PRONE: a brand-new function is created on EVERY render.
  // React.memo does a shallow prop comparison; a new function reference is
  // never === the previous one, so the memo wrapper provides NO benefit here.
  function handleSelectNoCallback(label) {
    setSelected(label);
  }

  // CASE 3 - FIXED: useCallback returns the SAME function reference across
  // re-renders (dependency array is empty - setSelected from useState is
  // guaranteed stable by React, so this callback never needs to change).
  const handleSelectWithCallback = useCallback((label) => {
    setSelected(label);
  }, []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Unrelated re-render trigger ({count})</button>
      <p data-testid="selected">Selected: {selected ?? 'none'}</p>

      <ItemPlain label="Apple" onSelect={handleSelectNoCallback} />
      <ItemMemoized label="Banana" onSelect={handleSelectNoCallback} countingKey="memoNoCallback" />
      <ItemMemoized label="Cherry" onSelect={handleSelectWithCallback} countingKey="memoWithCallback" />
    </div>
  );
}
