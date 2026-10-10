import { useLocalStorageState } from './useLocalStorageState';
import CounterCard from './CounterCard';
import TotalDisplay from './TotalDisplay';
import AddCounterForm from './AddCounterForm';

let nextId = 1; // simple id generator for this demo - a real app would use a UUID or backend-assigned id

function Dashboard() {
  const [counters, setCounters] = useLocalStorageState('counters', []);

  function handleIncrement(id) {
    setCounters(counters.map((c) => (c.id === id ? { ...c, count: c.count + 1 } : c)));
  }

  function handleDecrement(id) {
    setCounters(counters.map((c) => (c.id === id ? { ...c, count: c.count - 1 } : c)));
  }

  function handleRemove(id) {
    setCounters(counters.filter((c) => c.id !== id));
  }

  function handleAddCounter(name) {
    setCounters([...counters, { id: nextId++, name, count: 0 }]);
  }

  return (
    <div>
      <h1>Counter Dashboard</h1>
      <TotalDisplay counters={counters} />
      <AddCounterForm onAddCounter={handleAddCounter} />
      {counters.length === 0 && <p>No counters yet - add one above.</p>}
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

export default Dashboard;

// 14 errors
