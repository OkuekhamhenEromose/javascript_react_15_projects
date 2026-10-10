import { useState } from 'react';

function Counter({ startingValue = 0 }) {
  const [count, setCount] = useState(startingValue);

  function handleIncrement() {
    setCount(count + 1);
  }

  function handleDecrement() {
    setCount(count - 1);
  }

  function handleReset() {
    setCount(startingValue);
  }

  return (
    <div>
      <p data-testid="count-display">Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Counter;

// 5 errors
