function ExpenseSummary({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const byCategory = expenses.reduce((groups, e) => {
    groups[e.category] = (groups[e.category] ?? 0) + e.amount;
    return groups;
  }, {});

  return (
    <div>
      <p data-testid="total">Total: ${total.toFixed(2)}</p>
      <ul data-testid="by-category">
        {Object.entries(byCategory).map(([category, amount]) => (
          <li key={category}>{category}: ${amount.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseSummary;

// 22 errors
