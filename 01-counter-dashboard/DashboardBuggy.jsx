import { useState } from 'react';
import CounterCard from './CounterCard';
import TotalDisplay from './TotalDisplay';

// INTENTIONAL BUG for the reader to find before checking the answer below.
function DashboardBuggy() {
  const [counters, setCounters] = useState([
    { id: 1, name: 'Coffees', count: 0 },
    { id: 2, name: 'Water', count: 0 },
  ]);

  function handleIncrement(id) {
    // BUG: increments EVERY counter's count, not just the matching one
    setCounters(counters.map((c) => ({ ...c, count: c.count + 1 })));
  }

  function handleDecrement(id) {
    setCounters(counters.map((c) => (c.id === id ? { ...c, count: c.count - 1 } : c)));
  }

  function handleRemove(id) {
    setCounters(counters.filter((c) => c.id !== id));
  }

  return (
    <div>
      <TotalDisplay counters={counters} />
      {counters.map((counter) => (
        <CounterCard
          key={counter.id}
          counter={counter}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
}

export default DashboardBuggy;
