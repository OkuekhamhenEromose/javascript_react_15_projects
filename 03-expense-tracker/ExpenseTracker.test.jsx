import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExpenseTracker from './ExpenseTracker';

beforeEach(() => {
  localStorage.clear();
});

async function addExpense(user, description, amount, category) {
  await user.type(screen.getByLabelText('Description'), description);
  await user.type(screen.getByLabelText('Amount'), amount);
  if (category) await user.selectOptions(screen.getByLabelText('Category'), category);
  await user.click(screen.getByText('Add expense'));
}

test('adding a valid expense updates the list and total', async () => {
  const user = userEvent.setup();
  render(<ExpenseTracker />);

  await addExpense(user, 'Groceries', '45.50', 'Food');

  expect(screen.getByText(/Groceries/)).toBeInTheDocument();
  expect(screen.getByTestId('total')).toHaveTextContent('Total: $45.50');
});

test('rejects a blank description', async () => {
  const user = userEvent.setup();
  render(<ExpenseTracker />);

  await user.type(screen.getByLabelText('Amount'), '20');
  await user.click(screen.getByText('Add expense'));

  expect(screen.getByRole('alert')).toHaveTextContent('Description is required.');
  expect(screen.getByText('No expenses recorded yet.')).toBeInTheDocument();
});

test('rejects a non-numeric amount', async () => {
  const user = userEvent.setup();
  render(<ExpenseTracker />);

  await user.type(screen.getByLabelText('Description'), 'Coffee');
  await user.type(screen.getByLabelText('Amount'), 'abc');
  await user.click(screen.getByText('Add expense'));

  expect(screen.getByRole('alert')).toHaveTextContent('Amount must be a valid number.');
});

test('rejects a zero or negative amount', async () => {
  const user = userEvent.setup();
  render(<ExpenseTracker />);

  await user.type(screen.getByLabelText('Description'), 'Refund'); 
  await user.type(screen.getByLabelText('Amount'), '-5');
  await user.click(screen.getByText('Add expense'));

  expect(screen.getByRole('alert')).toHaveTextContent('Amount must be greater than zero.');
});

test('total and category breakdown correctly sum multiple expenses', async () => {
  const user = userEvent.setup();
  render(<ExpenseTracker />);

  await addExpense(user, 'Groceries', '30', 'Food');
  await addExpense(user, 'Bus ticket', '5', 'Transport');
  await addExpense(user, 'Snacks', '10', 'Food');

  expect(screen.getByTestId('total')).toHaveTextContent('Total: $45.00');
  const categoryList = screen.getByTestId('by-category');
  expect(categoryList).toHaveTextContent('Food: $40.00');
  expect(categoryList).toHaveTextContent('Transport: $5.00');
});

test('deleting an expense removes it and updates the total', async () => {
  const user = userEvent.setup();
  render(<ExpenseTracker />);

  await addExpense(user, 'Groceries', '30', 'Food');
  await addExpense(user, 'Bus ticket', '5', 'Transport');

  await user.click(screen.getAllByText('Delete')[0]);

  expect(screen.queryByText(/Groceries/)).not.toBeInTheDocument();
  expect(screen.getByText(/Bus ticket/)).toBeInTheDocument();
  expect(screen.getByTestId('total')).toHaveTextContent('Total: $5.00');
});
