import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import MovieSearch from './MovieSearch';

async function search(user, text) {
  await user.type(screen.getByLabelText('Search movies'), text);
  // A single large advance doesn't reliably flush the debounce timer AND the
  // subsequent mock-API timer it triggers - splitting into smaller sequential
  // advances (proven via direct diagnostic measurement) reliably resolves both.
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
  await act(async () => { await vi.advanceTimersByTimeAsync(150); });
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  vi.useRealTimers();
});

test('shows paginated results with correct page indicator', async () => {
  const user = userEvent.setup({ delay: null });
  render(<MovieSearch />);

  await search(user, 'the');
  // "The Matrix", "The Matrix Reloaded", "The Matrix Revolutions", "The Dark Knight",
  // "The Dark Knight Rises" = 5 matches, page size 3 -> 2 pages
  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 1 of 2');
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});

test('Next/Previous buttons navigate pages correctly', async () => {
  const user = userEvent.setup({ delay: null });
  render(<MovieSearch />);

  await search(user, 'the');
  expect(screen.getByText('Previous')).toBeDisabled(); // can't go before page 1

  await user.click(screen.getByText('Next'));
  await act(async () => { await vi.advanceTimersByTimeAsync(125); });
  await act(async () => { await vi.advanceTimersByTimeAsync(125); });

  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 2 of 2');
  expect(screen.getByText('Next')).toBeDisabled(); // can't go past the last page
  expect(screen.getAllByRole('listitem')).toHaveLength(2); // remaining 2 of 5 matches
});

test('CRITICAL: starting a NEW search while on page 2+ resets to page 1', async () => {
  const user = userEvent.setup({ delay: null });
  render(<MovieSearch />);

  await search(user, 'the');
  await user.click(screen.getByText('Next'));
  await act(async () => { await vi.advanceTimersByTimeAsync(125); });
  await act(async () => { await vi.advanceTimersByTimeAsync(125); });
  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 2 of 2');

  // Now clear and search something ELSE entirely, with a SMALLER result set
  await user.clear(screen.getByLabelText('Search movies'));
  await search(user, 'inception');

  // Must show page 1 of Inception's results, NOT try to show "page 2" of a 1-result set
  expect(screen.getByTestId('page-indicator')).toHaveTextContent('Page 1 of 1');
  expect(screen.getByText(/Inception/)).toBeInTheDocument();
});

test('shows the EMPTY state (not error) for a genuinely successful search with zero matches', async () => {
  const user = userEvent.setup({ delay: null });
  render(<MovieSearch />);

  await search(user, 'zzz-nonexistent-movie');

  expect(screen.getByText('No movies found for "zzz-nonexistent-movie".')).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument(); // NOT treated as an error
});
