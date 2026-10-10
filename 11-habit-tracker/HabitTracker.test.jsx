import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import HabitTracker from './HabitTracker';

beforeEach(() => {
  localStorage.clear();
  vi.setSystemTime(new Date('2026-06-15T12:00:00Z'));
});
afterEach(() => {
  vi.useRealTimers();
});

test('adding a habit shows it with a 0-day streak', async () => {
  const user = userEvent.setup();
  render(<HabitTracker />);

  await user.type(screen.getByLabelText('New habit'), 'Drink water');
  await user.click(screen.getByText('Add habit'));

  expect(screen.getByText('Drink water')).toBeInTheDocument();
  expect(screen.getByText(/Current streak: 0 day\(s\)/)).toBeInTheDocument();
});

test('marking a habit done today increments the streak to 1 and toggles the button', async () => {
  const user = userEvent.setup();
  render(<HabitTracker />);

  await user.type(screen.getByLabelText('New habit'), 'Drink water');
  await user.click(screen.getByText('Add habit'));

  await user.click(screen.getByText('Mark done'));

  expect(screen.getByText('Done today ✓')).toBeInTheDocument();
  expect(screen.getByText(/Current streak: 1 day\(s\)/)).toBeInTheDocument();
});

test('unmarking today correctly decrements the streak back down', async () => {
  const user = userEvent.setup();
  render(<HabitTracker />);

  await user.type(screen.getByLabelText('New habit'), 'Drink water');
  await user.click(screen.getByText('Add habit'));
  await user.click(screen.getByText('Mark done'));
  await user.click(screen.getByText('Done today ✓')); // click again to un-mark

  expect(screen.getByText('Mark done')).toBeInTheDocument();
  expect(screen.getByText(/Current streak: 0 day\(s\)/)).toBeInTheDocument();
});

test('two habits maintain completely independent streaks', async () => {
  const user = userEvent.setup();
  render(<HabitTracker />);

  await user.type(screen.getByLabelText('New habit'), 'Drink water');
  await user.click(screen.getByText('Add habit'));
  await user.type(screen.getByLabelText('New habit'), 'Read 20 pages');
  await user.click(screen.getByText('Add habit'));

  const waterRow = screen.getByText('Drink water').closest('li');
  await userEvent.setup().click(within(waterRow).getByText('Mark done'));

  const readRow = screen.getByText('Read 20 pages').closest('li');
  expect(within(waterRow).getByText(/Current streak: 1 day\(s\)/)).toBeInTheDocument();
  expect(within(readRow).getByText(/Current streak: 0 day\(s\)/)).toBeInTheDocument();
});
