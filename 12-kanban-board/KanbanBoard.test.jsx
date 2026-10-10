import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KanbanBoard from './KanbanBoard';

test('renders initial tasks in their correct columns', () => {
  render(<KanbanBoard />);

  const todoColumn = screen.getByTestId('column-todo');
  const doingColumn = screen.getByTestId('column-doing');

  expect(within(todoColumn).getByText('Design mockups')).toBeInTheDocument();
  expect(within(todoColumn).getByText('Write API docs')).toBeInTheDocument();
  expect(within(doingColumn).getByText('Set up project repo')).toBeInTheDocument();
});

test('adding a task adds it to the CORRECT column only', async () => {
  const user = userEvent.setup();
  render(<KanbanBoard />);

  const doneColumn = screen.getByTestId('column-done');
  await user.type(within(doneColumn).getByLabelText('New task title'), 'Ship v1.0');
  await user.click(within(doneColumn).getByText('Add'));

  expect(within(doneColumn).getByText('Ship v1.0')).toBeInTheDocument();
  expect(screen.getByTestId('column-todo')).not.toHaveTextContent('Ship v1.0');
});

test('moving a task between columns removes it from source and adds it to destination', async () => {
  const user = userEvent.setup();
  render(<KanbanBoard />);

  const todoColumn = screen.getByTestId('column-todo');
  await user.selectOptions(within(todoColumn).getByLabelText('Move Design mockups'), 'done');

  expect(within(screen.getByTestId('column-todo')).queryByText('Design mockups')).not.toBeInTheDocument();
  expect(within(screen.getByTestId('column-done')).getByText('Design mockups')).toBeInTheDocument();
});

test('moving a task does NOT affect other tasks in either column', async () => {
  const user = userEvent.setup();
  render(<KanbanBoard />);

  const todoColumn = screen.getByTestId('column-todo');
  await user.selectOptions(within(todoColumn).getByLabelText('Move Design mockups'), 'doing');

  // "Write API docs" should REMAIN in To Do - only "Design mockups" moved
  expect(within(screen.getByTestId('column-todo')).getByText('Write API docs')).toBeInTheDocument();
  // "Set up project repo" should still be in Doing, alongside the newly moved task
  const doingColumn = screen.getByTestId('column-doing');
  expect(within(doingColumn).getByText('Set up project repo')).toBeInTheDocument();
  expect(within(doingColumn).getByText('Design mockups')).toBeInTheDocument();
});

test('deleting a task removes it from its column and its underlying data entirely', async () => {
  const user = userEvent.setup();
  render(<KanbanBoard />);

  const todoColumn = screen.getByTestId('column-todo');
  const mockupsRow = within(todoColumn).getByText('Design mockups').closest('li');
  await user.click(within(mockupsRow).getByText('Delete'));

  expect(within(screen.getByTestId('column-todo')).queryByText('Design mockups')).not.toBeInTheDocument();
  // The other task in the same column is unaffected
  expect(within(screen.getByTestId('column-todo')).getByText('Write API docs')).toBeInTheDocument();
});
