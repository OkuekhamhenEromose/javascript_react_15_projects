function TotalDisplay({ counters }) {
  const total = counters.reduce((sum, counter) => sum + counter.count, 0);
  return (
    <div data-testid="total-display">
      <strong>Total: {total}</strong>
    </div>
  );
}

export default TotalDisplay;
