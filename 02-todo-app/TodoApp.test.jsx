import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoApp from './TodoApp';

beforeEach(() => {
  localStorage.clear();
});

async function addTodo(user, text) {
  await user.type(screen.getByLabelText('New todo'), text);
  await user.click(screen.getByText('Add'));
}

test('adding a todo shows it in the list and updates remaining count', async () => {
  const user = userEvent.setup();
  render(<TodoApp />);

  await addTodo(user, 'Buy milk');

  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(screen.getByTestId('remaining-count')).toHaveTextContent('1 item(s) left');
});

test('toggling a todo marks it completed and updates remaining count', async () => {
  const user = userEvent.setup();
  render(<TodoApp />);

  await addTodo(user, 'Buy milk');
  await addTodo(user, 'Walk dog');

  await user.click(screen.getByLabelText('Mark Buy milk as done'));

  expect(screen.getByLabelText('Mark Buy milk as done')).toBeChecked();
  expect(screen.getByTestId('remaining-count')).toHaveTextContent('1 item(s) left');
});

test('deleting a todo removes only that todo', async () => {
  const user = userEvent.setup();
  render(<TodoApp />);

  await addTodo(user, 'Buy milk');
  await addTodo(user, 'Walk dog');

  const milkItem = screen.getByText('Buy milk').closest('li');
  await user.click(within(milkItem).getByText('Delete'));

  expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  expect(screen.getByText('Walk dog')).toBeInTheDocument();
});

test('editing a todo updates its text without affecting others', async () => {
  const user = userEvent.setup();
  render(<TodoApp />);

  await addTodo(user, 'Buy milk');
  await addTodo(user, 'Walk dog');

  const milkItem = screen.getByText('Buy milk').closest('li');
  await user.click(within(milkItem).getByText('Edit'));

  const editInput = screen.getByLabelText('Edit Buy milk');
  await user.clear(editInput);
  await user.type(editInput, 'Buy oat milk');
  await user.click(screen.getByText('Save'));

  expect(screen.getByText('Buy oat milk')).toBeInTheDocument();
  expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  expect(screen.getByText('Walk dog')).toBeInTheDocument();
});

test('canceling an edit discards changes', async () => {
  const user = userEvent.setup();
  render(<TodoApp />);

  await addTodo(user, 'Buy milk');
  await user.click(screen.getByText('Edit'));

  const editInput = screen.getByLabelText('Edit Buy milk');
  await user.clear(editInput);
  await user.type(editInput, 'Something else entirely');
  await user.click(screen.getByText('Cancel'));

  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(screen.queryByText('Something else entirely')).not.toBeInTheDocument();
});

test('filtering shows only active or only completed todos', async () => {
  const user = userEvent.setup();
  render(<TodoApp />);

  await addTodo(user, 'Buy milk');
  await addTodo(user, 'Walk dog');
  await user.click(screen.getByLabelText('Mark Buy milk as done'));

  await user.click(screen.getByRole('button', { name: 'active' }));
  expect(screen.queryByText('Buy milk')).not.toBeInTheDocument();
  expect(screen.getByText('Walk dog')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'completed' }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(screen.queryByText('Walk dog')).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'all' }));
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(screen.getByText('Walk dog')).toBeInTheDocument();
});

test('does not add a blank todo', async () => {
  const user = userEvent.setup();
  render(<TodoApp />);
  await user.click(screen.getByText('Add'));
  expect(screen.getByText('No todos to show.')).toBeInTheDocument();
});
