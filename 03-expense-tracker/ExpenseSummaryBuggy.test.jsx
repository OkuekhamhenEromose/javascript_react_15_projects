import { render, screen } from '@testing-library/react';
import ExpenseSummaryBuggy from './ExpenseSummaryBuggy';

test.fails('DEBUGGING EXERCISE: category breakdown is corrupted without an initial reduce value', () => {
  const expenses = [
    { id: 1, description: 'Groceries', amount: 30, category: 'Food' },
    { id: 2, description: 'Bus ticket', amount: 5, category: 'Transport' },
  ];
  render(<ExpenseSummaryBuggy expenses={expenses} />);

  const output = screen.getByTestId('by-category').textContent;
  console.log('Category breakdown output:', output);

  // Expected: "Food: $30.00" as a standalone category entry - but with the FIRST
  // expense object used as the starting accumulator instead of {}, the first
  // expense's OWN fields get treated as "existing category totals" and mutated.
  expect(screen.getByText(/^Food: \$30\.00$/)).toBeInTheDocument(); // will FAIL
});
