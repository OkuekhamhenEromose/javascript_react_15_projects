import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import NotesApp from './NotesApp';

beforeEach(() => {
  localStorage.clear();
});

async function addNote(user, title, body) {
  await user.type(screen.getByLabelText('Title'), title);
  await user.type(screen.getByLabelText('Body'), body);
  await user.click(screen.getByText('Add note'));
}

test('creating a note shows it in the list', async () => {
  const user = userEvent.setup();
  render(<NotesApp />);

  await addNote(user, 'Groceries', 'Milk, eggs, bread');

  expect(screen.getByText('Groceries')).toBeInTheDocument();
  expect(screen.getByText('Milk, eggs, bread')).toBeInTheDocument();
});

test('editing a note pre-fills the form and updates in place', async () => {
  const user = userEvent.setup();
  render(<NotesApp />);

  await addNote(user, 'Groceries', 'Milk, eggs, bread');
  await user.click(screen.getByText('Edit'));

  expect(screen.getByLabelText('Title')).toHaveValue('Groceries');
  expect(screen.getByText('Save changes')).toBeInTheDocument();

  await user.clear(screen.getByLabelText('Body'));
  await user.type(screen.getByLabelText('Body'), 'Milk, eggs, bread, butter');
  await user.click(screen.getByText('Save changes'));

  expect(screen.getByText('Milk, eggs, bread, butter')).toBeInTheDocument();
  expect(screen.queryByText('Milk, eggs, bread')).not.toBeInTheDocument();
});

test('deleting a note while it is being edited cancels the edit cleanly', async () => {
  const user = userEvent.setup();
  render(<NotesApp />);

  await addNote(user, 'Groceries', 'Milk, eggs, bread');
  await user.click(screen.getByText('Edit'));
  await user.click(screen.getByText('Delete'));

  expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
  expect(screen.getByText('Add note')).toBeInTheDocument(); // back to "create" mode, not stuck in "edit"
});

test('search debounces and filters by title or body, real timing verified', async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ delay: null });
  render(<NotesApp />);

  await addNote(user, 'Groceries', 'Milk, eggs, bread');
  await addNote(user, 'Workout plan', 'Squats and running');

  await user.type(screen.getByLabelText('Search notes'), 'squats');

  // Immediately after typing, debounce hasn't settled yet - filtering hasn't applied
  expect(screen.getByText('Groceries')).toBeInTheDocument();

  await vi.advanceTimersByTimeAsync(350); // let the debounce settle
  await act(async () => {}); // flush the chained effect (debounce settles -> SearchBar's effect -> setSearchQuery)

  expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
  expect(screen.getByText('Workout plan')).toBeInTheDocument();

  vi.useRealTimers();
});
