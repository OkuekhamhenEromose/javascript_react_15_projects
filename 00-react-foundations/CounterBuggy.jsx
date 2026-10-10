import { useState } from 'react';

function CounterBuggy() {
  const [count, setCount] = useState(0);

  function handleIncrement() {
    count++; // BUG: mutating state directly instead of calling setCount
  }

  return (
    <div>
      <p data-testid="count-display">Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
    </div>
  );
}

export default CounterBuggy;
