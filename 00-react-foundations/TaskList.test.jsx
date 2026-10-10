import { render, screen, rerender } from '@testing-library/react';
import TaskList from './TaskList';

test('renders one list item per task', () => {
  const tasks = [
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Walk dog', done: true },
    { id: 3, text: 'Write report', done: false },
  ];
  render(<TaskList tasks={tasks} />);
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  expect(screen.getByText(/Buy milk/)).toBeInTheDocument();
  expect(screen.getByText(/Walk dog/)).toBeInTheDocument();
});

test('shows the empty state when there are no tasks', () => {
  render(<TaskList tasks={[]} />);
  expect(screen.getByText('No tasks yet.')).toBeInTheDocument();
  expect(screen.queryByRole('list')).not.toBeInTheDocument();
});

test('reflects done vs pending status per task', () => {
  const tasks = [
    { id: 1, text: 'Buy milk', done: false },
    { id: 2, text: 'Walk dog', done: true },
  ];
  render(<TaskList tasks={tasks} />);
  expect(screen.getByText(/Buy milk.*pending/)).toBeInTheDocument();
  expect(screen.getByText(/Walk dog.*done/)).toBeInTheDocument();
});
