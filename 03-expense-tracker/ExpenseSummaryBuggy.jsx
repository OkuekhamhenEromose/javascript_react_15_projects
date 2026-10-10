// INTENTIONAL BUG - directly reproducing Snippet 13's "missing initial value" lesson,
// now inside a real component instead of an isolated snippet.
function ExpenseSummaryBuggy({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // BUG: no initial value ({}) provided to reduce
  const byCategory = expenses.reduce((groups, e) => {
    groups[e.category] = (groups[e.category] ?? 0) + e.amount;
    return groups;
  });

  return (
    <div>
      <p data-testid="total">Total: ${total.toFixed(2)}</p>
      <ul data-testid="by-category">
        {Object.entries(byCategory).map(([category, amount]) => (
          <li key={category}>{category}: {typeof amount === 'number' ? `$${amount.toFixed(2)}` : String(amount)}</li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseSummaryBuggy;
